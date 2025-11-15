'use client';

import { motion, stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';

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
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');

  useEffect(() => {
    if (!isActive) {
      // Reset to hidden when not active
      animate(
        'span',
        {
          opacity: 0,
          filter: filter ? 'blur(10px)' : 'none',
        },
        {
          duration: 0.2,
        },
      );
      return;
    }

    // Animate in when active
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration,
        delay: stagger(staggerDelay),
      },
    );
  }, [isActive, animate, duration, filter, staggerDelay]);

  return (
    <motion.h2 ref={scope} className={`${className} text-wrap-balanced heading-compact`} style={style}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="inline-block opacity-0"
          style={{
            filter: filter ? 'blur(10px)' : 'none',
          }}
        >
          {word}
          {idx < wordsArray.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.h2>
  );
}
