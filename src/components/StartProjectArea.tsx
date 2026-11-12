import React, { useState, useRef, MouseEvent } from 'react';

export const StartProjectArea: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse positions from -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Limit tilt ranges to keep it elegant and subtle
    setTilt({
      x: x * 18, // Max 9 degrees rotation on Y axis
      y: y * -18, // Max 9 degrees rotation on X axis
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block cursor-pointer select-none group py-4 pr-12 rounded-3xl"
      style={{ perspective: '1000px' }}
    >
      {/* Custom styles for animations & effects */}
      <style>{`
        @keyframes subtle-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes pulse-bloom {
          0%, 100% {
            transform: scale(0.9) translate(-50%, -50%);
            opacity: 0.15;
            filter: blur(20px);
          }
          50% {
            transform: scale(1.15) translate(-48%, -52%);
            opacity: 0.45;
            filter: blur(35px);
          }
        }
        .start-glow {
          text-shadow: 
            0 0 10px rgba(0, 255, 157, 0.4),
            0 0 25px rgba(0, 255, 157, 0.3),
            0 0 50px rgba(0, 255, 157, 0.1);
        }
        .project-glow {
          text-shadow: 
            0 0 10px rgba(168, 85, 247, 0.4),
            0 0 25px rgba(168, 85, 247, 0.3),
            0 0 50px rgba(168, 85, 247, 0.1);
        }
        .text-layer-3d {
          transform-style: preserve-3d;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
      `}</style>

      {/* Under-layer dynamic light bloom expanding on hover */}
      <div 
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full w-[220px] h-[220px] z-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 157, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)',
          animation: isHovered ? 'pulse-bloom 4s ease-in-out infinite' : 'none',
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Floating interactive particles trailing on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-ping opacity-60" />
          <div className="absolute bottom-1/3 left-10 w-1 h-1 rounded-full bg-purple-400 animate-pulse opacity-80" />
          <div className="absolute top-2/3 right-12 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-50" />
        </div>
      )}

      {/* Text block with 3D rotate transition */}
      <h3 
        className="header-font text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9] uppercase relative z-10 text-layer-3d"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        }}
      >
        <span 
          className="inline-block text-[#00ff9d] transition-all duration-300 transform"
          style={{
            transform: isHovered ? 'translateZ(30px) scale(1.02)' : 'translateZ(0px)',
            filter: isHovered ? 'drop-shadow(0 0 15px rgba(0, 255, 157, 0.7))' : 'none',
            textShadow: isHovered ? '0 0 20px rgba(0, 255, 157, 0.5)' : 'none',
          }}
        >
          START
        </span> 
        <br />
        <span 
          className="inline-block text-purple-500 transition-all duration-300 transform"
          style={{
            transform: isHovered ? 'translateZ(15px) scale(1.01)' : 'translateZ(0px)',
            filter: isHovered ? 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.7))' : 'none',
            textShadow: isHovered ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none',
          }}
        >
          PROJECT
        </span>
      </h3>
    </div>
  );
};

export default StartProjectArea;
