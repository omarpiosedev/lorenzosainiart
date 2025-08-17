'use client';

import { useEffect, useRef, useState } from 'react';

export default function PhilosophyText() {
  const [isFixed, setIsFixed] = useState(false);
  const [phantomHeight, setPhantomHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const phantomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const section = containerRef.current.closest('[data-section="sez2"]');
        if (section) {
          const rect = section.getBoundingClientRect();
          const shouldBeFixed = rect.top <= 0 && rect.bottom > window.innerHeight;

          // Calcola l'altezza del phantom prima del cambio di stato
          if (!isFixed && shouldBeFixed && containerRef.current) {
            const height = containerRef.current.offsetHeight;
            setPhantomHeight(height);
          }

          setIsFixed(shouldBeFixed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  return (
    <>
      {/* Phantom element - mantiene lo spazio nel layout quando il testo diventa fixed */}
      <div
        ref={phantomRef}
        style={{
          height: isFixed ? `${phantomHeight}px` : '0px',
          visibility: 'hidden',
          transition: 'height 0.15s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Contenuto principale */}
      <div
        ref={containerRef}
        className={`${isFixed ? 'fixed inset-0' : 'absolute top-0 left-0 right-0 h-screen'} flex flex-col items-center justify-center px-4 gap-8 z-10 transition-all duration-150 ease-out`}
        style={{
          willChange: isFixed ? 'transform' : 'auto',
        }}
      >
        {/* Philosophy badge */}
        <div className="bg-black/5 backdrop-blur-sm text-black rounded-full border border-black/10 inline-flex items-center justify-center" style={{ padding: '8px 16px' }}>
          <span className="text-base font-medium">Philosophy</span>
        </div>

        {/* Main text */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl leading-tight text-black tracking-wide font-semibold" style={{ fontFamily: 'Effloresce It, sans-serif' }}>
            Every frame is a canvas, and every moment holds infinite stories waiting to be told. I seek the beauty hidden in the ordinary, weaving creativity, design, and emotion into visuals that breathe life and meaning. My work is about touching hearts, sparking imagination, and turning fleeting instants into timeless art.
          </p>
        </div>
      </div>
    </>
  );
}
