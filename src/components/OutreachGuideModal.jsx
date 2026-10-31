import React from 'react';
import { 
  X, 
  BookOpen, 
  DollarSign, 
  PhoneCall, 
  Clock, 
  Sparkles
} from 'lucide-react';

export function OutreachGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* 3D Crystal Window */}
      <div className="glass-3d-slab rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(15,23,42,0.35)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 border-t-2 border-l-1.5 border-white border-b-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-sm shrink-0">
              <BookOpen className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                US Web Agency Sales Blueprint & Playbook
              </h3>
              <p className="text-xs text-slate-500">
                How to convert US hotels, shops & contractors without websites into $1,500+ clients.
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

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm text-slate-700">
          {/* Section 1: The Opportunity */}
          <div className="glass-3d-card p-4 sm:p-5 rounded-3xl space-y-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              1. Why do these 100 businesses have no websites?
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              Unlike early-stage startups, these US businesses are already generating hundreds of thousands of dollars in revenue and have hundreds of positive Google reviews. They don't have websites because:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs font-medium">
              <li><strong className="text-slate-900">Non-Tech Operators:</strong> Many are family-owned establishments who found WordPress/coding overly complicated.</li>
              <li><strong className="text-slate-900">Burned in the Past:</strong> Agencies previously billed them thousands for unfinished slow sites, so they gave up.</li>
              <li><strong className="text-slate-900">Operational Rush:</strong> Motel managers and service contractors spend all day on emergency calls and guest check-ins.</li>
            </ul>
          </div>

          {/* Section 2: Pricing Matrix */}
          <div className="glass-3d-card p-4 sm:p-5 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-sky-900">
              <DollarSign className="w-4 h-4 text-sky-600" />
              2. How to Price Website Packages in USD ($)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/95 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 shadow-xs">
                <span className="text-[10px] uppercase font-black text-slate-500">Starter Local Pack</span>
                <div className="text-lg font-black text-slate-900 mt-1">$750 - $1,200</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  1-3 pages, Mobile responsive, Google Maps sync, Contact/Quote form, Fast domain connection.
                </p>
              </div>

              <div className="bg-sky-50/80 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-300 shadow-xs">
                <span className="text-[10px] uppercase font-black text-sky-800">Standard Agency</span>
                <div className="text-lg font-black text-slate-900 mt-1">$1,500 - $2,500</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  5 pages, Direct Booking engine (Hotels) or Product Showcase (Shops), Fast React loading, Local SEO.
                </p>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-emerald-300 shadow-xs">
                <span className="text-[10px] uppercase font-black text-emerald-800">Monthly Retainer</span>
                <div className="text-lg font-black text-slate-900 mt-1">$50 - $150 / mo</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Cloud hosting, SSL certificates, monthly text/photo updates, automated security backup.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Best Calling Times */}
          <div className="glass-3d-card p-4 sm:p-5 rounded-3xl space-y-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-sky-800">
              <Clock className="w-4 h-4 text-sky-600" />
              3. Best Calling Hours in the US (Time Zones)
            </h4>
            <p className="text-xs text-slate-600">
              Always align your calls with their local US business time:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white/95 p-3 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 shadow-xs">
                <strong className="text-slate-900 block font-black">Eastern (EST):</strong>
                <span className="text-slate-500 text-[11px]">NY, FL, GA, NC, PA</span>
                <div className="text-emerald-700 font-mono text-[11px] mt-0.5 font-bold">10 AM - 12 PM EST</div>
              </div>
              <div className="bg-white/95 p-3 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 shadow-xs">
                <strong className="text-slate-900 block font-black">Central (CST):</strong>
                <span className="text-slate-500 text-[11px]">TX, IL, TN, MO, WI</span>
                <div className="text-emerald-700 font-mono text-[11px] mt-0.5 font-bold">10 AM - 12 PM CST</div>
              </div>
              <div className="bg-white/95 p-3 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 shadow-xs">
                <strong className="text-slate-900 block font-black">Mountain (MST):</strong>
                <span className="text-slate-500 text-[11px]">AZ, CO, NM, MT, UT</span>
                <div className="text-emerald-700 font-mono text-[11px] mt-0.5 font-bold">10 AM - 12 PM MST</div>
              </div>
              <div className="bg-white/95 p-3 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-sky-200 shadow-xs">
                <strong className="text-slate-900 block font-black">Pacific (PST):</strong>
                <span className="text-slate-500 text-[11px]">CA, WA, OR, NV</span>
                <div className="text-emerald-700 font-mono text-[11px] mt-0.5 font-bold">10 AM - 12 PM PST</div>
              </div>
            </div>
          </div>

          {/* Section 4: Objections */}
          <div className="glass-3d-card p-4 sm:p-5 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-rose-800">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              4. Handling Top Objections (Hinglish Cheat Sheet)
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-amber-200 shadow-xs">
                <span className="font-extrabold text-amber-950 block">
                  ❌ Objection 1: "We get enough business from word-of-mouth already."
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  💡 <strong>Your Reply:</strong> "That’s exactly why you have a 4.8 rating! But right now, when people hear about you from friends and search your name on Google, without a website 30% of them end up clicking a competitor who has online booking. We want to protect your word-of-mouth reputation."
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-amber-200 shadow-xs">
                <span className="font-extrabold text-amber-950 block">
                  ❌ Objection 2: "We already have a Facebook page."
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  💡 <strong>Your Reply:</strong> "Social media is great for followers, but Google searches don't rank Facebook pages high for keywords like direct booking or local service quotes. Plus, guests without Facebook accounts can't view your room rates."
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-2xl border-t-2 border-l-1.5 border-white border-b-2 border-amber-200 shadow-xs">
                <span className="font-extrabold text-amber-950 block">
                  ❌ Objection 3: "How much is this going to cost?"
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  💡 <strong>Your Reply:</strong> "We don't charge big agency retainers. Most of our custom sites range between $950 to $1,800 total, which pays for itself with just 2 direct reservations or one new contract. Let me send you a free preview first so you can judge the quality yourself."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
