'use client';

import { useEffect, useRef, useState } from 'react';

export default function Sez2() {
  const [showFixedText, setShowFixedText] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Only switch to fixed when we're scrolling inside the section
        const shouldBeFixed = rect.top < 0 && rect.bottom > window.innerHeight;
        setShowFixedText(shouldBeFixed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div ref={sectionRef} className="relative bg-white" style={{ height: '200vh' }}>
      {/* Top fade gradient for mobile */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-16 pointer-events-none z-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 80%, white 100%)',
          }}
        />
      </div>

      {/* Fixed background text content */}
      <div
        className={`${showFixedText ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-screen flex flex-col items-center justify-center px-4 gap-8 z-10 transition-none`}
        style={{
          transform: showFixedText ? 'translateY(0)' : 'translateY(0)',
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

      {/* Content area for scrolling images */}
      <div className="absolute inset-0 z-20">
        {/* Le immagini che scorrano andranno qui */}
      </div>
    </div>
  );
}
