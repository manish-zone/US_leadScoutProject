import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Star, 
  ExternalLink, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Plus, 
  Building2, 
  Store, 
  Briefcase, 
  Scissors,
  Flame
} from 'lucide-react';
import { sound } from '../utils/sound';

export function LeadDetailModal({ 
  lead, 
  onClose, 
  onUpdateLeadStatus, 
  onUpdateFollowupDate, 
  onAddNote, 
  onOpenPitchModal 
}) {
  if (!lead) return null;

  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
    sound.playBlip();
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.name} ${lead.address}`)}`;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hotel':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'shop':
        return <Store className="w-4 h-4 text-amber-600" />;
      case 'company':
        return <Briefcase className="w-4 h-4 text-sky-600" />;
      case 'barber':
        return <Scissors className="w-4 h-4 text-purple-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* 3D Crystal Slab Window */}
      <div className="glass-3d-slab rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(15,23,42,0.35)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 border-t-2 border-l-1.5 border-white border-b-2 border-sky-300 flex items-center justify-center shadow-xs shrink-0">
              {getCategoryIcon(lead.category)}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {lead.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{lead.subCategory}</span>
                <span>•</span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">{lead.websiteStatus}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="glass-3d-btn p-2 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {/* Key Stats Bar with 3D Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-3d-card p-3 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Reputation</span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-sm mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{lead.rating}</span>
                <span className="text-slate-500 text-xs">({lead.reviewsCount} reviews)</span>
              </div>
            </div>

            <div className="glass-3d-card p-3 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Opportunity</span>
              <div className="text-rose-600 font-black text-sm mt-0.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{lead.opportunityScore}/100</span>
              </div>
            </div>

            <div className="glass-3d-card p-3 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Revenue Potential</span>
              <div className="text-emerald-600 font-black text-sm mt-0.5">
                {lead.estimatedRevenue}
              </div>
            </div>

            <div className="glass-3d-card p-3 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Decision Maker</span>
              <div className="text-slate-900 font-bold text-sm mt-0.5 truncate">
                {lead.ownerName || 'Decision Maker'}
              </div>
            </div>
          </div>

          {/* Location & Contact Strip */}
          <div className="glass-3d-card p-4 rounded-2xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block font-semibold">Physical Location</span>
                <span className="text-slate-900 font-bold text-sm">{lead.address}</span>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="glass-3d-btn text-sky-700 hover:text-sky-900 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer"
              >
                <span>View on Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2.5 border-t border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block font-semibold">Phone Number</span>
                <a
                  href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-sky-700 hover:underline font-mono font-black text-sm"
                >
                  {lead.phone}
                </a>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPitchModal(lead);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-b from-sky-500 to-sky-700 hover:brightness-105 text-white font-extrabold text-xs transition-all shadow-sm border-t-2 border-l border-white border-b-2 border-sky-900 active:translate-y-0.5 cursor-pointer"
              >
                Generate Cold Pitch
              </button>
            </div>
          </div>

          {/* Custom Pitch Strategy */}
          <div className="bg-sky-50/70 border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 rounded-2xl p-4 shadow-sm">
            <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>🎯 Custom Website Pitch Strategy:</span>
            </h4>
            <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
              {lead.pitchAngle}
            </p>
          </div>

          {/* Status & Follow-up Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pipeline Stage
              </label>
              <select
                value={lead.status}
                onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value)}
                className="w-full glass-3d-input rounded-2xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="new">🟡 New Lead</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="followup">🟣 Follow-up Scheduled</option>
                <option value="meeting">🟠 Demo Booked</option>
                <option value="won">🟢 Closed / Won 🎉</option>
                <option value="lost">🔴 Not Interested</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Next Follow-up Reminder
              </label>
              <input
                type="datetime-local"
                value={lead.followupDate || ''}
                onChange={(e) => onUpdateFollowupDate(lead.id, e.target.value)}
                className="w-full glass-3d-input rounded-2xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Notes History */}
          <div className="space-y-3 pt-2 border-t border-sky-100">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Call History & Interaction Notes
            </h4>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Log a new note (e.g. Called owner, scheduled presentation for Friday)..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 glass-3d-input rounded-2xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-b from-sky-500 to-sky-700 text-white rounded-2xl font-black text-xs flex items-center gap-1 transition-all shadow-sm shrink-0 border-t-2 border-l border-white border-b-2 border-sky-900 active:translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {(!lead.notes || lead.notes.length === 0) ? (
                <div className="text-xs text-slate-500 italic py-2">
                  No notes recorded yet. Add your first outreach log above.
                </div>
              ) : (
                lead.notes.map((note) => (
                  <div key={note.id} className="bg-white/90 p-3 rounded-xl border border-sky-100 text-xs text-slate-700 shadow-xs">
                    <div className="text-[10px] text-slate-500 mb-0.5 font-mono font-bold">
                      {note.date}
                    </div>
                    <p className="leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
