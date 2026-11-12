import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  forceVisible?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delayMs = 0, forceVisible = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can unobserve if we only want reveal once
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: 0.1, // trigger when 10% is visible
        rootMargin: '0px 0px -50px 0px' // offset so it doesn't trigger completely instantly at the absolute edge
      }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [forceVisible]);

  const activeVisible = forceVisible || isVisible;

  return (
    <div
      ref={domRef}
      className={`${className}`}
      style={{
        opacity: activeVisible ? 1 : 0,
        transform: activeVisible ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 32px, 0) scale(0.985)',
        transition: `opacity 1300ms cubic-bezier(0.16, 1, 0.3, 1), transform 1300ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delayMs}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
