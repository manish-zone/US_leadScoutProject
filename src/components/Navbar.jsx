import React, { useState, useEffect } from 'react';
import { AnimatedRadarLogo } from './AnimatedRadarLogo';
import { 
  Table2, 
  Kanban, 
  Radar, 
  Bell, 
  BookOpen, 
  Plus, 
  Download, 
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  leadsCount, 
  pendingRemindersCount,
  onOpenAddModal, 
  onExportCSV, 
  onResetLeads,
  soundEnabled,
  setSoundEnabled,
  onOpenGuide,
  dbStatus = 'connected'
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // High-performance smooth scroll progress tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all bg-gradient-to-b from-sky-100/95 via-[#ebf5fe]/95 to-sky-100/90 backdrop-blur-md border-b border-sky-300/90 shadow-[0_4px_22px_-2px_rgba(14,165,233,0.15)] relative overflow-hidden">
      {/* Ambient Neon Scroll Progress Bar on Header Top Rim */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3.5px] bg-sky-200/60 pointer-events-none z-20"
        title={`Page scroll: ${Math.round(scrollProgress)}%`}
      >
        <div 
          className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 shadow-[0_0_12px_rgba(56,189,248,1)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Specular Liquid Water Sheen - GPU radial gradient, Zero blur overhead */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full [background:radial-gradient(circle,rgba(255,255,255,0.85)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full [background:radial-gradient(circle,rgba(56,189,248,0.25)_0%,transparent_70%)]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 relative z-10">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand & Animated Radar Logo */}
          <div 
            onClick={() => setActiveTab('table')}
            className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer select-none group"
            title="LeadScout • Click to view all leads"
          >
            <div className="relative">
              <AnimatedRadarLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                LeadScout
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white text-sky-800 border border-sky-300/80 shadow-xs uppercase tracking-wider">
                US
              </span>
            </div>
          </div>

          {/* Segmented Control Navigation Dock (macOS / Modern SaaS Style) */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/90 p-1 rounded-2xl border border-sky-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
            {/* 1. Leads Table */}
            <button
              onClick={() => setActiveTab('table')}
              title={`View all ${leadsCount} verified leads in table format`}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Leads</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'table' 
                  ? 'bg-white/30 text-white' 
                  : 'bg-slate-200/90 text-slate-700'
              }`}>
                {leadsCount}
              </span>
            </button>

            {/* 2. Pipeline Kanban */}
            <button
              onClick={() => setActiveTab('kanban')}
              title="Visual Kanban pipeline for deal management"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kanban'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Pipeline</span>
            </button>

            {/* 3. Live 3D Radar */}
            <button
              onClick={() => setActiveTab('scraper')}
              title="Live 3D web presence radar & lead discovery sweep"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'scraper'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Radar className="w-4 h-4 text-sky-500" />
              <span>Radar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
            </button>

            {/* 4. Follow-up Reminders */}
            <button
              onClick={() => setActiveTab('reminders')}
              title="Scheduled call reminders and follow-up command center"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'reminders'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Follow-ups</span>
              {pendingRemindersCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)] border border-white">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            {/* 5. Outreach Playbook */}
            <button
              onClick={onOpenGuide}
              title="Cold calling scripts, objection handlers, and closing strategies"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-800 hover:text-sky-950 hover:bg-white/80 transition-all border border-transparent hover:border-sky-200 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden lg:inline">Playbook</span>
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Sound Enabled (Click to mute)' : 'Sound Muted (Click to unmute)'}
              className="glass-3d-btn p-2 rounded-xl transition-all cursor-pointer text-slate-600 hover:text-slate-900 shrink-0"
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              title={`Download all ${leadsCount} verified leads as CSV spreadsheet`}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold glass-3d-btn text-slate-700 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export CSV</span>
            </button>

            {/* Reset Database */}
            <button
              onClick={onResetLeads}
              title="Reset all leads back to New Lead status"
              className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white/60 hover:bg-white border border-slate-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Primary Action: + Add Lead */}
            <button
              onClick={onOpenAddModal}
              title="Add a new business lead to your CRM"
              className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_4px_14px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.5)] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dock (Below 768px for easy thumb reach) */}
        <div className="flex md:hidden items-center justify-around pt-2.5 mt-2.5 border-t border-sky-100/80">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex flex-col items-center text-[10px] ${
              activeTab === 'table' ? 'text-sky-600 font-black' : 'text-slate-600 font-semibold'
            }`}
          >
            <Table2 className="w-4 h-4 mb-0.5" />
            <span>Table ({leadsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex flex-col items-center text-[10px] ${
              activeTab === 'kanban' ? 'text-sky-600 font-black' : 'text-slate-600 font-semibold'
            }`}
          >
            <Kanban className="w-4 h-4 mb-0.5" />
            <span>Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab('scraper')}
            className={`flex flex-col items-center text-[10px] ${
              activeTab === 'scraper' ? 'text-sky-600 font-black' : 'text-slate-600 font-semibold'
            }`}
          >
            <Radar className="w-4 h-4 mb-0.5 text-sky-500" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex flex-col items-center text-[10px] relative ${
              activeTab === 'reminders' ? 'text-sky-600 font-black' : 'text-slate-600 font-semibold'
            }`}
          >
            <Bell className="w-4 h-4 mb-0.5" />
            <span>Follow-ups</span>
            {pendingRemindersCount > 0 && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>
            )}
          </button>
          <button
            onClick={onOpenGuide}
            className="flex flex-col items-center text-[10px] text-sky-700 font-semibold"
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Playbook</span>
          </button>
        </div>
      </div>
    </header>
  );
}
