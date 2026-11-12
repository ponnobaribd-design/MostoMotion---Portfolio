import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';

interface MostoLogoProps {
  className?: string;
  isFooter?: boolean;
}

export const MostoLogo: React.FC<MostoLogoProps> = ({ className, isFooter = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block select-none cursor-pointer p-4 rounded-xl group"
    >
      {/* CSS Styles for Ripple Effects & Diagonal Light Sweep */}
      <style>{`
        @keyframes center-ripple-out {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.65;
            filter: blur(2px);
          }
          50% {
            opacity: 0.35;
            filter: blur(6px);
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
            filter: blur(12px);
          }
        }
        @keyframes light-sweep-animation {
          0% {
            background-position: -150% 0;
          }
          100% {
            background-position: 150% 0;
          }
        }
        .logo-light-sweep {
          background: linear-gradient(110deg, #00ff9d 15%, #22d3ee 35%, #ffffff 46%, #ffffff 54%, #22d3ee 65%, #a855f7 85%);
          background-size: 250% 100%;
          animation: light-sweep-animation 4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-light-sweep-footer {
          background: linear-gradient(110deg, rgba(255,255,255,0.4) 15%, rgba(0,255,157,0.4) 35%, #ffffff 46%, #ffffff 54%, rgba(0,255,157,0.4) 65%, rgba(255,255,255,0.4) 85%);
          background-size: 250% 100%;
          animation: light-sweep-animation 4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-light-sweep-footer-hovered {
          background: linear-gradient(110deg, #00ff9d 15%, #22d3ee 35%, #ffffff 46%, #ffffff 54%, #22d3ee 65%, #a855f7 85%);
          background-size: 250% 100%;
          animation: light-sweep-animation 4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-ripple-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(0, 255, 157, 0.3);
          background: radial-gradient(circle, rgba(0, 255, 157, 0.08) 0%, transparent 70%);
          pointer-events: none;
          transform-origin: center center;
          animation: center-ripple-out 4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          will-change: transform, opacity;
        }
        .logo-ripple-circle-cyan {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(34, 211, 238, 0.25);
          background: radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%);
          pointer-events: none;
          transform-origin: center center;
          animation: center-ripple-out 4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          animation-delay: 2s;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Embedded Center-Outward Ripples (Active Continuously, slightly enhanced/larger on hover) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
        <div 
          className="logo-ripple-circle" 
          style={{
            width: isFooter ? '320px' : '220px',
            height: isFooter ? '160px' : '110px',
            borderColor: isHovered ? 'rgba(0, 255, 157, 0.45)' : 'rgba(0, 255, 157, 0.2)',
          }}
        />
        <div 
          className="logo-ripple-circle-cyan" 
          style={{
            width: isFooter ? '320px' : '220px',
            height: isFooter ? '160px' : '110px',
            borderColor: isHovered ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.15)',
          }}
        />
      </div>

      {/* Main Logo Text - Keeping font, size, leading and look exact with added looping Light Sweep */}
      {isFooter ? (
        <div 
          className={`luxury-font text-6xl md:text-8xl font-black italic select-none transition-all duration-700 relative z-10 pr-4 overflow-visible ${isHovered ? 'logo-light-sweep-footer-hovered' : 'logo-light-sweep-footer'} ${className}`}
          style={{
            textShadow: isHovered ? '0 0 25px rgba(0, 255, 157, 0.45)' : 'none',
          }}
        >
          {PERSONAL_INFO.brand}
        </div>
      ) : (
        <h1 
          className={`luxury-font text-4xl md:text-6xl font-black tracking-tighter italic leading-none transition-all duration-500 relative z-10 logo-light-sweep pr-4 overflow-visible ${className}`}
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 25px rgba(0, 255, 157, 0.95)) drop-shadow(0 0 35px rgba(6, 182, 212, 0.8))' 
              : 'drop-shadow(0 0 10px rgba(0, 255, 157, 0.35))',
          }}
        >
          {PERSONAL_INFO.brand}
        </h1>
      )}
    </div>
  );
};

export default MostoLogo;
