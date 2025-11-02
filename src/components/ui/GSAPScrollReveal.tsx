'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// Register GSAP plugins at module level (best practice)
gsap.registerPlugin(useGSAP, ScrollTrigger);

type GSAPScrollRevealProps = {
  children: string;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  ease?: string;
  scrubDuration?: number;
};

export default function GSAPScrollReveal({
  children,
  className = '',
  staggerDelay = 0.05,
  duration = 1.2,
  ease = 'power1.out',
  scrubDuration = 2,
}: GSAPScrollRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  // React 19.2 + GSAP best practice: useGSAP hook instead of useEffect
  // Automatic cleanup, scoped queries, React Compiler compatible
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;

      // Split text into words and wrap each in a span
      const words = children.split(' ');
      container.innerHTML = words
        .map((word, index) => `<span class="word" data-index="${index}">${word}</span>`)
        .join(' ');

      const wordElements = container.querySelectorAll('.word');
      const totalWords = wordElements.length;

      // PERFORMANCE OPTIMIZATION (Context7 best practices):
      // Set initial state - will-change added only during animation
      gsap.set(wordElements, {
        opacity: 0.15,
        filter: 'blur(4px)',
        y: 30,
        force3D: true, // GPU acceleration
      });

      // Create scroll trigger animation basato sulla sezione, non sul testo
      const section = container.closest('[data-section="philosophy-gallery"]');

      // ✅ OPTIMIZED: Timeline with balanced timing
      // Context7 best practice: Let GSAP handle interpolation automatically
      // This eliminates 50+ gsap.set() calls per frame
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section || container,
          start: 'top top',
          end: 'top+=50%', // ✅ Animation completes in first 50% of section scroll (balanced)
          scrub: 0.8, // ✅ Moderate smoothing for smooth but responsive feel
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onEnter: () => {
            // Add will-change only when animation starts
            gsap.set(wordElements, { willChange: 'transform, opacity, filter' });
          },
          onLeave: () => {
            // Remove will-change when animation completes to free resources
            gsap.set(wordElements, { willChange: 'auto' });
          },
          onEnterBack: () => {
            gsap.set(wordElements, { willChange: 'transform, opacity, filter' });
          },
          onLeaveBack: () => {
            gsap.set(wordElements, { willChange: 'auto' });
          },
        },
      });

      // ✅ TIMING BALANCED: Smooth progressive reveal
      // Words reveal progressively: complete by ~35% of the 50% scroll range
      // Each word duration: 12% of timeline (0.12 in timeline units)
      // Stagger: spread across 23% of timeline (0.23 in timeline units)
      const staggerAmount = totalWords > 1 ? 0.23 / (totalWords - 1) : 0;

      tl.to(
        wordElements,
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.12, // Balanced duration for smooth reveal
          ease,
          stagger: staggerAmount, // Progressive reveal completes around 35%
          force3D: true,
        },
        0, // Start at timeline position 0
      );

    // No cleanup needed - useGSAP handles it automatically
    },
    {
      dependencies: [children, staggerDelay, duration, ease, scrubDuration],
      scope: containerRef,
    },
  );

  return (
    <p
      ref={containerRef}
      className={className}
      style={{
        fontFamily: 'Effloresce It, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    />
  );
}
