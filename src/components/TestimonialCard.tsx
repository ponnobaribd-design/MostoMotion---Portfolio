import React, { useState, useRef } from 'react';

interface Review {
  name: string;
  role: string;
  text: string;
  color: string;
}

interface TestimonialCardProps {
  review: Review;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ review }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to values between -0.5 and 0.5
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angles (subtle: max 8 degrees)
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * -8; // Negative so it tilts towards the cursor
    
    // Calculate glow position percentage
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    
    setTilt({ x: rotateX, y: rotateY });
    setGlow({ x: glowX, y: glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Convert the "from-... to-..." classes to a styles-safe hex/rgb equivalent or extract colors
  // Default to branding colors for glow effects
  const glowColor = review.color.includes('purple-500') 
    ? 'rgba(168, 85, 247, 0.15)' 
    : review.color.includes('cyan-400') 
    ? 'rgba(34, 211, 238, 0.15)' 
    : 'rgba(0, 255, 157, 0.15)';

  const activeBorderColor = review.color.includes('purple-500')
    ? 'rgba(168, 85, 247, 0.4)'
    : review.color.includes('cyan-400')
    ? 'rgba(34, 211, 238, 0.4)'
    : 'rgba(0, 255, 157, 0.4)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-[2rem] overflow-hidden transition-all duration-300"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* CSS injection for glowing border animation */}
      <style>{`
        @keyframes border-glow-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* 3D Inner Card Element */}
      <div
        className="glass p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300 group"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
          transition: isHovered 
            ? 'border-color 0.3s, box-shadow 0.3s' 
            : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
          borderColor: isHovered ? activeBorderColor : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered 
            ? `0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px 0px ${glowColor}` 
            : '0 4px 20px -12px rgba(0, 0, 0, 0.5)',
          background: 'rgba(2, 9, 20, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          willChange: 'transform, border-color, box-shadow',
        }}
      >
        {/* Animated outer glow border line that activates on hover */}
        <div 
          className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            margin: '-1px',
            padding: '1.5px',
            background: 'linear-gradient(90deg, #00ff9d, #22d3ee, #a855f7, #00ff9d)',
            backgroundSize: '300% 300%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'border-glow-rotate 4s linear infinite',
          }}
        />

        {/* Dynamic Interactive Radial Spot Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 80%)`,
          }}
        />

        {/* Highlight strip matching client's visual palette */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${review.color}`}></div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40 shrink-0">
            <i className="fas fa-quote-left"></i>
          </div>
          <div className="grow">
            <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="header-font text-[10px] font-bold text-white uppercase tracking-widest">{review.name}</h4>
                <p className="text-[9px] text-white/30 uppercase tracking-widest">{review.role}</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <i key={star} className="fas fa-star text-[8px] text-[#00ff9d]"></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
