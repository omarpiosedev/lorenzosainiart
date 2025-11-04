'use client';

import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

type FocusFrameProps = {
  children: React.ReactNode;
  borderColor?: string;
  blurAmount?: number;
  animationDuration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

// Default empty style to avoid unstable-default-props warning
const DEFAULT_STYLE: React.CSSProperties = {};

export function FocusFrame({
  children,
  borderColor = 'white',
  blurAmount = 20,
  animationDuration = 3,
  delay = 0,
  className = '',
  style = DEFAULT_STYLE,
}: FocusFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !frameRef.current) {
      return;
    }

    // Ottieni dimensioni finali del contenuto
    const finalWidth = containerRef.current.offsetWidth;
    const finalHeight = containerRef.current.offsetHeight;

    // Dimensioni iniziali del riquadro (quadrato piccolo)
    const initialSize = 100;

    // Imposta stato iniziale del contenuto (sfocato)
    gsap.set(contentRef.current, {
      filter: `blur(${blurAmount}px)`,
    });

    // Imposta stato iniziale del frame (quadrato piccolo al centro)
    gsap.set(frameRef.current, {
      opacity: 1,
      width: initialSize,
      height: initialSize,
      left: '50%',
      top: '50%',
      x: '-50%',
      y: '-50%',
    });

    // Animazione di espansione dell'obiettivo + messa a fuoco
    // Margini responsivi: mobile attaccato al testo, desktop con spazio
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const margin = isMobile ? 0 : 16;
    const offset = isMobile ? 0 : 8;

    const tl = gsap.timeline({ delay });

    tl.to(frameRef.current, {
      width: finalWidth + margin,
      height: finalHeight + margin,
      left: `-${offset}px`,
      top: `-${offset}px`,
      x: 0,
      y: 0,
      duration: animationDuration,
      ease: 'power2.out',
    }).to(
      contentRef.current,
      {
        filter: 'blur(0px)',
        duration: animationDuration,
        ease: 'power2.out',
      },
      '<',
    ); // Inizia insieme all'espansione

    return () => {
      tl.kill();
    };
  }, [blurAmount, animationDuration, delay]);

  return (
    <div
      ref={containerRef}
      className={`focus-frame-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      <div ref={contentRef}>{children}</div>

      <div
        ref={frameRef}
        className="focus-frame"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        <span
          className="corner top-0 left-4 md:-top-1 md:-left-1"
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderLeft: `3px solid ${borderColor}`,
            borderTop: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 10px ${borderColor})`,
          }}
        />
        <span
          className="corner top-0 right-5 md:-top-1 md:-right-1"
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderRight: `3px solid ${borderColor}`,
            borderTop: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 10px ${borderColor})`,
          }}
        />
        <span
          className="corner bottom-0 left-4 md:-bottom-1 md:-left-1"
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderLeft: `3px solid ${borderColor}`,
            borderBottom: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 10px ${borderColor})`,
          }}
        />
        <span
          className="corner bottom-0 right-5 md:-bottom-1 md:-right-1"
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderRight: `3px solid ${borderColor}`,
            borderBottom: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 10px ${borderColor})`,
          }}
        />
      </div>
    </div>
  );
}
