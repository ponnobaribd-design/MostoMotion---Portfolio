import React, { useEffect, useRef } from 'react';

export const SciFiBackground: React.FC = () => {
  const blueOrbRef = useRef<HTMLDivElement>(null);
  const greenOrbRef = useRef<HTMLDivElement>(null);
  const dotGrid1Ref = useRef<HTMLDivElement>(null);
  const dotGrid2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Highly performant parallax offsets utilizing raw style mutation to avoid React rendering overhead
          if (blueOrbRef.current) {
            blueOrbRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
          }
          if (greenOrbRef.current) {
            greenOrbRef.current.style.transform = `translate3d(0, ${scrollY * -0.1}px, 0)`;
          }
          if (dotGrid1Ref.current) {
            dotGrid1Ref.current.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
          }
          if (dotGrid2Ref.current) {
            dotGrid2Ref.current.style.transform = `translate3d(0, ${scrollY * -0.03}px, 0)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial alignment
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-transparent">
      {/* CSS Keyframe animations for subtle ambient drift and dot grid translation */}
      <style>{`
        @keyframes float-orb-blue {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float-orb-green {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(0.95);
          }
          66% {
            transform: translate(50px, -20px) scale(1.15);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes dot-grid-drift {
          0% {
            transform: translate(0px, 0px);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>

      {/* 1. Base Gradient Background (Deep Blue and Deep Green blending) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'var(--bg-gradient)',
        }}
      />

      {/* 2. Slow drifting atmospheric deep red/crimson orb */}
      <div ref={blueOrbRef} className="absolute inset-0 w-full h-full will-change-transform">
        <div 
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.25]"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
            animation: 'float-orb-blue 25s ease-in-out infinite',
          }}
        />
      </div>

      {/* 3. Slow drifting atmospheric deep rose/violet orb */}
      <div ref={greenOrbRef} className="absolute inset-0 w-full h-full will-change-transform">
        <div 
          className="absolute bottom-1/4 right-1/4 w-[55vw] h-[55vw] rounded-full blur-[100px] opacity-[0.22]"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
            animation: 'float-orb-green 30s ease-in-out infinite',
          }}
        />
      </div>

      {/* 4. Faintly visible, animated line grid pattern across the entire background */}
      <div ref={dotGrid1Ref} className="absolute inset-0 w-full h-full will-change-transform">
        <div 
          className="absolute w-[calc(100%+100px)] h-[calc(100%+100px)] -top-[50px] -left-[50px] opacity-[0.35]"
          style={{
            backgroundImage: 'var(--bg-grid)',
            backgroundSize: '50px 50px',
            animation: 'dot-grid-drift 40s linear infinite',
          }}
        />
      </div>

      {/* 5. A second very subtle grid layer shifting in reverse to add sophisticated sci-fi depth */}
      <div ref={dotGrid2Ref} className="absolute inset-0 w-full h-full will-change-transform">
        <div 
          className="absolute w-[calc(100%+200px)] h-[calc(100%+200px)] -top-[100px] -left-[100px] opacity-[0.15]"
          style={{
            backgroundImage: 'var(--bg-grid)',
            backgroundSize: '100px 100px',
            animation: 'dot-grid-drift 80s linear infinite reverse',
          }}
        />
      </div>

      {/* 6. Ambient edge darkening overlay for high contrast center section content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};

export default SciFiBackground;
