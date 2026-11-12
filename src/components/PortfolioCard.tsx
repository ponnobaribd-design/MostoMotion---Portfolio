import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      // Small 250ms delay before loading the iframe to optimize scroll performance 
      // and prevent loading if a user is just quickly moving their cursor past
      timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, 250);
    } else {
      setShouldLoadVideo(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  // Modern glow indicators matching electric cyan/purple aesthetics
  const neonCyan = '#00d4ff';
  const neonPurple = '#bd00ff';

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col gap-3 group relative"
    >
      {/* Title with hover neon illumination */}
      <h4 
        className="header-font text-lg md:text-xl font-black tracking-[0.15em] uppercase px-2 transition-all duration-500"
        style={{
          color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
          textShadow: isHovered ? `0 0 15px rgba(0, 212, 255, 0.8), 0 0 5px rgba(189, 0, 255, 0.6)` : 'none',
        }}
      >
        {item.title}
      </h4>

      {/* Main card panel */}
      <div 
        className="flex flex-col glass border rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl relative"
        style={{
          borderColor: isHovered ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 255, 255, 0.05)',
          boxShadow: isHovered ? `0 15px 45px rgba(0, 212, 255, 0.25), 0 0 25px rgba(189, 0, 255, 0.15)` : 'none',
          backgroundColor: isHovered ? 'rgba(5, 3, 10, 0.95)' : 'rgba(255, 255, 255, 0.01)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Core Media Display Workspace */}
        <div className="w-full aspect-video overflow-hidden relative">
          {/* Static Image with elegant zoom & fade/grayscale on active state */}
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-all duration-700 ease-out z-10" 
            style={{
              filter: isHovered ? 'grayscale(0%) blur(4px)' : 'grayscale(100%)',
              opacity: isHovered ? 0.3 : 0.6,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />

          {/* Looping Silent Video Stream Overlay */}
          {shouldLoadVideo && item.youtubeId && (
            <div className="absolute inset-0 w-full h-full z-20 animate-fade-in pointer-events-none">
              <iframe
                title={`Looping preview of ${item.title}`}
                className="w-full h-full" 
                src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&enablejsapi=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          )}

          {/* High-tech overlay vignetting to soften borders */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-[#030308]/50 z-25 pointer-events-none" />

          {/* Glowing Category Badge */}
          <div className="absolute top-4 right-4 z-30">
            <span 
              className="glass px-3 py-1 rounded-full text-[8.5px] font-bold tracking-widest uppercase transition-all duration-500"
              style={{
                color: isHovered ? '#ffffff' : '#00d4ff',
                borderColor: isHovered ? `${neonCyan}` : 'rgba(255,255,255,0.1)',
                boxShadow: isHovered ? `0 0 15px ${neonCyan}` : 'none',
              }}
            >
              {item.category}
            </span>
          </div>

          {/* Glowing futuristic layout target sight circles in corners */}
          {isHovered && (
            <>
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#00d4ff]/60 z-30 animate-pulse" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#00d4ff]/60 z-30 animate-pulse" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#00d4ff]/60 z-30 animate-pulse" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#00d4ff]/60 z-30 animate-pulse" />
            </>
          )}
        </div>

        {/* Call to action button footer area */}
        <div className="h-16 flex items-center justify-center bg-white/[0.01] z-30 relative">
          <a 
            href={`https://www.youtube.com/watch?v=${item.youtubeId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-btn flex items-center justify-center gap-3 text-[10px] font-bold py-2.5 px-8 rounded-full transition-all duration-300 hover:scale-105 uppercase tracking-widest border border-white/5"
            style={{
              borderColor: isHovered ? `${neonCyan}50` : 'rgba(255,255,255,0.05)',
              boxShadow: isHovered ? `0 0 15px ${neonCyan}30` : 'none',
              color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.8)',
            }}
          >
            <i 
              className="fas fa-play text-[9px] transition-transform duration-300"
              style={{
                color: isHovered ? neonCyan : 'inherit',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
              }}
            />{' '}
            VIEW FULL VIDEO
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PortfolioCard;
