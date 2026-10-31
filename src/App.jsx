import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_LEADS } from './data/initialLeads';
import { leadsApi } from './api/leadsApi';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { LeadTable } from './components/LeadTable';
import { KanbanBoard } from './components/KanbanBoard';
import { ScraperSimulator } from './components/ScraperSimulator';
import { ReminderCenter } from './components/ReminderCenter';
import { PitchModal } from './components/PitchModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { AddLeadModal } from './components/AddLeadModal';
import { OutreachGuideModal } from './components/OutreachGuideModal';
import { exportLeadsToCSV } from './utils/csvExport';
import { sound } from './utils/sound';

const STORAGE_KEY = 'leadscout_us_leads_v3';
const SOUND_KEY = 'leadscout_sound_enabled';

export function App() {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_LEADS;
  });

  const [dbStatus, setDbStatus] = useState('connecting');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  });

  const [activeTab, setActiveTab] = useState('table');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const [pitchLead, setPitchLead] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Sync with Node.js MySQL backend on mount
  useEffect(() => {
    let isMounted = true;
    async function initBackend() {
      try {
        const health = await leadsApi.checkHealth();
        if (health.status === 'healthy') {
          if (isMounted) setDbStatus('connected');
          const serverLeads = await leadsApi.getLeads();
          if (isMounted && Array.isArray(serverLeads) && serverLeads.length > 0) {
            setLeads(serverLeads);
          }
        } else {
          if (isMounted) setDbStatus('offline');
        }
      } catch (e) {
        console.warn('MySQL backend not reachable, using offline cache:', e.message);
        if (isMounted) setDbStatus('offline');
      }
    }

    initBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    const currentLead = leads.find(l => l.id === leadId);
    const updatedNotes = currentLead ? [...(currentLead.notes || [])] : [];
    if (currentLead && currentLead.status !== newStatus) {
      updatedNotes.unshift({
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        text: `Pipeline stage moved to "${newStatus}".`
      });
    }

    // 1. Immediately update local state for instant UI response
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: newStatus,
            notes: updatedNotes
          };
        }
        return lead;
      })
    );

    // 2. Immediately persist to MySQL database!
    try {
      await leadsApi.updateLead(leadId, {
        status: newStatus,
        notes: updatedNotes
      });
      console.log(`[MySQL Synced] Lead "${leadId}" status updated to "${newStatus}".`);
    } catch (err) {
      console.warn('Could not sync status change with MySQL:', err.message);
    }

    if (newStatus === 'won') {
      if (soundEnabled) sound.playSuccess();
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
    } else if (newStatus === 'contacted' || newStatus === 'meeting') {
      if (soundEnabled) sound.playBlip();
    }
  };

  const handleUpdateFollowupDate = async (leadId, newDate) => {
    const currentLead = leads.find(l => l.id === leadId);
    const updatedNotes = currentLead ? [...(currentLead.notes || [])] : [];
    if (newDate) {
      updatedNotes.unshift({
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        text: `Follow-up set for: ${new Date(newDate).toLocaleString()}.`
      });
    }
    const targetStatus = currentLead && currentLead.status === 'new' && newDate ? 'followup' : currentLead?.status || 'new';

    // 1. Immediately update local state for instant UI response
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            followupDate: newDate,
            status: targetStatus,
            notes: updatedNotes
          };
        }
        return lead;
      })
    );

    // 2. Immediately persist to MySQL database!
    try {
      await leadsApi.updateLead(leadId, {
        followupDate: newDate,
        status: targetStatus,
        notes: updatedNotes
      });
      console.log(`[MySQL Synced] Lead "${leadId}" follow-up date updated.`);
    } catch (err) {
      console.warn('Could not sync follow-up with MySQL:', err.message);
    }
  };

  const handleAddNote = (leadId, noteText) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          const newNotes = [
            {
              id: `n-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              text: noteText
            },
            ...(lead.notes || [])
          ];
          return {
            ...lead,
            notes: newNotes
          };
        }
        return lead;
      })
    );

    leadsApi.addNote(leadId, noteText).catch(err => console.warn('Could not sync note with MySQL:', err.message));

    if (detailLead && detailLead.id === leadId) {
      setDetailLead(prev => ({
        ...prev,
        notes: [
          { id: `n-${Date.now()}`, date: new Date().toISOString().split('T')[0], text: noteText },
          ...(prev.notes || [])
        ]
      }));
    }
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm('Remove this lead record from database?')) {
      setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
      leadsApi.deleteLead(leadId).catch(err => console.warn('Could not sync delete with MySQL:', err.message));
      if (soundEnabled) sound.playBlip();
    }
  };

  const handleAddLead = (newLead) => {
    setLeads(prevLeads => [newLead, ...prevLeads]);
    leadsApi.createLead(newLead).catch(err => console.warn('Could not sync new lead with MySQL:', err.message));
  };

  const handleAddScrapedLeads = (newLeads) => {
    setLeads(prevLeads => [...newLeads, ...prevLeads]);
    leadsApi.batchImportLeads(newLeads).catch(err => console.warn('Could not sync scraped leads with MySQL:', err.message));
    setActiveTab('table');
  };

  const handleExportCSV = () => {
    exportLeadsToCSV(leads);
    if (soundEnabled) sound.playSuccess();
  };

  const handleResetLeads = async () => {
    if (window.confirm('Reset database back to the default 100 curated US businesses without websites in MySQL?')) {
      try {
        if (dbStatus === 'connected') {
          const freshData = await leadsApi.resetDatabase();
          if (Array.isArray(freshData) && freshData.length > 0) {
            setLeads(freshData);
          } else {
            setLeads(INITIAL_LEADS);
          }
        } else {
          setLeads(INITIAL_LEADS);
        }
        localStorage.removeItem(STORAGE_KEY);
        if (soundEnabled) sound.playSuccess();
      } catch (err) {
        console.error('Reset error:', err);
        setLeads(INITIAL_LEADS);
      }
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingRemindersCount = leads.filter(l => {
    if (!l.followupDate || l.status === 'won' || l.status === 'lost') return false;
    const datePart = l.followupDate.split('T')[0];
    return datePart <= todayStr;
  }).length;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col relative selection:bg-sky-500/20 selection:text-sky-950 font-sans">
      {/* Hardware-Accelerated 3D Ambient Background (Pure GPU Radial Gradients, Zero Blur Overhead) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#f8fafc]">
        <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full [background:radial-gradient(circle,rgba(56,189,248,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute bottom-[-5%] right-[5%] w-[600px] h-[600px] rounded-full [background:radial-gradient(circle,rgba(99,102,241,0.10)_0%,transparent_70%)]"></div>
        <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full [background:radial-gradient(circle,rgba(14,165,233,0.12)_0%,transparent_70%)]"></div>
      </div>

      {/* Floating 3D Water Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leadsCount={leads.length}
        pendingRemindersCount={pendingRemindersCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetLeads={handleResetLeads}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Spatial Stage */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-6 sm:pb-8">
        <StatsOverview
          leads={leads}
          onSelectFilterStatus={(status) => {
            setActiveTab('table');
            setActiveStatusFilter(status);
          }}
          onOpenReminders={() => setActiveTab('reminders')}
        />

        {activeTab === 'table' && (
          <LeadTable
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onUpdateFollowupDate={handleUpdateFollowupDate}
            onOpenPitchModal={(lead) => setPitchLead(lead)}
            onOpenDetailModal={(lead) => setDetailLead(lead)}
            onDeleteLead={handleDeleteLead}
            activeCategoryFilter={activeCategoryFilter}
            setActiveCategoryFilter={setActiveCategoryFilter}
            activeStatusFilter={activeStatusFilter}
            setActiveStatusFilter={setActiveStatusFilter}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onOpenPitchModal={(lead) => setPitchLead(lead)}
            onOpenDetailModal={(lead) => setDetailLead(lead)}
          />
        )}

        {activeTab === 'scraper' && (
          <ScraperSimulator
            onAddScrapedLeads={handleAddScrapedLeads}
            existingLeadsCount={leads.length}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderCenter
            leads={leads}
            onUpdateFollowupDate={handleUpdateFollowupDate}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onOpenPitchModal={(lead) => setPitchLead(lead)}
            onOpenDetailModal={(lead) => setDetailLead(lead)}
          />
        )}
      </main>

      {/* VisionOS Floating Modals */}
      {pitchLead && (
        <PitchModal
          lead={pitchLead}
          onClose={() => setPitchLead(null)}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onAddNote={handleAddNote}
        />
      )}

      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onUpdateFollowupDate={handleUpdateFollowupDate}
          onAddNote={handleAddNote}
          onOpenPitchModal={(lead) => {
            setDetailLead(null);
            setPitchLead(lead);
          }}
        />
      )}

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onAddLead={handleAddLead}
        />
      )}

      {isGuideModalOpen && (
        <OutreachGuideModal
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200/60 py-5 px-4 text-center text-xs text-slate-500">
        <p className="flex flex-wrap items-center justify-center gap-2 font-medium">
          <span className="text-slate-800 font-semibold">LeadScout</span>
          <span>•</span>
          <span>US Small Business Prospecting & Outreach CRM</span>
          <span>•</span>
          <span>100 Verified Leads</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
