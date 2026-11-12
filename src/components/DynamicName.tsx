import React, { useState, useMemo } from 'react';

interface DynamicNameProps {
  className?: string;
}

interface LetterConfig {
  char: string;
  id: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
}

export const DynamicName: React.FC<DynamicNameProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const text = "MD. MOSTOFA    KAMAL";

  // Pre-calculate stable 3D values for each character
  const letters = useMemo(() => {
    const list: LetterConfig[] = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // Alternate the push-pull Z depth, scale, and rotation angles
      const z = Math.sin(i * 1.5) * 20; // -20px to +20px
      const scale = 1.0 + Math.cos(i * 1.2) * 0.1; // 0.9 to 1.1 scale
      const rotateX = Math.sin(i * 1.8) * 12; // -12deg to +12deg
      const rotateY = Math.cos(i * 2.1) * 12; // -12deg to +12deg

      list.push({
        char,
        id: i,
        z,
        scale,
        rotateX,
        rotateY
      });
    }
    return list;
  }, [text]);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex flex-wrap justify-center lg:justify-start select-none cursor-pointer relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Styles for robust black text-shadow, gorgeous neon glow, and flowing color/light sweep */}
      <style>{`
        /* Dynamic flowing light/color sweep across the text on hover */
        @keyframes letter-color-sweep {
          0% {
            color: #00ff9d;
            text-shadow: 
              0px 4px 12px rgba(0, 0, 0, 1),
              0px 8px 24px rgba(0, 0, 0, 1),
              0px 0px 15px rgba(0, 255, 157, 0.8),
              0px 0px 30px rgba(34, 211, 238, 0.5);
          }
          33% {
            color: #22d3ee;
            text-shadow: 
              0px 4px 12px rgba(0, 0, 0, 1),
              0px 8px 24px rgba(0, 0, 0, 1),
              0px 0px 15px rgba(34, 211, 238, 0.8),
              0px 0px 30px rgba(168, 85, 247, 0.5);
          }
          66% {
            color: #a855f7;
            text-shadow: 
              0px 4px 12px rgba(0, 0, 0, 1),
              0px 8px 24px rgba(0, 0, 0, 1),
              0px 0px 15px rgba(168, 85, 247, 0.8),
              0px 0px 30px rgba(0, 255, 157, 0.5);
          }
          100% {
            color: #00ff9d;
            text-shadow: 
              0px 4px 12px rgba(0, 0, 0, 1),
              0px 8px 24px rgba(0, 0, 0, 1),
              0px 0px 15px rgba(0, 255, 157, 0.8),
              0px 0px 30px rgba(34, 211, 238, 0.5);
          }
        }

        .clean-name-letter {
          font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
          font-weight: 900;
          color: #ffffff;
          /* Robust black drop shadow to ensure extreme readability and solid presentation */
          text-shadow: 
            0px 4px 12px rgba(0, 0, 0, 1),
            0px 8px 24px rgba(0, 0, 0, 1),
            -1px -1px 0px rgba(0, 0, 0, 0.8),
            1px -1px 0px rgba(0, 0, 0, 0.8),
            -1px 1px 0px rgba(0, 0, 0, 0.8),
            1px 1px 0px rgba(0, 0, 0, 0.8);
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), text-shadow 0.6s ease, color 0.6s ease;
        }

        /* Continuous gradient flowing across letters when hovered */
        .clean-name-letter-hovered {
          animation: letter-color-sweep 3s ease-in-out infinite;
        }
      `}</style>

      {letters.map((letter) => {
        if (letter.char === ' ') {
          return (
            <span key={letter.id} className="w-[0.22em] shrink-0" aria-hidden="true">
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={letter.id}
            className={`inline-block clean-name-letter ${
              isHovered ? 'clean-name-letter-hovered' : ''
            }`}
            style={{
              transform: isHovered
                ? `translate3d(0, 0, ${letter.z}px) scale(${letter.scale}) rotateX(${letter.rotateX}deg) rotateY(${letter.rotateY}deg)`
                : 'translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg)',
              // Stagger the animation delay so the light sweep flows smoothly across characters
              animationDelay: `${letter.id * 0.07}s`,
            }}
          >
            {letter.char}
          </span>
        );
      })}
    </span>
  );
};

export default DynamicName;
