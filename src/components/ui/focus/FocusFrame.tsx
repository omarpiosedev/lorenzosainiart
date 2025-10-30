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
    const tl = gsap.timeline({ delay });

    tl.to(frameRef.current, {
      width: finalWidth + 24, // +24 per i margini degli angoli
      height: finalHeight + 24,
      left: '-12px',
      top: '-12px',
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
          className="corner top-left"
          style={{
            position: 'absolute',
            width: '1.5rem',
            height: '1.5rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 6px ${borderColor})`,
            borderRadius: '3px',
            top: '-12px',
            left: '-12px',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        />
        <span
          className="corner top-right"
          style={{
            position: 'absolute',
            width: '1.5rem',
            height: '1.5rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 6px ${borderColor})`,
            borderRadius: '3px',
            top: '-12px',
            right: '-12px',
            borderLeft: 'none',
            borderBottom: 'none',
          }}
        />
        <span
          className="corner bottom-left"
          style={{
            position: 'absolute',
            width: '1.5rem',
            height: '1.5rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 6px ${borderColor})`,
            borderRadius: '3px',
            bottom: '-12px',
            left: '-12px',
            borderRight: 'none',
            borderTop: 'none',
          }}
        />
        <span
          className="corner bottom-right"
          style={{
            position: 'absolute',
            width: '1.5rem',
            height: '1.5rem',
            border: `3px solid ${borderColor}`,
            filter: `drop-shadow(0px 0px 6px ${borderColor})`,
            borderRadius: '3px',
            bottom: '-12px',
            right: '-12px',
            borderLeft: 'none',
            borderTop: 'none',
          }}
        />
      </div>
    </div>
  );
}
