import React, { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // px per second
  className?: string;
}

const MarqueeAnnouncement: React.FC<MarqueeProps> = ({ children, speed = 60, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (container && text) {
      if (text.scrollWidth > container.offsetWidth) {
        setShouldScroll(true);
        setAnimationDuration((text.scrollWidth + container.offsetWidth) / speed);
      } else {
        setShouldScroll(false);
      }
    }
  }, [children, speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative w-full ${className || ''}`}
      style={{ minHeight: '1.5rem' }}
    >
      <div
        ref={textRef}
        className={shouldScroll ? 'absolute left-0 top-0' : ''}
        style={
          shouldScroll
            ? {
                whiteSpace: 'nowrap',
                animation: `marquee ${animationDuration}s linear infinite`,
                willChange: 'transform',
              }
            : { whiteSpace: 'nowrap' }
        }
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeAnnouncement;
