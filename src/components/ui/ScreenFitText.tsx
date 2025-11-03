'use client';

import { useCallback, useEffect, useRef } from 'react';

type ScreenFitTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

export const ScreenFitText = ({ text, className = '', style }: ScreenFitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const resizeText = useCallback(() => {
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!container || !textElement) {
      return;
    }

    const containerWidth = container.offsetWidth;
    let min = 1;
    let max = 2500;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      textElement.style.fontSize = `${mid}px`;

      if (textElement.offsetWidth <= containerWidth) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }

    textElement.style.fontSize = `${max}px`;
  }, []);

  useEffect(() => {
    resizeText();

    window.addEventListener('resize', resizeText);

    return () => {
      window.removeEventListener('resize', resizeText);
    };
  }, [text, resizeText]);

  return (
    <div
      className={`flex w-full items-center overflow-hidden ${className}`}
      ref={containerRef}
    >
      <span
        className="mx-auto whitespace-nowrap text-center font-bold uppercase leading-none"
        style={style}
        ref={textRef}
      >
        {text}
      </span>
    </div>
  );
};
