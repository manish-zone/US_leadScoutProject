import React from 'react';
import { 
  Building2, 
  Flame, 
  Calendar, 
  Trophy, 
  DollarSign, 
  Clock, 
  AlertTriangle
} from 'lucide-react';

export function StatsOverview({ leads, onSelectFilterStatus, onOpenReminders }) {
  const total = leads.length;
  const hotelsCount = leads.filter(l => l.category === 'hotel').length;
  const shopsCount = leads.filter(l => l.category === 'shop').length;
  const companiesCount = leads.filter(l => l.category === 'company').length;
  const barbersCount = leads.filter(l => l.category === 'barber').length;

  const hotOpportunityCount = leads.filter(l => l.opportunityScore >= 95).length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const meetingCount = leads.filter(l => l.status === 'meeting').length;
  const wonCount = leads.filter(l => l.status === 'won').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayLeads = leads.filter(l => l.followupDate && l.followupDate.startsWith(todayStr));
  const overdueLeads = leads.filter(l => {
    if (!l.followupDate || l.status === 'won' || l.status === 'lost') return false;
    const datePart = l.followupDate.split('T')[0];
    return datePart < todayStr;
  });

  const estimatedPipeline = (total * 1500).toLocaleString();
  const wonRevenue = (wonCount * 2500).toLocaleString();

  return (
    <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-5">
      {/* 3D Glass Alert Banner (Water Citrus Crystal) */}
      {(overdueLeads.length > 0 || dueTodayLeads.length > 0) && (
        <div className="glass-3d-slab rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden transition-all border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-100/50 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.12)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200/80 to-amber-400/40 border-t-2 border-l-1.5 border-white border-b-2 border-amber-400/80 flex items-center justify-center text-amber-700 shadow-sm shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                  <span>3D Radar Alert: High-Priority Follow-ups Required</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-ping"></span>
                </h4>
                <p className="text-xs text-amber-900/90 mt-0.5">
                  {dueTodayLeads.length > 0 && (
                    <span className="font-extrabold text-amber-800">
                      {dueTodayLeads.length} follow-up{dueTodayLeads.length > 1 ? 's' : ''} due today.
                    </span>
                  )}
                  {overdueLeads.length > 0 && (
                    <span className="ml-2 font-extrabold text-rose-700">
                      {overdueLeads.length} overdue follow-up{overdueLeads.length > 1 ? 's' : ''}!
                    </span>
                  )}
                  <span className="text-amber-800/80"> Call these business owners to secure website demos.</span>
                </p>
              </div>
            </div>

            <button
              onClick={onOpenReminders}
              className="px-4 py-2.5 bg-gradient-to-b from-amber-400 to-amber-500 hover:brightness-105 text-amber-950 font-black text-xs rounded-xl transition-all shrink-0 shadow-[0_6px_20px_rgba(245,158,11,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-t border-white border-b-2 border-amber-600 active:translate-y-0.5 cursor-pointer"
            >
              Open Follow-up Center
            </button>
          </div>
        </div>
      )}

      {/* Grid of 3D Water Crystal Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Leads */}
        <div className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">Total Leads</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100/80 border-t border-l border-white border-b border-sky-200 flex items-center justify-center text-sky-700 shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {total}
          </div>
          <div className="text-[11px] text-slate-700 mt-2 flex flex-wrap items-center gap-1.5 font-bold">
            <span className="text-emerald-700">🏨 {hotelsCount}</span> •
            <span className="text-amber-700">🛍️ {shopsCount}</span> •
            <span className="text-sky-700">🏢 {companiesCount}</span> •
            <span className="text-purple-700">💈 {barbersCount}</span>
          </div>
        </div>

        {/* Card 2: Hot Prospects */}
        <div className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">Hot Prospects</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 border-t border-l border-white border-b border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight mt-1">
            {hotOpportunityCount}
          </div>
          <div className="text-[11px] text-slate-700 mt-2 font-semibold">
            Score ≥ 95 (High ROI)
          </div>
        </div>

        {/* Card 3: Contacted */}
        <div 
          onClick={() => onSelectFilterStatus('contacted')}
          className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">Contacted</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100/80 border-t border-l border-white border-b border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 tracking-tight mt-1">
            {contactedCount}
          </div>
          <div className="text-[11px] text-slate-700 mt-2 font-semibold">
            Pitches Delivered
          </div>
        </div>

        {/* Card 4: Demos Booked */}
        <div 
          onClick={() => onSelectFilterStatus('meeting')}
          className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">Demos Booked</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 border-t border-l border-white border-b border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight mt-1">
            {meetingCount}
          </div>
          <div className="text-[11px] text-slate-700 mt-2 font-semibold">
            Presentations Ready
          </div>
        </div>

        {/* Card 5: Won Deals */}
        <div 
          onClick={() => onSelectFilterStatus('won')}
          className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-700">Deals Won</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 border-t border-l border-white border-b border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight mt-1">
            {wonCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-extrabold mt-2">
            ${wonRevenue} USD Earned 🎉
          </div>
        </div>

        {/* Card 6: Pipeline Potential */}
        <div className="glass-3d-card rounded-3xl p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-700">Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 border-t border-l border-white border-b border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight mt-1">
            ${estimatedPipeline}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-2">
            @ $1,500 Avg Website Deal
          </div>
        </div>
      </div>
    </div>
  );
}
