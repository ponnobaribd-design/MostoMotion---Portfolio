import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const isAutostart = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1';
    if (isAutostart) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Increment loading percentage smoothly
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 400); // Small fadeout delay
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#020205] z-[999999] flex flex-col items-center justify-center select-none transition-all duration-700 ease-out"
      style={{
        opacity: percentage === 100 ? 0 : 1,
        pointerEvents: percentage === 100 ? 'none' : 'auto',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Futuristic glowing orbits representing motion graphics frames */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer Cyan Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-[#00d4ff] border-l-transparent animate-spin"
            style={{ 
              animationDuration: '1.2s',
              filter: 'drop-shadow(0 0 10px #00d4ff)'
            }}
          />
          {/* Inner Purple Ring spinning in reverse coordinate */}
          <div 
            className="absolute inset-3 rounded-full border-2 border-t-[#bd00ff] border-r-transparent border-b-transparent border-l-transparent animate-spin"
            style={{ 
              animationDuration: '0.8s', 
              animationDirection: 'reverse',
              filter: 'drop-shadow(0 0 10px #bd00ff)'
            }}
          />
          {/* Core high-tech light emitter */}
          <div 
            className="absolute inset-8 bg-white rounded-full animate-pulse"
            style={{
              boxShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px #00d4ff, 0 0 45px #bd00ff'
            }}
          />
        </div>

        {/* Minimalist Tech-styled Labels */}
        <div className="text-center space-y-2">
          <h3 className="header-font text-[11px] font-black text-white tracking-[0.8em] uppercase text-center pl-[0.8em]">
            SYSTEM BOOT
          </h3>
          <div className="flex items-center justify-center gap-2 font-mono text-[9px] text-[#00d4ff] uppercase tracking-widest pl-1">
            <span>READYING ENGINE</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          {/* Precise loading percentage */}
          <p className="font-mono text-xs text-white/30 tracking-widest mt-1">
            {percentage}%
          </p>
        </div>

        {/* Dynamic decorative light line sweeping below */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent mt-6 overflow-hidden relative">
          <div 
            className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#bd00ff] to-transparent"
            style={{
              animation: 'sweep 1.5s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes sweep {
          0% { left: -50px; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
