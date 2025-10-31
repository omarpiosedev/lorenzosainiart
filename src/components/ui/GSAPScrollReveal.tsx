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

      // PERFORMANCE OPTIMIZATION (Context7 best practices):
      // 1. Add will-change hint to browser BEFORE animation
      // 2. Use force3D for GPU acceleration
      // 3. Set initial state with optimized properties
      gsap.set(wordElements, {
        opacity: 0.15,
        filter: 'blur(4px)',
        y: 30,
        force3D: true, // GPU acceleration
        willChange: 'transform, opacity, filter', // Browser optimization hint
      });

      // Create scroll trigger animation basato sulla sezione, non sul testo
      const section = container.closest('[data-section="philosophy-gallery"]');
      gsap.timeline({
        scrollTrigger: {
          trigger: section || container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrubDuration,
          invalidateOnRefresh: true,
          refreshPriority: -1, // Bassa priorità per evitare conflitti con pin
          onUpdate: (self) => {
            const progress = self.progress;
            const totalWords = wordElements.length;

            // PERFORMANCE OPTIMIZATION (Context7 best practice):
            // Use gsap.set() instead of gsap.to() in onUpdate for better performance
            // gsap.set() applies changes immediately without creating new tweens
            wordElements.forEach((word, index) => {
            // Distribuzione che finisce prima (70% del progress totale)
              const wordRevealStart = (index / totalWords) * 0.4;
              const wordRevealEnd = (index / totalWords) * 0.4 + 0.3;

              let wordProgress = 0;

              if (progress < wordRevealStart) {
                wordProgress = 0;
              } else if (progress > wordRevealEnd) {
                wordProgress = 1;
              } else {
                wordProgress = (progress - wordRevealStart) / (wordRevealEnd - wordRevealStart);
              }

              // Use gsap.set() for instant updates (no tween creation overhead)
              gsap.set(word, {
                opacity: 0.15 + 0.85 * wordProgress,
                filter: `blur(${4 * (1 - wordProgress)}px)`,
                y: 30 * (1 - wordProgress),
                force3D: true, // Maintain GPU acceleration
              });
            });
          },
        },
        onComplete: () => {
          // Remove will-change after animation completes to free resources
          gsap.set(wordElements, { willChange: 'auto' });
        },
      });
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
