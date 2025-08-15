'use client';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

type Props = {
  /** Larghezza di riferimento in px (canvas di design) */
  designWidth: number;
  /** Altezza di riferimento in px (canvas di design) */
  designHeight: number;
  /** Modalità di adattamento */
  mode?: 'contain' | 'cover' | 'width';
  /** Contenuto posizionato in px dentro la canvas */
  children: React.ReactNode;
  /** Arrotondare scala per ridurre shimmering del testo */
  roundScale?: boolean;
};

export default function ScaleToFit({
  designWidth,
  designHeight,
  mode = 'contain',
  children,
  roundScale = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let frame = 0;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        const sx = w / designWidth;
        const sy = h / designHeight;
        let s
          = mode === 'cover'
            ? Math.max(sx, sy)
            : mode === 'width'
              ? sx
              : Math.min(sx, sy);
        if (roundScale) {
          s = Math.round(s * 1000) / 1000;
        }
        setScale(s);
      });
    });

    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [designWidth, designHeight, mode, roundScale]);

  const transform = useMemo(() => `translateZ(0) scale(${scale})`, [scale]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${designWidth}/${designHeight}`, // Riserva spazio
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform,
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
