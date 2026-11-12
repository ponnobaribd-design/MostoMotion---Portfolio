import React, { useState } from 'react';

export const GalleryTitle: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const text = "The Gallery";

  return (
    <h3
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="header-font text-4xl md:text-6xl font-black tracking-[0.3em] uppercase cursor-pointer select-none"
    >
      {text.split('').map((char, index) => {
        if (char === ' ') {
          return <span key={index}>&nbsp;</span>;
        }
        return (
          <span
            key={index}
            className="inline-block transition-all duration-300"
            style={{
              color: isHovered ? '#00ff9d' : '#ffffff',
              textShadow: isHovered 
                ? '0 0 12px rgba(0, 255, 157, 0.5)' 
                : 'none',
              transitionDelay: `${index * 30}ms`
            }}
          >
            {char}
          </span>
        );
      })}
    </h3>
  );
};

export default GalleryTitle;
