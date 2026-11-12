import React, { useState, useRef, useEffect } from 'react';
import { parseMediaUrl, getAspectRatioClasses } from '../../lib/mediaAdapter';
import { CMSAspectRatio } from '../../types/cms';

interface SmartMediaRendererProps {
  mediaUrl: string;
  posterUrl?: string | null;
  aspectRatio?: CMSAspectRatio;
  title?: string;
  autoPlayInView?: boolean;
  isHovered?: boolean;
  className?: string;
  showControlsOnHover?: boolean;
}

export const SmartMediaRenderer: React.FC<SmartMediaRendererProps> = ({
  mediaUrl,
  posterUrl,
  aspectRatio = '16:9',
  title = 'Media Preview',
  autoPlayInView = true,
  isHovered = false,
  className = '',
  showControlsOnHover = false,
}) => {
  const [inView, setInView] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const parsed = parseMediaUrl(mediaUrl);
  const ratioClasses = getAspectRatioClasses(aspectRatio);

  // IntersectionObserver to detect when video enters/exits the viewport
  useEffect(() => {
    if (!autoPlayInView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [autoPlayInView]);

  // Video playback coordination
  useEffect(() => {
    const video = videoRef.current;
    if (!video || parsed.sourceType !== 'direct_mp4' || hasError) return;

    if (inView || isHovered) {
      video.muted = isMuted;
      video.playsInline = true;
      video.loop = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            // Expected browser autoplay policy rejection or abort on quick scroll
            if (err.name !== 'AbortError') {
              setIsPlaying(false);
            }
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, isHovered, parsed.sourceType, hasError, isMuted]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${ratioClasses} overflow-hidden bg-[#030308] select-none ${className}`}
    >
      {/* 1. Direct HTML5 MP4 / WebM */}
      {parsed.sourceType === 'direct_mp4' && !hasError && (
        <video
          ref={videoRef}
          src={parsed.rawUrl}
          poster={posterUrl || undefined}
          muted={isMuted}
          playsInline
          loop
          preload="metadata"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 will-change-transform"
        />
      )}

      {/* 2. YouTube Embed */}
      {parsed.sourceType === 'youtube' && !hasError && (
        <iframe
          src={inView || isHovered ? parsed.embedUrl : 'about:blank'}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
          className="w-full h-full border-0 pointer-events-auto"
        />
      )}

      {/* 3. Vimeo Embed */}
      {parsed.sourceType === 'vimeo' && !hasError && (
        <iframe
          src={inView || isHovered ? parsed.embedUrl : 'about:blank'}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
          className="w-full h-full border-0 pointer-events-auto"
        />
      )}

      {/* 4. Google Drive Preview */}
      {parsed.sourceType === 'google_drive' && !hasError && (
        <iframe
          src={inView || isHovered ? parsed.embedUrl : 'about:blank'}
          title={title}
          allow="autoplay"
          onError={() => setHasError(true)}
          className="w-full h-full border-0 pointer-events-auto"
        />
      )}

      {/* 5. Static Image */}
      {parsed.sourceType === 'image' && !hasError && (
        <img
          src={parsed.rawUrl}
          alt={title}
          onError={() => setHasError(true)}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}

      {/* 6. Fallback or Error Display */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-zinc-950/90 text-center space-y-2">
          {posterUrl ? (
            <img src={posterUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
          ) : null}
          <div className="relative z-10 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <i className="fas fa-triangle-exclamation text-sm"></i>
          </div>
          <p className="relative z-10 text-white/80 text-xs font-mono font-medium max-w-xs">
            External media stream restricted
          </p>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-[10px] text-[#00ff9d] hover:underline font-mono"
          >
            Open Source Link <i className="fas fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
      )}

      {/* Direct MP4 Sound Toggle Button */}
      {parsed.sourceType === 'direct_mp4' && !hasError && (isHovered || showControlsOnHover) && (
        <button
          onClick={toggleSound}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-[#00ff9d] transition-all cursor-pointer shadow-lg"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          <i className={`fas ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-xs`}></i>
        </button>
      )}

      {/* Live Badge Indicator */}
      {isPlaying && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-white/80 tracking-wider">LIVE</span>
        </div>
      )}
    </div>
  );
};

export default SmartMediaRenderer;
