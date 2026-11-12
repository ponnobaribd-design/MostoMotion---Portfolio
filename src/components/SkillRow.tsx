import React, { useState } from 'react';
import { Skill } from '../types';

interface SkillRowProps {
  skill: Skill;
}

export const SkillRow: React.FC<SkillRowProps> = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  const targetLevel = skill.level || 80;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-row items-center justify-between gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl group transition-all aura-hover hover:border-[#00ff9d]/30 relative overflow-hidden"
    >
      {/* CSS Keyframe animation for sci-fi bar pulsing glow */}
      <style>{`
        @keyframes scifi-pulse-glow {
          0%, 100% {
            box-shadow: 0 0 6px rgba(34, 211, 238, 0.5), 0 0 12px rgba(0, 255, 157, 0.3);
          }
          50% {
            box-shadow: 0 0 14px rgba(34, 211, 238, 0.9), 0 0 24px rgba(0, 255, 157, 0.6);
          }
        }
        .scifi-glow-active {
          animation: scifi-pulse-glow 1.8s ease-in-out infinite;
        }
        @keyframes skill-pulsate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes skill-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        @keyframes skill-rotate {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes skill-glow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.1)); }
          50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.7)); }
        }
        @keyframes skill-jitter {
          0%, 90%, 100% { transform: translate(0, 0) rotate(0deg); }
          92% { transform: translate(-1px, 1px) rotate(-1.5deg); }
          94% { transform: translate(1px, -1px) rotate(1.5deg); }
          96% { transform: translate(-1.5px, -0.5px) rotate(-1deg); }
          98% { transform: translate(1px, 1.5px) rotate(1deg); }
        }
      `}</style>

      {/* Background highlight on hover */}
      <div 
        className="absolute inset-0 bg-[#00ff9d]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#00ff9d]/10 shrink-0">
          <i 
            className={`fas ${skill.icon} text-lg text-white/30 group-hover:text-[#00ff9d] transition-colors`}
            style={{
              display: 'inline-block',
              animation: skill.name === 'After Effects' 
                ? 'skill-pulsate 2s ease-in-out infinite' 
                : skill.name === 'Premiere Pro' 
                ? 'skill-drift 3s ease-in-out infinite' 
                : skill.name === 'Illustrator' 
                ? 'skill-rotate 2.5s ease-in-out infinite' 
                : skill.name === 'Canva Pro' 
                ? 'skill-glow 2s ease-in-out infinite' 
                : skill.name === 'CapCut' 
                ? 'skill-jitter 3.5s ease-in-out infinite' 
                : 'none'
            }}
          ></i>
        </div>
        <span className="header-font text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">
          {skill.name}
        </span>
      </div>

      {/* Dynamic percentage bar */}
      <div className="flex items-center gap-3 w-28 xs:w-36 sm:w-40 md:w-48 lg:w-32 xl:w-44 relative z-10 shrink-0">
        <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isHovered ? 'scifi-glow-active' : ''}`}
            style={{ 
              width: isHovered ? `${targetLevel}%` : '0%',
              background: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px, transparent 4px), linear-gradient(90deg, #22d3ee, #00ff9d, #a855f7)',
              backgroundSize: '100% 100%, 300% 100%'
            }}
          />
        </div>
        <span className="header-font text-[9px] font-bold w-8 text-right text-gray-500 group-hover:text-[#00ff9d] transition-colors">
          {isHovered ? `${targetLevel}%` : '0%'}
        </span>
      </div>
    </div>
  );
};

export default SkillRow;
