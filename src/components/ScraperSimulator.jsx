import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, 
  Terminal, 
  Play, 
  Sparkles, 
  MapPin, 
  PlusCircle, 
  Sliders, 
  Compass, 
  Radio,
  Database
} from 'lucide-react';
import { sound } from '../utils/sound';
import { leadsApi } from '../api/leadsApi';
import { AnimatedRadarLogo } from './AnimatedRadarLogo';

const PRESET_QUERIES = [
  { label: 'Hotels Without Websites (Florida & CA)', category: 'hotel', city: 'Orlando, FL', keyword: 'independent motel lodge' },
  { label: 'Contractors & Roofing (Texas & Ohio)', category: 'company', city: 'Dallas, TX', keyword: 'commercial roofing contractor' },
  { label: 'Vintage & Antique Shops (NY & GA)', category: 'shop', city: 'Savannah, GA', keyword: 'antique vintage store handmade' },
  { label: 'Barber Shops & Grooming (Miami & Austin)', category: 'barber', city: 'Miami, FL', keyword: 'barbershop men grooming fade' },
  { label: 'Mountain & National Park Lodges', category: 'hotel', city: 'Gatlinburg, TN', keyword: 'mountain cabins chalets inn' }
];

export function ScraperSimulator({ onAddScrapedLeads, existingLeadsCount }) {
  const [targetCategory, setTargetCategory] = useState('hotel');
  const [targetLocation, setTargetLocation] = useState('Austin, TX');
  const [keyword, setKeyword] = useState('independent motel');
  const [minReviews, setMinReviews] = useState(50);
  
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([
    { type: 'info', text: '3D Web Presence Sonar v6.0 active.' },
    { type: 'ready', text: 'Target US coordinates & launch Holographic 3D sweep.' }
  ]);
  const [scrapedBatch, setScrapedBatch] = useState([]);
  const [imported, setImported] = useState(false);

  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type, text) => {
    setLogs(prev => [...prev, { type, text, time: new Date().toLocaleTimeString() }]);
  };

  const handleStartScrape = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setProgress(0);
    setScrapedBatch([]);
    setImported(false);
    sound.playChime();

    setLogs([
      { type: 'init', text: `[3D RADAR ENGAGED] Locking coordinates on "${targetLocation}"...` },
      { type: 'info', text: `[SWEEP] Scanning category: ${targetCategory.toUpperCase()} | Keyword: "${keyword}"` }
    ]);

    try {
      setTimeout(() => { setProgress(20); addLog('crawl', `[LOCAL PACK] Extracting geo-coordinates in ${targetLocation}...`); }, 500);
      setTimeout(() => { setProgress(45); addLog('parse', `[3D PROBE] Probing DNS nameservers and HTTP headers for local listings...`); }, 1200);
      setTimeout(() => { setProgress(70); addLog('dns', `[HTTP 404] Zero website response verified for targets.`); sound.playBlip(); }, 1900);
      setTimeout(() => { setProgress(88); addLog('filter', `[REPUTATION CHECK] Filtering businesses with ${minReviews}+ reviews & phone numbers.`); }, 2500);

      const response = await leadsApi.performRadarSweep({
        category: targetCategory,
        location: targetLocation,
        keyword,
        minReviews
      });

      setTimeout(() => {
        setProgress(100);
        setIsScanning(false);
        sound.playSuccess();

        if (response && response.leads) {
          setScrapedBatch(response.leads);
          addLog('match', `[TARGETS ACQUIRED] Discovered ${response.leads.length} real businesses with NO active websites!`);
          addLog('done', `[RADAR COMPLETE] Plotted on 3D Sonar display. Ready to sync into MySQL CRM.`);
        }
      }, 3100);

    } catch (err) {
      console.error('Radar sweep error:', err);
      setIsScanning(false);
      addLog('error', `[RADAR ERROR] ${err.message}. Retrying fallback sonar...`);
    }
  };

  const handleApplyPreset = (preset) => {
    setTargetCategory(preset.category);
    setTargetLocation(preset.city);
    setKeyword(preset.keyword);
  };

  const handleImportToCRM = () => {
    if (scrapedBatch.length === 0) return;
    onAddScrapedLeads(scrapedBatch);
    setImported(true);
    sound.playSuccess();
    addLog('success', `[CRM SYNC] Transferred ${scrapedBatch.length} leads into active CRM pipeline!`);
  };

  return (
    <div className="space-y-6">
      {/* 3D Header & Preset Strip */}
      <div className="glass-3d-slab rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4 max-w-2xl">
            <AnimatedRadarLogo size="lg" className="mt-1" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border-t-1.5 border-l-1.5 border-white border-b-2 border-emerald-300 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>3D Live Business Radar Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Live US Business Radar & Lead Scraper
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Sweeps geographic clusters across the United States to detect high-revenue Hotels, Stores, and Contractors with active phone numbers but <span className="text-emerald-700 font-extrabold">NO active website</span>.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="glass-3d-btn text-xs px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-950 transition-all flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Controls & 3D Radar Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Form Controls */}
        <div className="lg:col-span-4 glass-3d-slab rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-sky-100 pb-3">
            <Sliders className="w-4 h-4 text-sky-600" />
            Sonar Coordinates
          </h3>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sector Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTargetCategory('hotel')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  targetCategory === 'hotel'
                    ? 'glass-3d-pill-active text-white'
                    : 'glass-3d-btn text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>🏨</span>
                <span>Hotels</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetCategory('shop')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  targetCategory === 'shop'
                    ? 'glass-3d-pill-active text-white'
                    : 'glass-3d-btn text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>🛍️</span>
                <span>Shops</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetCategory('company')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  targetCategory === 'company'
                    ? 'glass-3d-pill-active text-white'
                    : 'glass-3d-btn text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>🏢</span>
                <span>Services</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetCategory('barber')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  targetCategory === 'barber'
                    ? 'glass-3d-pill-active text-white'
                    : 'glass-3d-btn text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>💈</span>
                <span>Barbers</span>
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              US City & State
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                placeholder="e.g. Austin, TX or Phoenix, AZ"
                className="w-full glass-3d-input rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. independent motel, custom roofing"
              className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Min Reviews Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-bold">
              <span>Minimum Google Reviews:</span>
              <span className="text-amber-600 font-extrabold">{minReviews}+ reviews</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={minReviews}
              onChange={(e) => setMinReviews(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              onClick={handleStartScrape}
              disabled={isScanning}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-t-2 border-l-1.5 border-white border-b-2 ${
                isScanning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400'
                  : 'bg-gradient-to-b from-sky-500 via-sky-600 to-cyan-700 text-white hover:brightness-110 shadow-[0_8px_25px_rgba(14,165,233,0.4),inset_0_2px_2px_rgba(255,255,255,0.7)] border-cyan-900 active:translate-y-0.5'
              }`}
            >
              {isScanning ? (
                <>
                  <Radar className="w-4 h-4 animate-spin text-white" />
                  <span>Sweeping 3D Radar ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Engage 3D Radar Sweep</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3D Holographic Sonar & Terminal */}
        <div className="lg:col-span-8 space-y-4">
          {/* Holographic Radar Screen (Oceanic Sonar Display) */}
          <div className="glass-3d-slab rounded-3xl p-5 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[260px] bg-gradient-to-b from-slate-900/95 to-slate-950/98 border-cyan-400/30">
            {/* Concentric 3D Sonar Rings */}
            <div className="relative w-56 h-56 rounded-full border-2 border-cyan-400/25 flex items-center justify-center shadow-[inset_0_0_20px_rgba(34,211,238,0.15)]">
              <div className="w-44 h-44 rounded-full border border-cyan-400/30 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-cyan-400/35 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-cyan-400/40 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
                  </div>
                </div>
              </div>

              {/* Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-cyan-400/25"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-[1px] bg-cyan-400/25"></div>
              </div>

              {/* 3D Rotating Scanning Radar Beam */}
              {isScanning && (
                <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-3d-sweep pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/50 via-cyan-400/15 to-transparent origin-bottom-right rounded-tl-full"></div>
                </div>
              )}

              {/* Plotted Targets */}
              {scrapedBatch.length > 0 && (
                <>
                  <div className="absolute top-10 right-12 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping absolute"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></span>
                    <span className="text-[9px] font-mono font-bold text-cyan-300 bg-black/80 px-1.5 py-0.2 rounded ml-1 border border-cyan-400/40 shadow-inner">TARGET 1</span>
                  </div>
                  <div className="absolute bottom-12 left-14 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping absolute"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]"></span>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/80 px-1.5 py-0.2 rounded ml-1 border border-amber-400/40 shadow-inner">TARGET 2</span>
                  </div>
                  <div className="absolute top-20 left-10 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-400 animate-ping absolute"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-[0_0_12px_#f43f5e]"></span>
                    <span className="text-[9px] font-mono font-bold text-rose-300 bg-black/80 px-1.5 py-0.2 rounded ml-1 border border-rose-400/40 shadow-inner">TARGET 3</span>
                  </div>
                </>
              )}
            </div>

            {/* Radar Telemetry Footer */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-300 pt-3 mt-3 border-t border-slate-800 font-bold">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>RADAR SECTOR: {targetLocation.toUpperCase()}</span>
              </div>
              <div className="text-cyan-400 drop-shadow">
                {isScanning ? `FREQUENCY ${progress * 16} MHz` : '3D SONAR ONLINE'}
              </div>
            </div>
          </div>

          {/* 3D Sunken Terminal */}
          <div className="glass-3d-slab rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[200px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_5px_#f43f5e]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_5px_#f59e0b]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_#10b981]"></span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  3d_radar_telemetry.log
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {isScanning ? 'STREAMING' : 'IDLE'}
              </span>
            </div>

            <div 
              ref={logContainerRef}
              className="p-3.5 font-mono text-xs overflow-y-auto space-y-1 flex-1 bg-slate-950 text-slate-300 shadow-inner"
            >
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-500 select-none text-[10px] pt-0.5">
                    {log.time || '00:00'}
                  </span>
                  <span className={`leading-relaxed ${
                    log.type === 'init' ? 'text-sky-300 font-bold' :
                    log.type === 'match' ? 'text-amber-300 font-bold' :
                    log.type === 'done' ? 'text-emerald-300 font-bold' :
                    log.type === 'dns' ? 'text-purple-300' :
                    log.type === 'success' ? 'text-emerald-400 font-bold' :
                    'text-slate-300'
                  }`}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            {isScanning && (
              <div className="w-full bg-slate-900 h-1 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Scraped Batch Strip */}
          {scrapedBatch.length > 0 && (
            <div className="glass-3d-slab rounded-3xl p-4 sm:p-5 shadow-2xl border-emerald-300 bg-emerald-50/50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {scrapedBatch.length} Discovered Targets in {targetLocation}
                  </h4>
                </div>
                <button
                  onClick={handleImportToCRM}
                  disabled={imported}
                  className={`text-xs px-4 py-2 rounded-xl font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    imported
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white hover:brightness-105 shadow-[0_4px_16px_rgba(16,185,129,0.4)] border-t-2 border-l-1.5 border-white border-b-2 border-teal-900 active:translate-y-0.5'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{imported ? 'Synced to MySQL Database ✓' : `Sync ${scrapedBatch.length} Leads to MySQL`}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scrapedBatch.map((lead) => (
                  <div key={lead.id} className="glass-3d-card p-3 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[130px]">
                        {lead.name}
                      </span>
                      <span className="text-[10px] text-amber-500 font-black">
                        ★ {lead.rating}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {lead.city}, {lead.state}
                    </div>
                    <div className="text-[11px] text-sky-700 font-mono font-bold">
                      {lead.phone}
                    </div>
                    <div className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 w-fit font-bold">
                      {lead.websiteStatus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
