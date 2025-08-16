'use client';
import { useLayoutEffect, useRef, useState } from 'react';

type Props = {
  /** Larghezza di riferimento in px per mobile (design canvas) */
  mobileWidth: number;
  /** Altezza di riferimento in px per mobile (design canvas) */
  mobileHeight: number;
  /** Breakpoint sopra il quale non applicare scaling (default: 768px) */
  maxWidth?: number;
  /** Contenuto da scalare */
  children: React.ReactNode;
};

export default function MobileScaler({
  mobileWidth,
  mobileHeight,
  maxWidth = 768,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let frame = 0;
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Applica scaling solo su mobile
      if (viewportWidth <= maxWidth) {
        setIsMobile(true);

        // Calcola scale in base alla larghezza del viewport
        const scaleX = viewportWidth / mobileWidth;
        const scaleY = viewportHeight / mobileHeight;

        // Usa la scala più piccola per mantenere tutto visibile
        const finalScale = Math.min(scaleX, scaleY);
        setScale(finalScale);
      } else {
        setIsMobile(false);
        setScale(1);
      }
    };

    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    };

    // Inizializza
    updateScale();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [mobileWidth, mobileHeight, maxWidth]);

  if (!isMobile) {
    // Su desktop, rendering normale senza scaling
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: mobileWidth,
          height: mobileHeight,
          transform: `scale(${scale}) translateZ(0)`,
          transformOrigin: 'center center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -mobileWidth / 2,
          marginTop: -mobileHeight / 2,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
