'use client';

import { gsap } from 'gsap';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ✅ MODERN PATTERN: Custom hook for interval management (React 2025 best practice)
// Replaces old setInterval pattern with cleaner, more maintainable code
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) {
      return;
    }

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

type FocusProps = {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  wordStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
};

type FocusRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Default empty styles to avoid unstable-default-props warnings
const DEFAULT_WORD_STYLE: React.CSSProperties = {};
const DEFAULT_CONTAINER_STYLE: React.CSSProperties = {};

export function Focus({
  sentence = 'Inspira Focus',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
  wordStyle = DEFAULT_WORD_STYLE,
  containerStyle = DEFAULT_CONTAINER_STYLE,
}: FocusProps) {
  const words = useMemo(() => sentence.split(' '), [sentence]);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const frameRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setWordRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) {
      wordRefs.current[index] = el;
    }
  };

  const updateFocusRect = (index: number) => {
    if (index === null || index === -1) {
      return;
    }
    if (!wordRefs.current[index] || !containerRef.current || !frameRef.current) {
      return;
    }

    const parentRect = containerRef.current.getBoundingClientRect();
    const wordRect = wordRefs.current[index]!.getBoundingClientRect();

    const focusRect: FocusRect = {
      x: wordRect.left - parentRect.left,
      y: wordRect.top - parentRect.top,
      width: wordRect.width,
      height: wordRect.height,
    };

    gsap.to(frameRef.current, {
      x: focusRect.x,
      y: focusRect.y,
      width: focusRect.width,
      height: focusRect.height,
      opacity: 1,
      duration: animationDuration,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(0);
    }
  };

  // Update focus rect when current index changes
  useEffect(() => {
    updateFocusRect(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ✅ MODERN PATTERN: Use custom useInterval hook for cleaner code
  // Auto-cycle through words in automatic mode
  const cycleWords = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % words.length);
  }, [words.length]);

  useInterval(
    cycleWords,
    manualMode ? null : (animationDuration * 1000 + pauseBetweenAnimations * 1000),
  );

  // Initialize frame position
  useEffect(() => {
    if (!frameRef.current) {
      return;
    }

    gsap.set(frameRef.current, {
      opacity: 0,
    });
    // Initial position after mount
    const timeoutId = setTimeout(() => updateFocusRect(0), 100);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`focus-container ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        gap: '1em',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...containerStyle,
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}_${index}`}
          ref={el => setWordRef(el, index)}
          className={`focus-word ${manualMode ? 'manual' : ''} ${
            index === currentIndex && !manualMode ? 'active' : ''
          }`}
          style={{
            position: 'relative',
            fontSize: '3rem',
            fontWeight: 900,
            cursor: 'pointer',
            filter:
              index === currentIndex ? 'blur(0px)' : `blur(${blurAmount}px)`,
            transition: `filter ${animationDuration}s ease, color 0.3s ease`,
            ...wordStyle,
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {word}
        </span>
      ))}
      <div
        ref={frameRef}
        className="focus-frame"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          boxSizing: 'content-box',
          border: 'none',
        }}
      >
        <span
          className="corner top-left"
          style={{
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 4px ${borderColor})`,
            borderRadius: '3px',
            top: '-10px',
            left: '-10px',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        />
        <span
          className="corner top-right"
          style={{
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 4px ${borderColor})`,
            borderRadius: '3px',
            top: '-10px',
            right: '-10px',
            borderLeft: 'none',
            borderBottom: 'none',
          }}
        />
        <span
          className="corner bottom-left"
          style={{
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 4px ${borderColor})`,
            borderRadius: '3px',
            bottom: '-10px',
            left: '-10px',
            borderRight: 'none',
            borderTop: 'none',
          }}
        />
        <span
          className="corner bottom-right"
          style={{
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 4px ${borderColor})`,
            borderRadius: '3px',
            bottom: '-10px',
            right: '-10px',
            borderLeft: 'none',
            borderTop: 'none',
          }}
        />
      </div>
    </div>
  );
}
