import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Store, 
  Briefcase, 
  Scissors,
  Volume2, 
  MessageSquare,
  FileText
} from 'lucide-react';
import { sound } from '../utils/sound';

export function ReminderCenter({
  leads,
  onUpdateFollowupDate,
  onUpdateLeadStatus,
  onOpenPitchModal,
  onOpenDetailModal
}) {
  const [filterTab, setFilterTab] = useState('today');
  const todayStr = new Date().toISOString().split('T')[0];

  const scheduledLeads = leads.filter(l => Boolean(l.followupDate) && l.status !== 'won' && l.status !== 'lost');

  const overdueLeads = scheduledLeads.filter(l => {
    const datePart = l.followupDate.split('T')[0];
    return datePart < todayStr;
  });

  const todayLeads = scheduledLeads.filter(l => {
    return l.followupDate.startsWith(todayStr);
  });

  const upcomingLeads = scheduledLeads.filter(l => {
    const datePart = l.followupDate.split('T')[0];
    return datePart > todayStr;
  });

  const displayedLeads = 
    filterTab === 'today' ? todayLeads :
    filterTab === 'overdue' ? overdueLeads :
    filterTab === 'upcoming' ? upcomingLeads : scheduledLeads;

  const handleReschedule = (leadId, daysToAdd) => {
    const targetDate = new Date(Date.now() + daysToAdd * 86400000);
    const dateStr = targetDate.toISOString().split('T')[0] + 'T11:00';
    onUpdateFollowupDate(leadId, dateStr);
    sound.playBlip();
  };

  const handleMarkContacted = (leadId) => {
    onUpdateLeadStatus(leadId, 'contacted');
    sound.playSuccess();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hotel':
        return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'shop':
        return <Store className="w-3.5 h-3.5 text-amber-600" />;
      case 'company':
        return <Briefcase className="w-3.5 h-3.5 text-sky-600" />;
      case 'barber':
        return <Scissors className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3D Header Card */}
      <div className="glass-3d-slab rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 border-t-2 border-l-1.5 border-white border-b-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-sm shrink-0">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              3D Follow-up & Reminder Command Center
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Dimensional scheduling system for client calls, presentation demos, and website pitches.
            </p>
          </div>
        </div>

        <button
          onClick={() => sound.playChime()}
          className="glass-3d-btn flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-slate-700 text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Test 3D Chime</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-sky-100 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterTab('today')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            filterTab === 'today'
              ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 shadow-[0_6px_20px_rgba(245,158,11,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.7)] border-t border-white border-b-2 border-amber-600'
              : 'glass-3d-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Today's Follow-ups</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/60 text-[10px] font-black border border-amber-200 text-amber-900">
            {todayLeads.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('overdue')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            filterTab === 'overdue'
              ? 'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_6px_20px_rgba(244,63,94,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.7)] border-t border-white border-b-2 border-rose-700'
              : 'glass-3d-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Overdue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/60 text-[10px] font-black border border-rose-200 text-rose-800">
            {overdueLeads.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('upcoming')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            filterTab === 'upcoming'
              ? 'glass-3d-pill-active text-white'
              : 'glass-3d-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Upcoming (7 Days)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/60 text-[10px] font-black border border-sky-200 text-sky-800">
            {upcomingLeads.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-white text-slate-900 border-t-2 border-l border-white border-b-2 border-slate-300 shadow-sm'
              : 'glass-3d-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All Scheduled ({scheduledLeads.length})</span>
        </button>
      </div>

      {/* List of 3D Reminders */}
      <div className="space-y-4">
        {displayedLeads.length === 0 ? (
          <div className="glass-3d-slab rounded-3xl p-14 text-center text-slate-500">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">All Caught Up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No pending follow-ups in this view. You can schedule new outreach reminders directly from the Leads Table.
            </p>
          </div>
        ) : (
          displayedLeads.map((lead) => {
            const isOverdue = lead.followupDate.split('T')[0] < todayStr;
            const isToday = lead.followupDate.startsWith(todayStr);

            return (
              <div
                key={lead.id}
                className={`glass-3d-card rounded-3xl p-4 sm:p-5 transition-all shadow-md ${
                  isOverdue
                    ? 'border-t-2 border-l border-white border-b-2 border-rose-300 bg-rose-50/70'
                    : isToday
                    ? 'border-t-2 border-l border-white border-b-2 border-amber-300 bg-amber-50/70'
                    : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Lead Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        {lead.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-white/90 border border-slate-200/90 px-2.5 py-0.5 rounded-full shadow-xs">
                        {getCategoryIcon(lead.category)}
                        {lead.subCategory}
                      </span>
                      {isOverdue && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider border border-rose-200 shadow-xs">
                          OVERDUE
                        </span>
                      )}
                      {isToday && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200 shadow-xs">
                          DUE TODAY
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="text-slate-800 font-bold">
                        📍 {lead.city}, {lead.state}
                      </span>
                      <span>•</span>
                      <a
                        href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-sky-700 hover:text-sky-900 font-mono font-black flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        {lead.phone}
                      </a>
                      <span>•</span>
                      <span>Owner: <strong className="text-slate-800">{lead.ownerName || 'Decision Maker'}</strong></span>
                      <span>•</span>
                      <span className="text-amber-500 font-black">★ {lead.rating} ({lead.reviewsCount})</span>
                    </div>

                    {/* Scheduled Badge */}
                    <div className="flex items-center gap-2 text-xs text-sky-900 bg-sky-100/80 border border-sky-200 px-3 py-1 rounded-full w-fit shadow-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Scheduled: {new Date(lead.followupDate).toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-slate-600 italic pt-1">
                      💡 {lead.pitchAngle}
                    </p>
                  </div>

                  {/* 3D Snooze & Action Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-sky-100">
                    <div className="flex items-center space-x-1.5 bg-sky-100/60 p-1.5 rounded-2xl border-t border-l border-white border-b border-sky-200 shadow-inner">
                      <span className="text-[10px] text-slate-600 px-1 font-bold">Snooze:</span>
                      <button
                        onClick={() => handleReschedule(lead.id, 1)}
                        className="glass-3d-btn px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 rounded-xl"
                      >
                        +1 Day
                      </button>
                      <button
                        onClick={() => handleReschedule(lead.id, 3)}
                        className="glass-3d-btn px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 rounded-xl"
                      >
                        +3 Days
                      </button>
                      <button
                        onClick={() => handleReschedule(lead.id, 7)}
                        className="glass-3d-btn px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 rounded-xl"
                      >
                        +1 Week
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenPitchModal(lead)}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-700 hover:brightness-105 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_6px_18px_rgba(14,165,233,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.7)] border-t border-white border-b-2 border-sky-900 active:translate-y-0.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Pitch Script</span>
                    </button>

                    <button
                      onClick={() => handleMarkContacted(lead.id)}
                      className="glass-3d-btn px-4 py-2 rounded-2xl text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Contacted</span>
                    </button>

                    <button
                      onClick={() => onOpenDetailModal(lead)}
                      className="glass-3d-btn p-2 rounded-2xl text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
