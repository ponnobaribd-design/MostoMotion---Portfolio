import React, { useState, useRef } from 'react';

interface MagneticLinkProps {
  href: string;
  active: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  children: React.ReactNode;
}

export const MagneticLink: React.FC<MagneticLinkProps> = ({
  href,
  active,
  className = '',
  activeClassName = '',
  inactiveClassName = '',
  children
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    
    // Center point of the item
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from center
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Magnetic pull strength factors (adjust for feel)
    const strengthX = 0.3;
    const strengthY = 0.35;
    
    setPosition({
      x: dx * strengthX,
      y: dy * strengthY
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered 
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), text-shadow 0.3s ease, box-shadow 0.3s ease' 
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), text-shadow 0.3s ease, box-shadow 0.3s ease',
      }}
      className={`
        relative block transition-all duration-300
        ${className}
        ${active ? activeClassName : inactiveClassName}
      `}
    >
      {/* Subtle radial glow background under the text when hovered */}
      <span 
        className={`
          absolute inset-0 -z-10 rounded-full transition-all duration-500 pointer-events-none blur-md bg-[#00ff9d]/5
          ${isHovered ? 'scale-110 opacity-100' : 'scale-95 opacity-0'}
        `}
      />
      
      {/* Outer subtle glow outline on the link text container if active/hovered */}
      <span 
        className={`
          absolute inset-[-4px] -z-10 rounded-full border border-[#00ff9d]/10 transition-all duration-500 pointer-events-none
          ${isHovered ? 'scale-105 opacity-100 blur-[2px]' : 'scale-95 opacity-0'}
        `}
      />
      
      {/* Simple children rendering */}
      {children}
    </a>
  );
};

export default MagneticLink;
