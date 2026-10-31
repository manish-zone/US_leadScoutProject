import React from 'react';
import { 
  Building2, 
  Store, 
  Briefcase, 
  Scissors,
  Phone, 
  MapPin, 
  Star, 
  Flame, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Calendar
} from 'lucide-react';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'border-slate-200/80 bg-white/40', badge: 'bg-slate-100 text-slate-700' },
  { id: 'contacted', title: 'Contacted', color: 'border-sky-300/80 bg-sky-50/40', badge: 'bg-sky-100 text-sky-800' },
  { id: 'followup', title: 'Follow-up Due', color: 'border-purple-300/80 bg-purple-50/40', badge: 'bg-purple-100 text-purple-800' },
  { id: 'meeting', title: 'Demo Booked', color: 'border-amber-300/80 bg-amber-50/40', badge: 'bg-amber-100 text-amber-800' },
  { id: 'won', title: 'Deals Won 🎉', color: 'border-emerald-300/80 bg-emerald-50/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]', badge: 'bg-emerald-100 text-emerald-800 font-black' },
  { id: 'lost', title: 'Not Interested', color: 'border-rose-300/80 bg-rose-50/40', badge: 'bg-rose-100 text-rose-800' }
];

export function KanbanBoard({
  leads,
  onUpdateLeadStatus,
  onOpenPitchModal,
  onOpenDetailModal
}) {
  const columnOrder = ['new', 'contacted', 'followup', 'meeting', 'won', 'lost'];

  const moveLead = (leadId, currentStatus, direction) => {
    const currentIndex = columnOrder.indexOf(currentStatus);
    const targetIndex = currentIndex + direction;
    if (targetIndex >= 0 && targetIndex < columnOrder.length) {
      onUpdateLeadStatus(leadId, columnOrder[targetIndex]);
    }
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
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1240px]">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter(l => l.status === col.id);

          return (
            <div 
              key={col.id} 
              className={`flex-1 min-w-[280px] rounded-3xl border ${col.color} p-4 flex flex-col max-h-[calc(100vh-220px)] glass-3d-slab shadow-2xl`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">{col.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-black shadow-xs border-t-2 border-l border-white ${col.badge}`}>
                    {colLeads.length}
                  </span>
                </div>
              </div>

              {/* Card List */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {colLeads.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-xs border border-dashed border-sky-200 rounded-2xl bg-white/40">
                    No leads in this stage
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="glass-3d-card rounded-2xl p-3.5 shadow-md group relative cursor-pointer"
                    >
                      {/* Category & Opportunity */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-white/90 border border-slate-200/90 px-2 py-0.5 rounded-full shadow-xs">
                          {getCategoryIcon(lead.category)}
                          {lead.subCategory}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shadow-xs">
                          <Flame className="w-2.5 h-2.5 text-rose-600" />
                          {lead.opportunityScore}
                        </span>
                      </div>

                      {/* Name */}
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-1 group-hover:text-sky-600 transition-colors">
                        {lead.name}
                      </h4>

                      {/* Location & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2 font-medium">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          {lead.city}, {lead.state}
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-black">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {lead.rating} ({lead.reviewsCount})
                        </span>
                      </div>

                      {/* Phone & Owner */}
                      <div className="text-[11px] text-slate-600 bg-sky-50/70 p-2 rounded-xl border border-sky-100 mb-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <a 
                            href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                            className="text-sky-700 hover:text-sky-900 font-mono text-[11px] font-bold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-sky-600" />
                            {lead.phone}
                          </a>
                          <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                            {lead.ownerName || 'Owner'}
                          </span>
                        </div>
                      </div>

                      {/* Follow-up Date */}
                      {lead.followupDate && (
                        <div className="flex items-center gap-1 text-[10px] text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full mb-2 font-bold shadow-xs">
                          <Calendar className="w-2.5 h-2.5 text-purple-600" />
                          <span>Due: {new Date(lead.followupDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-sky-100">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => onOpenPitchModal(lead)}
                            title="Generate Pitch Script"
                            className="glass-3d-btn p-1.5 rounded-lg text-sky-700 hover:text-sky-900 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onOpenDetailModal(lead)}
                            title="Full Record & Notes"
                            className="glass-3d-btn p-1.5 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Stage Mover */}
                        <div className="flex items-center space-x-1">
                          {columnOrder.indexOf(lead.status) > 0 && (
                            <button
                              onClick={() => moveLead(lead.id, lead.status, -1)}
                              title="Move backward"
                              className="glass-3d-btn p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {columnOrder.indexOf(lead.status) < columnOrder.length - 1 && (
                            <button
                              onClick={() => moveLead(lead.id, lead.status, 1)}
                              title="Move forward"
                              className="glass-3d-btn p-1 text-sky-700 hover:text-sky-900 rounded-lg cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
