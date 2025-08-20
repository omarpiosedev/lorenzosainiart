'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Ascolta i cambi di prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);
    update(); // Imposta il valore iniziale
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const enabled = useMemo(() => !prefersReduced, [prefersReduced]);
  const { getLenis } = useSmoothScroll(enabled);

  // Resize dopo mount e ad ogni cambio route (RAF > fonts)
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        const lenis = getLenis();
        if (lenis) {
          lenis.resize();
        }
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [getLenis, pathname]);

  return <>{children}</>;
}
