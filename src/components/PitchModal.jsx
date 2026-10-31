import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';
import { generateOutreachScripts } from '../utils/scriptsGenerator';
import { sound } from '../utils/sound';

export function PitchModal({ lead, onClose, onUpdateLeadStatus, onAddNote }) {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState('call');
  const [copiedType, setCopiedType] = useState(null);
  const [callNote, setCallNote] = useState('');

  const scripts = generateOutreachScripts(lead);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    sound.playBlip();
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  const handleSaveCallNote = (statusToSet) => {
    if (callNote.trim()) {
      onAddNote(lead.id, callNote);
    }
    if (statusToSet) {
      onUpdateLeadStatus(lead.id, statusToSet);
    }
    sound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* 3D Crystal Slab Window */}
      <div className="glass-3d-slab rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(15,23,42,0.35)] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 border-t-2 border-l-1.5 border-white border-b-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {lead.name}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                  {lead.websiteStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lead.city}, {lead.state} • ★ {lead.rating} ({lead.reviewsCount} reviews) • Contact: {lead.ownerName || 'Decision Maker'}
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

        {/* 3D Tabs */}
        <div className="flex items-center space-x-1.5 p-2.5 bg-sky-50/70 border-b border-sky-100 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'glass-3d-pill-active text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Cold Call Pitch (English)</span>
          </button>

          <button
            onClick={() => setActiveTab('hinglish')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'hinglish'
                ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white shadow-sm border-t-2 border-l border-white border-b-2 border-teal-900'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
            }`}
          >
            <span>🇮🇳</span>
            <span>Caller Strategy (Hinglish Guide)</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'glass-3d-pill-active text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Cold Email Template</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sms'
                ? 'glass-3d-pill-active text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Quick SMS Pitch</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Quick Call Action Strip */}
          <div className="glass-3d-card rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs text-slate-600 font-semibold">Direct Phone:</span>
              <a
                href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                className="font-mono text-sm font-black text-sky-700 hover:underline"
              >
                {lead.phone}
              </a>
            </div>

            <a
              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 hover:brightness-105 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-sm border-t-2 border-l border-white border-b-2 border-teal-900 active:translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Dial Phone</span>
            </a>
          </div>

          {/* TAB 1: COLD CALL SCRIPT */}
          {activeTab === 'call' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>Personalized Cold Call Script:</span>
                <button
                  onClick={() => handleCopy(scripts.coldCallScript, 'call')}
                  className="glass-3d-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {copiedType === 'call' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'call' ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 text-slate-800 font-sans leading-relaxed whitespace-pre-line text-xs sm:text-sm shadow-sm">
                {scripts.coldCallScript}
              </div>
            </div>
          )}

          {/* TAB 2: HINGLISH GUIDE */}
          {activeTab === 'hinglish' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>US Client Calling Strategy & Objection Handling (Hinglish):</span>
                <button
                  onClick={() => handleCopy(scripts.callerGuideHinglish, 'hinglish')}
                  className="glass-3d-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {copiedType === 'hinglish' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'hinglish' ? 'Copied Guide!' : 'Copy Guide'}</span>
                </button>
              </div>

              <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-emerald-200 text-slate-800 font-sans leading-relaxed whitespace-pre-line text-xs sm:text-sm shadow-sm">
                {scripts.callerGuideHinglish}
              </div>
            </div>
          )}

          {/* TAB 3: COLD EMAIL */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>Email Subject & Body:</span>
                <button
                  onClick={() => handleCopy(`Subject: ${scripts.emailSubject}\n\n${scripts.emailBody}`, 'email')}
                  className="glass-3d-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'email' ? 'Copied Email!' : 'Copy Subject & Body'}</span>
                </button>
              </div>

              <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 space-y-3 shadow-sm">
                <div className="border-b border-sky-100 pb-2">
                  <span className="text-slate-500 text-xs font-mono">Subject: </span>
                  <span className="font-extrabold text-slate-900 text-xs">{scripts.emailSubject}</span>
                </div>
                <div className="text-slate-800 font-sans leading-relaxed whitespace-pre-line text-xs">
                  {scripts.emailBody}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SMS */}
          {activeTab === 'sms' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>SMS / WhatsApp Short Pitch:</span>
                <button
                  onClick={() => handleCopy(scripts.smsBody, 'sms')}
                  className="glass-3d-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {copiedType === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'sms' ? 'Copied SMS!' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 text-slate-800 font-mono text-xs leading-relaxed shadow-sm">
                {scripts.smsBody}
              </div>
            </div>
          )}

          {/* Call Outcome Logging */}
          <div className="pt-4 border-t border-sky-100 space-y-3">
            <label className="block text-xs font-black text-slate-800">
              Log Call Outcome:
            </label>
            <textarea
              rows={2}
              value={callNote}
              onChange={(e) => setCallNote(e.target.value)}
              placeholder="e.g. Left voicemail with manager, requested proposal on WhatsApp..."
              className="w-full glass-3d-input rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs text-slate-600 font-bold">Quick stage update:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveCallNote('contacted')}
                  className="glass-3d-btn px-3.5 py-1.5 text-sky-700 hover:text-sky-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save as Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCallNote('followup')}
                  className="glass-3d-btn px-3.5 py-1.5 text-purple-700 hover:text-purple-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Schedule Follow-up
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCallNote('meeting')}
                  className="glass-3d-btn px-3.5 py-1.5 text-amber-700 hover:text-amber-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Demo Booked!
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCallNote('won')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white font-black text-xs hover:brightness-105 shadow-sm border-t-2 border-l border-white border-b-2 border-teal-900 active:translate-y-0.5 cursor-pointer"
                >
                  Deal Won 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
