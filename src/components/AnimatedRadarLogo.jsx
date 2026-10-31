import React from 'react';

export function AnimatedRadarLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: { container: 'w-9 h-9', inner: 'w-7 h-7', beam: 'w-3.5 h-3.5', core: 'w-1.5 h-1.5' },
    md: { container: 'w-11 h-11', inner: 'w-9 h-9', beam: 'w-4.5 h-4.5', core: 'w-2 h-2' },
    lg: { container: 'w-16 h-16', inner: 'w-13 h-13', beam: 'w-6.5 h-6.5', core: 'w-2.5 h-2.5' },
    xl: { container: 'w-24 h-24', inner: 'w-20 h-20', beam: 'w-10 h-10', core: 'w-3 h-3' }
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${s.container} ${className}`}>
      {/* Outer 3D Glass Shell */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-sky-50 to-cyan-100/80 border-t-2 border-l-2 border-white border-b-2 border-sky-300/80 shadow-[0_8px_18px_rgba(14,165,233,0.25),inset_0_2px_4px_rgba(255,255,255,0.95)]"></div>

      {/* Pulsing Sonar Wave Ping */}
      <div className="absolute inset-1 rounded-xl bg-cyan-400/20 animate-ping pointer-events-none opacity-40"></div>

      {/* Concentric Radar Grid */}
      <div className={`relative rounded-xl border border-sky-300/70 bg-slate-900/90 overflow-hidden flex items-center justify-center shadow-inner ${s.inner}`}>
        {/* Radar Ring 1 */}
        <div className="absolute inset-1 rounded-full border border-cyan-400/30"></div>
        {/* Radar Ring 2 */}
        <div className="absolute inset-2.5 rounded-full border border-cyan-400/20"></div>

        {/* Crosshair Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[0.5px] bg-cyan-400/30"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-[0.5px] bg-cyan-400/30"></div>
        </div>

        {/* 360-Degree Sweeping Holographic Radar Beam */}
        <div className="absolute inset-0 animate-radar-beam-spin origin-center pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/60 via-cyan-400/20 to-transparent origin-bottom-right rounded-tl-full"></div>
        </div>

        {/* Target Blip 1 */}
        <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse"></div>
        {/* Target Blip 2 */}
        <div className="absolute bottom-2 left-1.5 w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_5px_#67e8f9] animate-ping"></div>

        {/* Center Sonar Node */}
        <div className={`relative rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] z-10 ${s.core}`}></div>
      </div>
    </div>
  );
}

