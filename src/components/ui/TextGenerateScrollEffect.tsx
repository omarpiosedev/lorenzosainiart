'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// Register GSAP plugins (best practice: register once at module level)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type TextGenerateScrollEffectProps = {
  /**
   * The text content to animate
   */
  words: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Enable blur effect (default: true)
   */
  filter?: boolean;
  /**
   * Animation duration per element (default: 0.5)
   */
  duration?: number;
  /**
   * Stagger delay between elements (default: 0.2)
   */
  staggerDelay?: number;
  /**
   * Animate by 'word' or 'letter' (default: 'word')
   */
  animateBy?: 'word' | 'letter';
  /**
   * ScrollTrigger start position (default: 'top 80%')
   * Examples: 'top top', 'top center', 'top 80%'
   */
  scrollTriggerStart?: string;
  /**
   * ScrollTrigger end position (default: 'top 50%')
   * Examples: 'bottom bottom', 'top 20%'
   */
  scrollTriggerEnd?: string;
  /**
   * Enable scrub for scroll-linked animation (default: false)
   * If true, animation progress is tied to scroll position
   * If number, adds smooth delay (e.g., 1 = 1 second smoothing)
   */
  scrub?: boolean | number;
  /**
   * Custom ScrollTrigger element (default: container itself)
   */
  scrollTrigger?: string | Element | null;
};

/**
 * TextGenerateScrollEffect Component
 *
 * GSAP-powered text animation with blur fade-in effect triggered by scroll position.
 * Combines the visual effect of TextGenerateEffect with ScrollTrigger control.
 *
 * @example
 * ```tsx
 * <TextGenerateScrollEffect
 *   words="Your amazing text here"
 *   className="text-2xl font-bold"
 *   duration={0.8}
 *   staggerDelay={0.05}
 *   animateBy="word"
 *   scrollTriggerStart="top 80%"
 *   scrub={1}
 * />
 * ```
 */
export const TextGenerateScrollEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  animateBy = 'word',
  scrollTriggerStart = 'top 80%',
  scrollTriggerEnd = 'top 50%',
  scrub = false,
  scrollTrigger,
}: TextGenerateScrollEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation using useGSAP hook with ScrollTrigger
  // ✅ Context7 best practice: useGSAP with scope for automatic cleanup
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const spans = containerRef.current.querySelectorAll('.text-span');

      if (spans.length === 0) {
        return;
      }

      // Animate from hidden state to visible with ScrollTrigger
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
          scrollTrigger: {
            trigger: scrollTrigger || containerRef.current,
            start: scrollTriggerStart,
            end: scrollTriggerEnd,
            scrub,
            // ✅ Context7 best practice: Dynamic will-change management
            onEnter: () => {
              gsap.set(containerRef.current, { willChange: 'filter, opacity' });
            },
            onLeave: () => {
              gsap.set(containerRef.current, { willChange: 'auto' });
            },
            onEnterBack: () => {
              gsap.set(containerRef.current, { willChange: 'filter, opacity' });
            },
            onLeaveBack: () => {
              gsap.set(containerRef.current, { willChange: 'auto' });
            },
          },
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [words, duration, staggerDelay, filter, animateBy, scrollTriggerStart, scrollTriggerEnd, scrub],
    },
  );

  const renderWords = () => {
    if (animateBy === 'letter') {
      const wordsArray = words.split(' ');
      return (
        <div className="flex flex-wrap">
          {wordsArray.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split('').map((letter, letterIdx) => (
                <span
                  key={`${wordIdx}-${letterIdx}`}
                  className="text-span dark:text-white text-black opacity-0 inline-block"
                  style={{
                    filter: filter ? 'blur(10px)' : 'none',
                  }}
                >
                  {letter}
                </span>
              ))}
              {wordIdx < wordsArray.length - 1 && (
                <span
                  key={`${wordIdx}-space`}
                  className="text-span dark:text-white text-black opacity-0 inline-block"
                  style={{
                    filter: filter ? 'blur(10px)' : 'none',
                  }}
                >
                  {'\u00A0'}
                </span>
              )}
            </span>
          ))}
        </div>
      );
    }

    // Animate by word
    const wordsArray = words.split(' ');
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <span
              key={word + idx}
              className="text-span dark:text-white text-black opacity-0"
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {word}
              {' '}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={cn('font-bold dark:text-white text-black', className)}>
      {renderWords()}
    </div>
  );
};
