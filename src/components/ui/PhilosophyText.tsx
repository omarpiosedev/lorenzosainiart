'use client';

import { useEffect, useRef, useState } from 'react';

export default function PhilosophyText() {
  const [isFixed, setIsFixed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const section = containerRef.current.closest('[data-section="sez2"]');
        if (section) {
          const rect = section.getBoundingClientRect();
          const shouldBeFixed = rect.top <= 0 && rect.bottom > window.innerHeight;
          setIsFixed(shouldBeFixed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center px-4 gap-8 z-10"
      style={{
        position: isFixed ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    >
      {/* Philosophy badge */}
      <div className="bg-black/5 backdrop-blur-sm text-black rounded-full border border-black/10 inline-flex items-center justify-center" style={{ padding: '8px 16px' }}>
        <span className="text-base font-medium">Philosophy</span>
      </div>

      {/* Main text */}
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-2xl md:text-3xl lg:text-4xl leading-tight text-black tracking-wide font-semibold"
          style={{
            fontFamily: 'Effloresce It, sans-serif',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          Every frame is a canvas, and every moment holds infinite stories waiting to be told. I seek the beauty hidden in the ordinary, weaving creativity, design, and emotion into visuals that breathe life and meaning. My work is about touching hearts, sparking imagination, and turning fleeting instants into timeless art.
        </p>
      </div>
    </div>
  );
}
