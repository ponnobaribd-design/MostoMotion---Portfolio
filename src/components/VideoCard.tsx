import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GalleryMediaItem } from '../types/gallery';

interface VideoCardProps {
  item: GalleryMediaItem;
  onOpenModal?: (item: GalleryMediaItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ item, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVertical = item.orientation === 'vertical' || item.aspectRatio === '9:16';

  // Ensure autoplay starts reliably and loops cleanly
  useEffect(() => {
    const video = videoRef.current;
    if (video && item.videoUrl && !hasVideoError) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('[VideoCard Autoplay prevented or failed]:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [item.videoUrl, hasVideoError]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Cyber-cinematic border color depending on category
  const getAccentColor = () => {
    switch (item.category) {
      case 'Motion Graphics':
        return { border: 'rgba(0, 255, 157, 0.45)', shadow: 'rgba(0, 255, 157, 0.35)', badge: '#00ff9d' };
      case 'Video Editing':
        return { border: 'rgba(34, 211, 238, 0.45)', shadow: 'rgba(34, 211, 238, 0.35)', badge: '#22d3ee' };
      case 'Graphic Design':
        return { border: 'rgba(168, 85, 247, 0.45)', shadow: 'rgba(168, 85, 247, 0.35)', badge: '#a855f7' };
      default:
        return { border: 'rgba(0, 255, 157, 0.45)', shadow: 'rgba(0, 255, 157, 0.35)', badge: '#00ff9d' };
    }
  };

  const accent = getAccentColor();

  return (
    <div
      className={`relative w-full group ${
        isVertical ? 'aspect-[9/16] max-w-[320px] mx-auto' : 'aspect-video'
      }`}
      style={{ zIndex: isHovered ? 40 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        The outer container keeps the exact grid cell dimensions.
        The inner motion.div handles the aspect-ratio aware dynamic hover pop-up without shifting the grid.
      */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass border cursor-pointer select-none"
        initial={false}
        animate={{
          scale: isHovered ? 1.06 : 1,
          scaleX: isHovered ? (isVertical ? 1.04 : 1.08) : 1,
          scaleY: isHovered ? (isVertical ? 1.09 : 1.04) : 1,
          y: isHovered ? -6 : 0,
          borderColor: isHovered ? accent.border : 'rgba(255, 255, 255, 0.08)',
          boxShadow: isHovered
            ? `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px 2px ${accent.shadow}`
            : '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 24,
        }}
        onClick={() => onOpenModal && onOpenModal(item)}
      >
        {/* Media Surface: Autoplay Video or High-Res Graphic */}
        <div className="relative w-full h-full bg-[#030308] overflow-hidden flex items-center justify-center">
          {item.videoUrl && !hasVideoError ? (
            <video
              ref={videoRef}
              src={item.videoUrl}
              poster={item.thumbnail}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setHasVideoError(true)}
              className="w-full h-full object-cover will-change-transform"
            />
          ) : (
            <img
              src={item.thumbnail}
              alt={item.title}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              loading="lazy"
            />
          )}

          {/* Futuristic subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/40 pointer-events-none" />

          {/* Top Badges Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            {/* Aspect Ratio & Format Indicator */}
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: accent.badge,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {isVertical ? '9:16 Vertical Reel' : '16:9 Widescreen'}
            </span>

            {/* Live Autoplay Indicator / Audio toggle */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {item.videoUrl && (
                <button
                  onClick={toggleSound}
                  className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-[#00ff9d] transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
                >
                  <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-high'} text-[10px]`}></i>
                </button>
              )}

              {isPlaying && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10"
                  title="Auto-playing live preview"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
                  <span className="text-[8px] font-mono font-bold text-white/70 uppercase tracking-widest">
                    LIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Center Play Button on Hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-15 pointer-events-none transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-transform duration-300 transform group-hover:scale-110"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                borderColor: accent.badge,
                boxShadow: `0 0 20px ${accent.shadow}`,
              }}
            >
              <i className="fas fa-play text-sm text-white ml-0.5"></i>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-20 bg-gradient-to-t from-[#020205] via-[#020205]/90 to-transparent flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[9px] font-bold tracking-widest uppercase text-white/50">
                {item.subCategory}
              </span>
              {item.client && (
                <>
                  <span className="text-white/20 text-[10px]">•</span>
                  <span className="text-[9px] font-medium tracking-wide text-white/70">
                    {item.client}
                  </span>
                </>
              )}
            </div>

            <h4
              className="header-font text-sm md:text-base font-bold text-white tracking-wide line-clamp-2 transition-colors duration-300"
              style={{ color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)' }}
            >
              {item.title}
            </h4>

            {/* Revealed on hover: Tags & Performance Metrics */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0.85,
                height: isHovered ? 'auto' : 'auto',
              }}
              className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]"
            >
              <span className="font-mono text-[#00ff9d] font-semibold drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]">
                {item.metrics || item.year || 'Showcase'}
              </span>

              <span className="text-white/50 group-hover:text-white flex items-center gap-1 font-mono tracking-wider transition-colors">
                DETAILS <i className="fas fa-arrow-up-right-from-square text-[9px]"></i>
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default VideoCard;
