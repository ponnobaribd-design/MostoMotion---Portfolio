import React, { useEffect, useRef, useState } from 'react';
import { playInteractionSound } from '../audio';

// STYLING SPECIFICATION: REPLACE THIS PLACEHOLDER STRING TO USE A CUSTOM PNG/SVG IMAGE FOR THE REVERSED PEN IF DESIRED.
// BY DEFAULT, WE IMPLEMENT A FLUSH, FUTURISTIC HIGH-TECH VECTOR SVG PEN ALIGNED PERFECTLY.
const REVERSED_PEN_IMAGE_URL: string | null = null; // e.g. 'https://example.com/reversed_pen.png'

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const penRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const lastHoveredElRef = useRef<Element | null>(null);

  // Position history for the trail containing millisecond timestamps
  const trailPoints = useRef<{ x: number; y: number; createdAt: number }[]>([]);
  const lastMouseMoveTimeRef = useRef<number>(Date.now());
  const ripplesRef = useRef<{ x: number; y: number; progress: number; maxRadius: number; hue: number }[]>([]);

  useEffect(() => {
    // Detect if device supports precision pointers
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      penRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTimeRef.current = Date.now();
      
      const lastPoint = trailPoints.current[0];
      const dist = lastPoint ? Math.hypot(e.clientX - lastPoint.x, e.clientY - lastPoint.y) : 999;

      // Add a point if the mouse has moved at least 3px or if trail is completely empty
      if (dist > 3) {
        trailPoints.current.unshift({ x: e.clientX, y: e.clientY, createdAt: Date.now() });
      } else {
        // Just keep updating head if slight jitter/minor movement to keep it perfectly aligned with pen point
        if (trailPoints.current.length > 0) {
          trailPoints.current[0].x = e.clientX;
          trailPoints.current[0].y = e.clientY;
        }
      }

      // Detect hover over native clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickableEl = 
          target.closest('a') || 
          target.closest('button') || 
          target.closest('.cursor-pointer') ||
          target.closest('[role="button"]') ||
          target.closest('.service-card') || 
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.portfolio-card-trigger');
        
        const isClickable = !!clickableEl;

        // Play short click whenever a new interactive element is entered
        if (isClickable && lastHoveredElRef.current !== clickableEl) {
          playInteractionSound();
        }
        lastHoveredElRef.current = clickableEl;
        setIsHoveringClickable(isClickable);
      } else {
        lastHoveredElRef.current = null;
        setIsHoveringClickable(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      let isClickable = false;
      if (target) {
        const clickableEl = 
          target.closest('a') || 
          target.closest('button') || 
          target.closest('.cursor-pointer') ||
          target.closest('[role="button"]') ||
          target.closest('.service-card') || 
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.portfolio-card-trigger');
        isClickable = !!clickableEl;
      }
      
      const maxRadius = isClickable ? 75 : 45;
      const currentHue = (Date.now() / 15) % 360;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        progress: 0,
        maxRadius,
        hue: currentHue
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isPointerFine]);

  useEffect(() => {
    if (!isPointerFine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();

      // 1. Update and draw click visual shockwaves/ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.progress += 0.055; // expansion animation speed
        
        if (r.progress >= 1.0) {
          ripples.splice(i, 1);
          continue;
        }

        const opacity = 1 - r.progress;
        const radius = r.maxRadius * Math.sin(r.progress * Math.PI / 2); // elastic expand effect

        ctx.save();
        // Inner Glowing Shockwave ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue}, 100%, 65%, ${opacity * 0.9})`;
        ctx.lineWidth = 4 * (1 - r.progress);
        ctx.shadowBlur = 16 * opacity;
        ctx.shadowColor = `hsl(${r.hue}, 100%, 65%)`;
        ctx.stroke();

        // Secondary Outer light thin shockwave ring for elite premium feel
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * 1.25, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(r.hue + 45) % 360}, 100%, 70%, ${opacity * 0.35})`;
        ctx.lineWidth = 1.2 * (1 - r.progress);
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
      }

      const idleTime = now - lastMouseMoveTimeRef.current;
      const idleFade = Math.max(0, 1 - (idleTime / 500)); // Disappear after 0.5 seconds of no cursor movement

      if (idleFade > 0) {
        // Keep trail points only if they are less than 1000ms old
        trailPoints.current = trailPoints.current.filter(p => now - p.createdAt < 1000);

        const points = trailPoints.current;
        if (points.length >= 2) {
          // Calculate active points for the tail (roughly 2 inches, i.e. ~192px on screen standard display)
          let cumulativeDist = 0;
          const maxDistance = 192; // roughly 2 inches @ 96 PPI
          let truncatedPointsCount = points.length;
          for (let i = 1; i < points.length; i++) {
            cumulativeDist += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
            if (cumulativeDist > maxDistance) {
              truncatedPointsCount = i + 1; // include current segment smoothly
              break;
            }
          }
          const activePoints = points.slice(0, truncatedPointsCount);

          if (activePoints.length >= 2) {
            const baseHue = (now / 15) % 360; // dynamic base hue shifts continuously over time

            // Draw the segments sequentially with incremental taper and age fade
            for (let i = 1; i < activePoints.length; i++) {
              const p1 = activePoints[i - 1];
              const p2 = activePoints[i];
              
              // Taper factor: 1 at the head (cursor) slowly down to 0 at the tail end
              const taperFactor = 1 - (i / activePoints.length);
              const opacity = 0.85 * taperFactor * idleFade;

              if (opacity > 0) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                // Continuous gradient effect shifting through various hues
                const segmentHue = (baseHue + (i * 10)) % 360;
                ctx.strokeStyle = `hsla(${segmentHue}, 100%, 60%, ${opacity})`;
                
                // Farthest end is tapered down incrementally, becoming very thin
                ctx.lineWidth = Math.max(0.1, (isHoveringClickable ? 3.0 : 2.0) * Math.pow(taperFactor, 1.4));
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Neon Glow shadow configuration matching the dynamic segment color
                ctx.shadowBlur = ((isHoveringClickable ? 10 : 5) + 2) * taperFactor;
                ctx.shadowColor = `hsl(${segmentHue}, 100%, 60%)`;

                ctx.stroke();
                ctx.shadowBlur = 0; // Reset Shadow settings for safety
              }
            }

            // Draw extra aesthetic small floating nodes to provide rich depth, scaled down for the tail
            for (let i = 0; i < activePoints.length; i += 2) {
              const pt = activePoints[i];
              const pct = 1 - i / activePoints.length;
              if (pct <= 0.1) continue;

              ctx.beginPath();
              ctx.arc(pt.x + Math.sin(now/180 + i)*1.5, pt.y + Math.cos(now/180 + i)*1.5, pct * 1.5, 0, Math.PI * 2);
              
              const nodeOpacity = pct * 0.75 * idleFade;
              const nodeHue = (baseHue + (i * 10)) % 360;
              ctx.fillStyle = `hsla(${nodeHue}, 100%, 60%, ${nodeOpacity})`;
              ctx.shadowBlur = 4 * pct;
              ctx.shadowColor = `hsl(${nodeHue}, 100%, 60%)`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      animId = requestAnimationFrame(drawTrail);
    };

    drawTrail();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [isPointerFine, isHoveringClickable]);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (!isPointerFine) return;
    let frameId: number;
    const updateCursorDOM = () => {
      setCursorPos(penRef.current);
      frameId = requestAnimationFrame(updateCursorDOM);
    };
    updateCursorDOM();
    return () => cancelAnimationFrame(frameId);
  }, [isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <>
      {/* Universal CSS to eliminate default native cursor style seamlessly */}
      <style>{`
        @media (pointer: fine) {
          html, body, a, button, [role="button"], input, textarea, select, iframe {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Trailing Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[99998]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Sleek Vector Drawing Pen Nib */}
      <div
        className="fixed pointer-events-none z-[99999] transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          // Tip of the drawing pen is exactly at relative 0,0! No shift translate offset makes it the natural clicking hotspot.
          transform: isHoveringClickable ? 'scale(1.2) rotate(-8deg)' : 'scale(1.0)',
          transformOrigin: '0px 0px', // Anchor transformation from the exact pen Tip hotspot at Relative 0,0
          filter: isHoveringClickable 
            ? 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.95)) drop-shadow(0 0 4px #ffffff)' 
            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.65))',
        }}
      >
        {REVERSED_PEN_IMAGE_URL ? (
          <img 
            src={REVERSED_PEN_IMAGE_URL} 
            alt="Stylus Pen" 
            className="w-8 h-8"
            style={{ transform: 'translate(0px, 0px)' }}
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reversed-pen-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bd00ff" /> {/* Purple on body */}
                <stop offset="100%" stopColor="#00d4ff" /> {/* Cyan towards the tip */}
              </linearGradient>
            </defs>
            {/* 
              This premium SVG draws visually starting from upper-right down to the exact bottom-left tip at coordinate (0, 0).
              Tip of the stylus is precisely positioned at (0, 0) of the view box.
            */}
            <path 
              d="M0 0 L4 9 L23 28 C24.5 29.5 27 29.5 28.5 28 L29 27.5 C30.5 26 30.5 23.5 29 22 L9 4 Z" 
              fill="url(#reversed-pen-grad)" 
              stroke="#ffffff" 
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Core laser circuit design lines within the stylus pen body */}
            <line x1="0" y1="0" x2="11" y2="11" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Electronic status indicator circle closely hugging the tip */}
            <circle 
              cx="7" 
              cy="7" 
              r="1.8" 
              fill={isHoveringClickable ? '#ffffff' : '#00d4ff'} 
              stroke={isHoveringClickable ? '#00d4ff' : '#bd00ff'} 
              strokeWidth="1.0" 
            />
          </svg>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
