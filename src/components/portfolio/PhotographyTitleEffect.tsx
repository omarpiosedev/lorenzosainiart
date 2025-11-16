'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

type PhotographyTitleEffectProps = {
  words: string;
  className?: string;
  style?: React.CSSProperties;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
  isActive: boolean; // Control when animation triggers
};

export function PhotographyTitleEffect({
  words,
  className = '',
  style,
  filter = true,
  duration = 0.8,
  staggerDelay = 0.1,
  isActive,
}: PhotographyTitleEffectProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const wordsArray = words.split(' ');

  // GSAP animation using useGSAP hook with isActive dependency
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const spans = containerRef.current.querySelectorAll('.text-span');

      if (!isActive) {
        // Reset to hidden when not active
        gsap.to(spans, {
          opacity: 0,
          filter: filter ? 'blur(10px)' : 'none',
          duration: 0.2,
          ease: 'power2.out',
        });
        return;
      }

      // Animate in when active
      gsap.fromTo(
        spans,
        {
          opacity: 0,
          filter: filter ? 'blur(10px)' : 'none',
        },
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
          duration,
          stagger: staggerDelay,
          ease: 'power2.out',
        },
      );
    },
    { scope: containerRef, dependencies: [isActive, duration, filter, staggerDelay] },
  );

  return (
    <h2 ref={containerRef} className={`${className} text-wrap-balanced heading-compact`} style={style}>
      {wordsArray.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="text-span inline-block opacity-0"
          style={{
            filter: filter ? 'blur(10px)' : 'none',
          }}
        >
          {word}
          {idx < wordsArray.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </h2>
  );
}
