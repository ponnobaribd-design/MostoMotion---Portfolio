import React, { useState, useRef, useEffect } from 'react';

// Color Stop definition for smooth real-time color syncing
interface ColorStop {
  time: number;
  color: string;
}

const VIDEO_COLORS: ColorStop[] = [
  { time: 0, color: '#00ff9d' },    // Vivid mint green (start)
  { time: 4, color: '#22d3ee' },    // Sky cyan
  { time: 8, color: '#3b82f6' },    // Studio royal blue
  { time: 13, color: '#a855f7' },   // Epic violet / purple
  { time: 18, color: '#ec4899' },   // Magenta / Pink highlight
  { time: 23, color: '#f97316' },   // Sunset microphone orange
  { time: 28, color: '#eab308' },   // Golden honey amber
  { time: 33, color: '#10b981' },   // Emerald teal
  { time: 38, color: '#00ff9d' },   // Back to mint green (perfect loop)
];

// Helper to interpolate between two colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  const pad = (str: string) => str.length === 1 ? '0' + str : str;
  return `#${pad(r.toString(16))}${pad(g.toString(16))}${pad(b.toString(16))}`;
};

// Ensure Lightness satisfies accessibility guidelines on dark background (#030308)
const ensureContrastRatio = (colorHex: string): string => {
  const hex = colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  let rNormal = r / 255;
  let gNormal = g / 255;
  let bNormal = b / 255;

  const max = Math.max(rNormal, gNormal, bNormal);
  const min = Math.min(rNormal, gNormal, bNormal);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNormal: h = (gNormal - bNormal) / d + (gNormal < bNormal ? 6 : 0); break;
      case gNormal: h = (bNormal - rNormal) / d + 2; break;
      case bNormal: h = (rNormal - gNormal) / d + 4; break;
    }
    h /= 6;
  }

  // Ensure lightness of the text is sufficiently bright against the black background
  if (l < 0.6) {
    l = 0.65;
    if (s < 0.6) s = 0.8;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const rNew = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const gNew = Math.round(hue2rgb(p, q, h) * 255);
    const bNew = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    const pad = (str: string) => str.length === 1 ? '0' + str : str;
    return `#${pad(rNew.toString(16))}${pad(gNew.toString(16))}${pad(bNew.toString(16))}`;
  }

  return colorHex;
};

// Calculate color based on playing time or simulated playback cycle
const getColorForTime = (time: number): string => {
  if (typeof time !== 'number' || isNaN(time)) {
    return VIDEO_COLORS[0].color;
  }
  const duration = 38; // Loop segment duration
  const normalizedTime = ((time % duration) + duration) % duration; // Ensure positive and within range

  let lowerStop = VIDEO_COLORS[0];
  let upperStop = VIDEO_COLORS[VIDEO_COLORS.length - 1];

  for (let i = 0; i < VIDEO_COLORS.length - 1; i++) {
    if (normalizedTime >= VIDEO_COLORS[i].time && normalizedTime <= VIDEO_COLORS[i + 1].time) {
      lowerStop = VIDEO_COLORS[i];
      upperStop = VIDEO_COLORS[i + 1];
      break;
    }
  }

  const range = upperStop.time - lowerStop.time;
  const factor = range === 0 ? 0 : (normalizedTime - lowerStop.time) / range;
  const rawColor = interpolateColor(lowerStop.color, upperStop.color, factor);
  return ensureContrastRatio(rawColor);
};

export const VideoPlayer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default
  const [volume, setVolume] = useState<number>(50); // Default volume 50%
  const [isPlaying, setIsPlaying] = useState(true);
  const simulatedTimeRef = useRef<number>(0);

  // Function to send command to YouTube iframe
  const sendPlayerCommand = (command: string, args: any = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
            args: args
          }),
          '*'
        );
      }
    } catch (e) {
      console.error('Failed to send postMessage to YouTube iframe:', e);
    }
  };

  // Toggle mute state
  const handleToggleMute = () => {
    if (isMuted) {
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [volume]);
      setIsMuted(false);
    } else {
      sendPlayerCommand('mute');
      setIsMuted(true);
    }
  };

  // Handle manual volume slider change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    sendPlayerCommand('setVolume', [newVolume]);
    if (newVolume > 0) {
      if (isMuted) {
        sendPlayerCommand('unMute');
        setIsMuted(false);
      }
    } else {
      if (!isMuted) {
        sendPlayerCommand('mute');
        setIsMuted(true);
      }
    }
  };

  // Ensure unmuted state upon load and set volume to 50%
  useEffect(() => {
    const timer = setTimeout(() => {
      sendPlayerCommand('playVideo');
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [50]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Set up actual YouTube postMessage listener & high-performance simulated timer
  useEffect(() => {
    // 1. YouTube Message Listener
    const handleMessage = (event: MessageEvent) => {
      try {
        if (!event || !event.origin || typeof event.origin !== 'string') return;
        if (!event.origin.includes('youtube.com')) return;
        
        let data: any;
        if (typeof event.data === 'string') {
          try {
            data = JSON.parse(event.data);
          } catch (e) {
            return; // Not valid JSON, safe to skip
          }
        } else if (event.data && typeof event.data === 'object') {
          data = event.data;
        } else {
          return;
        }

        // Listen to playback time and state delivery
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            simulatedTimeRef.current = data.info.currentTime;
            const updatedColor = getColorForTime(simulatedTimeRef.current);
            window.dispatchEvent(new CustomEvent('youtube-video-color', { detail: { color: updatedColor } }));
          }
          if (typeof data.info.playerState === 'number') {
            // playerState 1 = playing, 2 = paused
            setIsPlaying(data.info.playerState === 1);
          }
          if (typeof data.info.muted === 'boolean') {
            setIsMuted(data.info.muted);
          }
        }
      } catch (e) {
        // Safe to ignore non-JSON or malformed messages
      }
    };

    window.addEventListener('message', handleMessage);

    // 2. High-performance precise animation frame fallback to guarantee 60fps color updates
    let lastTime = performance.now();
    let animationFrameId: number;

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        simulatedTimeRef.current = (simulatedTimeRef.current + delta) % 38;
        const activeColor = getColorForTime(simulatedTimeRef.current);
        window.dispatchEvent(new CustomEvent('youtube-video-color', { detail: { color: activeColor } }));
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('message', handleMessage);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="w-full max-w-5xl px-2 sm:px-4 my-6 sm:my-8 mx-auto flex flex-col sm:flex-row items-center sm:items-stretch gap-4 md:gap-6 relative group">
      {/* Player Container */}
      <div className="w-full sm:flex-1 relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
        <iframe
          ref={iframeRef}
          id="showreel-iframe"
          src="https://www.youtube.com/embed/WSueOjXq38s?autoplay=1&mute=0&loop=1&playlist=WSueOjXq38s&controls=1&showinfo=0&rel=0&vq=hd1080&enablejsapi=1"
          title="MostoMotion Showreel"
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* Desktop Vertical Volume Control */}
      <div className="hidden sm:flex flex-col justify-between items-center py-6 px-2 md:px-4 bg-black/40 backdrop-blur-md border border-[#00ff9d]/30 rounded-[2rem] shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:border-[#00ff9d] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-all duration-300 w-14 md:w-20 select-none">
        {/* VOL Label */}
        <span className="header-font text-[9px] font-bold text-[#00ff9d]/70 tracking-widest uppercase rotate-180 [writing-mode:vertical-lr] drop-shadow-[0_0_3px_rgba(0,255,157,0.3)]">
          VOLUME
        </span>

        {/* Vertical Volume Slider Container */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 relative h-full w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="vertical-range accent-[#00ff9d] cursor-pointer"
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
              width: '12px',
              height: '100%',
              minHeight: '120px',
              maxHeight: '180px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              outline: 'none',
              filter: 'drop-shadow(0 0 8px rgba(0,255,157,0.6))',
            }}
          />
          <span className="mt-3 text-[10px] font-mono font-bold text-[#00ff9d] tracking-tighter drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]">
            {volume}%
          </span>
        </div>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 hover:scale-110 active:scale-95
            ${isMuted 
              ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:bg-red-500/20' 
              : 'border-[#00ff9d] text-[#00ff9d] bg-[#00ff9d]/10 shadow-[0_0_15px_rgba(0,255,157,0.5)] hover:bg-[#00ff9d]/20'}`}
          title={isMuted ? "Unmute" : "Mute"}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <i className="fas fa-volume-mute text-sm"></i>
          ) : (
            <i className="fas fa-volume-up text-sm animate-pulse"></i>
          )}
        </button>
      </div>

      {/* Mobile Horizontal Volume & Mute Bar */}
      <div className="flex sm:hidden items-center justify-between gap-4 px-6 py-3 bg-black/60 backdrop-blur-md border border-[#00ff9d]/30 rounded-2xl w-full select-none shadow-[0_0_15px_rgba(0,255,157,0.2)]">
        <button
          onClick={handleToggleMute}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all
            ${isMuted 
              ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
              : 'border-[#00ff9d] text-[#00ff9d] bg-[#00ff9d]/10 shadow-[0_0_10px_rgba(0,255,157,0.4)]'}`}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <i className="fas fa-volume-mute text-xs"></i> : <i className="fas fa-volume-up text-xs"></i>}
        </button>
        <span className="header-font text-[9px] font-bold text-[#00ff9d]/70 uppercase tracking-widest">
          VOL
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="flex-1 accent-[#00ff9d] cursor-pointer h-1.5 bg-white/10 rounded-full"
        />
        <span className="text-[10px] font-mono font-bold text-[#00ff9d] w-8 text-right">
          {volume}%
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
