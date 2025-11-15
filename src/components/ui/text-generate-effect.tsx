'use client';
import { motion, stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration || 1,
          delay: stagger(staggerDelay),
        },
      );
    }, initialDelay * 1000);

    return () => clearTimeout(timer);
  }, [scope.current]);

  const renderWords = () => {
    if (animateBy === 'letter') {
      const wordsArray = words.split(' ');
      return (
        <motion.div ref={scope} className="flex flex-wrap">
          {wordsArray.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split('').map((letter, letterIdx) => (
                <motion.span
                  key={`${wordIdx}-${letterIdx}`}
                  className="dark:text-white text-black opacity-0 inline-block"
                  style={{
                    filter: filter ? 'blur(10px)' : 'none',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              {wordIdx < wordsArray.length - 1 && (
                <motion.span
                  key={`${wordIdx}-space`}
                  className="dark:text-white text-black opacity-0 inline-block"
                  style={{
                    filter: filter ? 'blur(10px)' : 'none',
                  }}
                >
                  {'\u00A0'}
                </motion.span>
              )}
            </span>
          ))}
        </motion.div>
      );
    }

    const wordsArray = words.split(' ');
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {word}
              {' '}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn('font-bold dark:text-white text-black', className)}>
      {renderWords()}
    </div>
  );
};
