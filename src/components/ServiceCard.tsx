import React, { useState } from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  videoColor: string; // Left in signature to prevent dependency breaks
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Elite Sci-Fi Neon Palette Matching Background Aesthetic
  const neonCyan = '#00d4ff';
  const neonPurple = '#bd00ff';
  
  // Create beautiful, rich neon highlights for all five boxes uniformly
  const glowShadow = `0 15px 45px rgba(0, 212, 255, 0.35), 0 0 25px rgba(189, 0, 255, 0.25), inset 0 0 15px rgba(0, 212, 255, 0.1)`;
  const activeBorder = `rgba(0, 212, 255, 0.6)`;
  const activeBg = `linear-gradient(135deg, rgba(2, 2, 5, 0.9) 0%, rgba(10, 5, 20, 0.95) 100%)`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="service-card p-8 border rounded-[2rem] transition-all duration-500 ease-out select-none relative overflow-hidden"
      style={{
        boxShadow: isHovered ? glowShadow : 'none',
        borderColor: isHovered ? activeBorder : 'rgba(255, 255, 255, 0.05)',
        background: isHovered ? activeBg : 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(16px)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {/* Self-contained high-fidelity micro-animation system for core service icons */}
      <style>{`
        @keyframes loop-pulsate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        @keyframes loop-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loop-vibrate {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1.2px, 0.8px) rotate(-0.5deg); }
          40% { transform: translate(-0.8px, -1.2px) rotate(0.5deg); }
          60% { transform: translate(1.2px, 0.8px) rotate(0deg); }
          80% { transform: translate(0.8px, -0.8px) rotate(-0.5deg); }
        }
        @keyframes loop-hue-shift {
          0% { filter: hue-rotate(0deg) saturate(1.2); }
          100% { filter: hue-rotate(360deg) saturate(1.2); }
        }
        @keyframes loop-hue-shift-fast {
          0% { filter: hue-rotate(0deg) saturate(1.6) brightness(1.2); }
          100% { filter: hue-rotate(360deg) saturate(1.6) brightness(1.2); }
        }
        @keyframes loop-social-expand {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes sound-wave-pulse {
          0% { transform: scale(0.95); opacity: 0.65; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        @keyframes social-dot-expand {
          0%, 100% { transform: translate(0, 0) scale(0.85); opacity: 0.35; }
          50% { transform: translate(var(--tx), var(--ty)) scale(1.3); opacity: 1; }
        }
        @keyframes social-dot-erratic {
          0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.4; }
          20% { transform: translate(calc(var(--tx) * 1.6), calc(var(--ty) * 0.4)) scale(1.4); opacity: 1; }
          40% { transform: translate(calc(var(--tx) * 0.3), calc(var(--ty) * 1.8)) scale(0.65); opacity: 0.5; }
          60% { transform: translate(calc(var(--tx) * 1.9), calc(var(--ty) * 1.5)) scale(1.5); opacity: 1; }
          80% { transform: translate(calc(var(--tx) * 0.7), calc(var(--ty) * 0.7)) scale(0.9); opacity: 0.75; }
        }
        @keyframes social-line-erratic {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.55) rotate(7deg); }
          50% { transform: scale(0.65) rotate(-10deg); }
          75% { transform: scale(1.75) rotate(14deg); }
        }
        @keyframes loop-jump-jitter {
          0% { transform: scale(1) translateY(0); }
          15% { transform: scale(1.15) translateY(-5px) rotate(-4deg); }
          30% { transform: scale(0.9) translateY(2px) rotate(3deg); }
          45% { transform: scale(1.08) translateY(-2px) rotate(-2deg); }
          60% { transform: scale(0.97) translateY(1px) rotate(1deg); }
          75% { transform: scale(1.02) translateY(-0.5px) rotate(-0.5deg); }
          100% { transform: scale(1) translateY(0) rotate(0deg); }
        }
        @keyframes equalizer-bar-1 {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        @keyframes equalizer-bar-2 {
          0%, 100% { height: 8px; }
          50% { height: 22px; }
        }
        @keyframes equalizer-bar-3 {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
        @keyframes equalizer-bar-4 {
          0%, 100% { height: 10px; }
          50% { height: 24px; }
        }
        @keyframes equalizer-bar-5 {
          0%, 100% { height: 5px; }
          50% { height: 19px; }
        }
      `}</style>

      {/* Decorative ambient background mesh on hover */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: isHovered ? 0.05 : 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${neonCyan}, ${neonPurple}, transparent 70%)`
        }}
      />

      {/* Icon Area */}
      <div 
        className="service-icon w-14 h-14 rounded-xl flex items-center justify-center mb-6 border transition-all duration-500 relative z-10"
        style={{
          borderColor: isHovered ? 'rgba(0, 212, 255, 0.7)' : 'rgba(255, 255, 255, 0.05)',
          backgroundColor: isHovered ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
          boxShadow: isHovered ? `0 0 20px rgba(0, 212, 255, 0.4)` : 'none',
        }}
      >
        {/* Special wave-like vibrations radiating outward for Sound Design */}
        {service.id === 'sound' && (
          <>
            <div className="absolute inset-0 rounded-xl border border-[#00d4ff]/40 pointer-events-none" style={{ animation: 'sound-wave-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite' }} />
            <div className="absolute inset-0 rounded-xl border border-[#bd00ff]/30 pointer-events-none" style={{ animation: 'sound-wave-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite', animationDelay: '0.66s' }} />
            <div className="absolute inset-0 rounded-xl border border-[#00d4ff]/20 pointer-events-none" style={{ animation: 'sound-wave-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite', animationDelay: '1.33s' }} />
          </>
        )}

        {/* Connected lines and dots expanding and contracting smoothly for Social Media Manager */}
        {service.id === 'social' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner node dots */}
            <div className="absolute w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ top: '-1px', left: '-1px', '--tx': '-5px', '--ty': '-5px', backgroundColor: isHovered ? '#00d4ff' : 'rgba(255, 255, 255, 0.35)', animation: isHovered ? 'social-dot-erratic 1.5s ease-in-out infinite' : 'social-dot-expand 3s ease-in-out infinite' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ top: '-1px', right: '-1px', '--tx': '5px', '--ty': '-5px', backgroundColor: isHovered ? '#bd00ff' : 'rgba(255, 255, 255, 0.35)', animation: isHovered ? 'social-dot-erratic 1.5s ease-in-out infinite' : 'social-dot-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.3s' : '0.6s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ bottom: '-1px', left: '-1px', '--tx': '-5px', '--ty': '5px', backgroundColor: isHovered ? '#bd00ff' : 'rgba(255, 255, 255, 0.35)', animation: isHovered ? 'social-dot-erratic 1.5s ease-in-out infinite' : 'social-dot-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.6s' : '1.2s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ bottom: '-1px', right: '-1px', '--tx': '5px', '--ty': '5px', backgroundColor: isHovered ? '#00d4ff' : 'rgba(255, 255, 255, 0.35)', animation: isHovered ? 'social-dot-erratic 1.5s ease-in-out infinite' : 'social-dot-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.9s' : '1.8s' } as React.CSSProperties} />
            
            {/* Connected lines connecting the corners of the box, expanding and contracting */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ opacity: isHovered ? 0.7 : 0.35 }}>
              <line x1="12" y1="12" x2="-1" y2="-1" stroke={isHovered ? "#00d4ff" : "rgba(255, 255, 255, 0.2)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2" style={{ transition: 'stroke 0.5s', transformOrigin: '12px 12px', animation: isHovered ? 'social-line-erratic 1.2s ease-in-out infinite' : 'loop-social-expand 3s ease-in-out infinite' }} />
              <line x1="44" y1="12" x2="57" y2="-1" stroke={isHovered ? "#bd00ff" : "rgba(255, 255, 255, 0.2)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2" style={{ transition: 'stroke 0.5s', transformOrigin: '44px 12px', animation: isHovered ? 'social-line-erratic 1.2s ease-in-out infinite' : 'loop-social-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.3s' : '0.6s' }} />
              <line x1="12" y1="44" x2="-1" y2="57" stroke={isHovered ? "#bd00ff" : "rgba(255, 255, 255, 0.2)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2" style={{ transition: 'stroke 0.5s', transformOrigin: '12px 44px', animation: isHovered ? 'social-line-erratic 1.2s ease-in-out infinite' : 'loop-social-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.6s' : '1.2s' }} />
              <line x1="44" y1="44" x2="57" y2="57" stroke={isHovered ? "#00d4ff" : "rgba(255, 255, 255, 0.2)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2" style={{ transition: 'stroke 0.5s', transformOrigin: '44px 44px', animation: isHovered ? 'social-line-erratic 1.2s ease-in-out infinite' : 'loop-social-expand 3s ease-in-out infinite', animationDelay: isHovered ? '0.9s' : '1.8s' }} />
            </svg>
          </div>
        )}

        {/* Clean animation wrapper separating continuous looping animations from interactive hover scale */}
        {service.id === 'editing' ? (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              animation: isHovered ? 'loop-jump-jitter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' : 'none',
              transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
              filter: isHovered ? `drop-shadow(0 0 10px ${neonCyan}) drop-shadow(0 0 4px ${neonPurple})` : 'none',
            }}
          >
            {/* Constantly spinning film reel SVG */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6"
            >
              <g 
                style={{ 
                  animation: 'loop-spin 6s linear infinite', 
                  transformOrigin: '12px 12px' 
                }}
              >
                {/* Outer ring */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Inner core ring */}
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                {/* Center dot spindle */}
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                {/* Symmetrical film reel holes */}
                <circle cx="12" cy="6.2" r="1.5" fill="currentColor" />
                <circle cx="6.5" cy="10.2" r="1.5" fill="currentColor" />
                <circle cx="8.6" cy="16.7" r="1.5" fill="currentColor" />
                <circle cx="15.4" cy="16.7" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="10.2" r="1.5" fill="currentColor" />
              </g>
            </svg>
          </div>
        ) : service.id === 'sound' ? (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
              filter: isHovered ? `drop-shadow(0 0 10px ${neonCyan}) drop-shadow(0 0 4px ${neonPurple})` : 'none',
            }}
          >
            {/* Constant rise-and-fall equalizer bars with varying speeds */}
            <div className="flex items-end justify-center gap-[3px] w-6 h-6 px-0.5 pb-0.5">
              <div className="w-[3px] rounded-t-sm bg-current" style={{ animation: 'equalizer-bar-1 0.8s ease-in-out infinite' }} />
              <div className="w-[3px] rounded-t-sm bg-current" style={{ animation: 'equalizer-bar-2 0.5s ease-in-out infinite' }} />
              <div className="w-[3px] rounded-t-sm bg-current" style={{ animation: 'equalizer-bar-3 1.1s ease-in-out infinite' }} />
              <div className="w-[3px] rounded-t-sm bg-current" style={{ animation: 'equalizer-bar-4 0.7s ease-in-out infinite' }} />
              <div className="w-[3px] rounded-t-sm bg-current" style={{ animation: 'equalizer-bar-5 0.9s ease-in-out infinite' }} />
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              animation: service.id === 'motion' 
                ? (isHovered ? 'loop-pulsate 0.6s ease-in-out infinite' : 'loop-pulsate 2.5s ease-in-out infinite') 
                : service.id === 'color' 
                ? (isHovered ? 'loop-hue-shift-fast 1.5s linear infinite' : 'loop-hue-shift 6s linear infinite') 
                : service.id === 'social'
                ? (isHovered ? 'social-line-erratic 1.2s ease-in-out infinite' : 'loop-social-expand 4s ease-in-out infinite')
                : 'none',
              transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <i 
              className={`fas ${service.icon} text-xl transition-colors duration-500`}
              style={{
                color: service.id === 'color'
                  ? (isHovered ? '#00d4ff' : 'rgba(255, 255, 255, 0.35)')
                  : (isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.35)'),
                filter: isHovered ? `drop-shadow(0 0 10px ${neonCyan}) drop-shadow(0 0 4px ${neonPurple})` : 'none',
              }}
            ></i>
          </div>
        )}
      </div>

      {/* Service Title */}
      <h4 
        className="header-font text-lg font-bold mb-4 uppercase tracking-tight transition-all duration-500 origin-left relative z-10"
        style={{
          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
          textShadow: isHovered ? `0 0 15px rgba(0, 212, 255, 0.95), 0 0 5px rgba(189, 0, 255, 0.9)` : 'none',
        }}
      >
        {service.title}
      </h4>

      {/* Description */}
      <p 
        className="text-sm mb-4 leading-relaxed transition-all duration-500 relative z-10"
        style={{
          color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
          textShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
        }}
      >
        {service.description}
      </p>

      {/* Hidden List with Smooth Slide Down */}
      <div
        className="grid transition-all duration-500 ease-in-out overflow-hidden relative z-10"
        style={{
          gridTemplateRows: isHovered ? '1fr' : '0fr',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-3">
            {service.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
                  transitionDelay: isHovered ? `${i * 75}ms` : '0ms',
                }}
              >
                {/* Micro glowing bullet dot */}
                <div 
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: isHovered ? `0 0 10px ${neonCyan}, 0 0 4px ${neonPurple}` : 'none',
                  }}
                ></div>
                <span 
                  className="transition-all duration-500"
                  style={{
                    color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                    textShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.6)' : 'none',
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
