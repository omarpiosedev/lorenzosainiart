'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
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

    // Set initial state - words are blurred and low opacity
    gsap.set(wordElements, {
      opacity: 0.15,
      filter: 'blur(4px)',
      y: 30,
    });

    // Create scroll trigger animation basato sulla sezione, non sul testo
    const section = container.closest('[data-section="sez2"]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section || container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubDuration,
        invalidateOnRefresh: true, // Riaggiorna quando cambiano le dimensioni
        refreshPriority: -1, // Bassa priorità per evitare conflitti
        onUpdate: (self) => {
          const progress = self.progress;
          const totalWords = wordElements.length;

          wordElements.forEach((word, index) => {
            // Distribuzione che finisce prima (70% del progress totale)
            const wordRevealStart = index / totalWords * 0.4; // Punto di inizio per questa parola
            const wordRevealEnd = (index / totalWords * 0.4) + 0.3; // Punto di fine per questa parola

            let wordProgress = 0;

            if (progress < wordRevealStart) {
              // Non ancora iniziata
              wordProgress = 0;
            } else if (progress > wordRevealEnd) {
              // Completamente rivelata
              wordProgress = 1;
            } else {
              // In fase di rivelazione
              wordProgress = (progress - wordRevealStart) / (wordRevealEnd - wordRevealStart);
            }

            gsap.to(word, {
              opacity: 0.15 + (0.85 * wordProgress),
              filter: `blur(${4 * (1 - wordProgress)}px)`,
              y: 30 * (1 - wordProgress),
              duration: 0.3,
              ease,
            });
          });
        },
      },
    });

    return () => {
      if (tl) {
        tl.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === (section || container)) {
          trigger.kill();
        }
      });
    };
  }, [children, staggerDelay, duration, ease, scrubDuration]);

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
