'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  initialDelay = 0,
  animateBy = 'word',
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
  initialDelay?: number;
  animateBy?: 'word' | 'letter';
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation using useGSAP hook
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const spans = containerRef.current.querySelectorAll('.text-span');

      // Animate from hidden state to visible
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
          delay: initialDelay,
          ease: 'power2.out',
        },
      );
    },
    { scope: containerRef, dependencies: [words, duration, staggerDelay, initialDelay, filter, animateBy] },
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
