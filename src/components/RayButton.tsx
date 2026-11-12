import React, { useState } from 'react';

interface RayButtonProps {
  href: string;
  target?: string;
  className?: string;
  children: React.ReactNode;
  isIcon?: boolean;
  platform?: string;
}

export const RayButton: React.FC<RayButtonProps> = ({
  href,
  target,
  className = '',
  children,
  isIcon = false,
  platform = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine custom ray colors based on brand/button
  let gradientColors = 'from 0deg, transparent 0deg, #00ff9d 60deg, transparent 120deg, #22d3ee 180deg, transparent 240deg, #a855f7 300deg, transparent 360deg';
  
  if (platform === 'LinkedIn') {
    gradientColors = 'from 0deg, transparent 0deg, #3b82f6 60deg, transparent 120deg, #60a5fa 180deg, transparent 240deg, #2563eb 300deg, transparent 360deg';
  } else if (platform === 'YouTube') {
    gradientColors = 'from 0deg, transparent 0deg, #ef4444 60deg, transparent 120deg, #f87171 180deg, transparent 240deg, #dc2626 300deg, transparent 360deg';
  } else if (platform === 'Behance') {
    gradientColors = 'from 0deg, transparent 0deg, #06b6d4 60deg, transparent 120deg, #22d3ee 180deg, transparent 240deg, #0891b2 300deg, transparent 360deg';
  } else if (platform === 'Upwork') {
    gradientColors = 'from 0deg, transparent 0deg, #10b981 60deg, transparent 120deg, #34d399 180deg, transparent 240deg, #059669 300deg, transparent 360deg';
  }

  // Smooth CSS layout shifting margins & scaling factors on hover
  // The layout shift horizontally pushes nearby buttons outward.
  const scaleValue = isHovered ? (isIcon ? 1.15 : 1.08) : 1;
  const horizontalMarginValue = isHovered ? (isIcon ? '12px' : '20px') : '0px';
  const verticalMarginValue = isHovered ? (isIcon ? '6px' : '10px') : '0px';

  return (
    <a
      href={href}
      target={target}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `scale(${scaleValue})`,
        marginLeft: horizontalMarginValue,
        marginRight: horizontalMarginValue,
        marginTop: verticalMarginValue,
        marginBottom: verticalMarginValue,
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), margin 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`
        relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] group select-none
        ${className}
      `}
    >
      {/* 1. Rotator Keyframes Injection (scoped nicely) */}
      <style>{`
        @keyframes ray-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>

      {/* 2. Rotating Border Background Ray */}
      <div 
        className="absolute top-1/2 left-1/2 w-[280%] h-[280%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background: `conic-gradient(${gradientColors})`,
          animation: 'ray-spin 4.5s linear infinite',
          opacity: isHovered ? 0.95 : 0.45,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* 3. Deep backdrop mask to hold standard color theme inside the button */}
      <div 
        className={`
          absolute inset-[1px] rounded-full bg-[#030308]/95 z-[1] transition-all duration-300
          ${isHovered ? 'bg-black/50 backdrop-blur-md' : 'bg-[#030308]/95'}
        `}
      />

      {/* 4. Active button overlay glow when hovered */}
      <div 
        className="absolute inset-[1px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-[2]" 
        style={{
          background: platform === 'LinkedIn' ? '#3b82f6' : 
                      platform === 'YouTube' ? '#ef4444' : 
                      platform === 'Behance' ? '#06b6d4' : 
                      platform === 'Upwork' ? '#10b981' : '#00ff9d',
        }}
      />

      {/* 5. Actual children overlay */}
      <span className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </span>
    </a>
  );
};

export default RayButton;
