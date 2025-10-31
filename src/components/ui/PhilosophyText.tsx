'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import GSAPScrollReveal from '@/components/ui/GSAPScrollReveal';

// Register GSAP plugins (best practice: register once at module level)
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PhilosophyText() {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP/React best practice: useGSAP hook with ScrollTrigger
  // Pin text at viewport center when section reaches top, unpin when section exits
  // This recreates original working logic: fixed while section is in viewport
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Find parent section (data-section="sez2" from PhilosophyGallerySection)
      const section = containerRef.current.closest('[data-section="philosophy-gallery"]');
      if (!section) {
        return;
      }

      // Pin text when section enters viewport, unpin when it exits
      // Original logic: rect.top <= 0 && rect.bottom > window.innerHeight
      // ScrollTrigger equivalent: pin from section top to section bottom
      ScrollTrigger.create({
        trigger: section, // Trigger based on section position
        start: 'top top', // Pin when section top reaches viewport top
        end: 'bottom bottom', // Unpin when section bottom exits viewport
        pin: containerRef.current, // Pin this text element
        pinSpacing: false, // Don't add spacing (section handles layout)
        invalidateOnRefresh: true,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center px-4 gap-8 z-10"
      style={{
        position: 'absolute',
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
      <div
        className="bg-white/90 text-black rounded-full border border-black/10 inline-flex items-center justify-center"
        style={{ padding: '8px 16px' }}
      >
        <span className="text-base font-medium">Philosophy</span>
      </div>

      {/* Main text with GSAP ScrollReveal animation */}
      <div className="max-w-4xl mx-auto text-center">
        <GSAPScrollReveal
          className="text-2xl md:text-3xl lg:text-4xl leading-tight text-black tracking-wide font-semibold"
          staggerDelay={0.08}
          duration={1.5}
          ease="power1.out"
          scrubDuration={3}
        >
          Every frame is a canvas, and every moment holds infinite stories waiting to be told. I seek the beauty hidden in the ordinary, weaving creativity, design, and emotion into visuals that breathe life and meaning. My work is about touching hearts, sparking imagination, and turning fleeting instants into timeless art.
        </GSAPScrollReveal>
      </div>
    </div>
  );
}
