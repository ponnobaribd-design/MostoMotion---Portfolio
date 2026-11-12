import React from 'react';

export const CartoonCharacter: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0 select-none">
      {/* Cartoon Character self-contained Styles */}
      <style>{`
        @keyframes robot-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }
        @keyframes robot-blink {
          0%, 46%, 50%, 96%, 100% {
            transform: scaleY(1);
          }
          48%, 98% {
            transform: scaleY(0.1);
          }
        }
        @keyframes robot-antenna-glow {
          0%, 100% {
            filter: drop-shadow(0 0 2px #00ff9d) drop-shadow(0 0 6px #00ff9d);
            fill: #00ff9d;
          }
          50% {
            filter: drop-shadow(0 0 8px #22d3ee) drop-shadow(0 0 15px #22d3ee);
            fill: #22d3ee;
          }
        }
        @keyframes robot-point {
          0%, 100% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(-15deg);
          }
          50% {
            transform: rotate(5deg) translateX(3px);
          }
          70% {
            transform: rotate(-10deg);
          }
        }
        @keyframes helper-glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
        .robot-floating-body {
          animation: robot-float 3s ease-in-out infinite;
        }
        .robot-eye-left {
          animation: robot-blink 4s infinite ease-in-out;
          transform-origin: 22px 28px;
        }
        .robot-eye-right {
          animation: robot-blink 4s infinite ease-in-out;
          transform-origin: 34px 28px;
        }
        .robot-antenna {
          animation: robot-antenna-glow 2s infinite ease-in-out;
        }
        .robot-pointer-arm {
          animation: robot-point 1.8s infinite ease-in-out;
          transform-origin: 40px 32px;
        }
      `}</style>

      {/* Aura background glow behind robot */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 157, 0.2) 0%, transparent 70%)',
          animation: 'helper-glow 3s ease-in-out infinite'
        }}
      />

      {/* Cute Vector Robot SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 robot-floating-body"
      >
        {/* Antenna stalk */}
        <line x1="28" y1="18" x2="28" y2="10" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        {/* Antenna bulb (Glowing) */}
        <circle cx="28" cy="8" r="3" className="robot-antenna" />

        {/* Left Arm (Relaxed) */}
        <path d="M14 32 C10 32, 8 38, 11 41" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />

        {/* Chassis / Body */}
        <rect x="18" y="32" width="20" height="16" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="2" />
        {/* Screen/Chest detail */}
        <rect x="22" y="36" width="12" height="8" rx="2" fill="#111827" stroke="#4b5563" strokeWidth="1" />
        <circle cx="25" cy="40" r="1" fill="#00ff9d" />
        <circle cx="31" cy="40" r="1" fill="#22d3ee" />

        {/* Head */}
        <rect x="15" y="16" width="26" height="18" rx="7" fill="#1f2937" stroke="#374151" strokeWidth="2" />
        
        {/* Face plate */}
        <rect x="18" y="19" width="20" height="12" rx="4" fill="#0f172a" />

        {/* Glowing eyes */}
        <circle cx="23" cy="25" r="2.5" fill="#00ff9d" className="robot-eye-left" style={{ filter: 'drop-shadow(0 0 2px #00ff9d)' }} />
        <circle cx="33" cy="25" r="2.5" fill="#00ff9d" className="robot-eye-right" style={{ filter: 'drop-shadow(0 0 2px #00ff9d)' }} />

        {/* Cute blush cheeks */}
        <circle cx="20" cy="28" r="1" fill="#ec4899" opacity="0.6" />
        <circle cx="36" cy="28" r="1" fill="#ec4899" opacity="0.6" />

        {/* Cute smiling mouth */}
        <path d="M26 28 Q28 30 30 28" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Pointer Arm pointing to the right (button side) */}
        <g className="robot-pointer-arm">
          {/* Upper arm */}
          <path d="M38 32 Q46 30 48 32" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Forearm and pointing index finger */}
          <path d="M48 32 L53 32" stroke="#00ff9d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M51 30 L54 32 L51 34" stroke="#00ff9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Little cute legs */}
        <line x1="24" y1="48" x2="24" y2="52" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="48" x2="32" y2="52" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="53" r="1.5" fill="#4b5563" />
        <circle cx="32" cy="53" r="1.5" fill="#4b5563" />
      </svg>
    </div>
  );
};

export default CartoonCharacter;
