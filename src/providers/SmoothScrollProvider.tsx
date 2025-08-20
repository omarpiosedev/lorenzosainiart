'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

type SmoothScrollProviderProps = { children: React.ReactNode };

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const [prefersReduced, setPrefersReduced] = useState(false);

  // 1) prefers-reduced-motion + compat Safari
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);
    update();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }

    // Return empty cleanup function if no listener method is supported
    return () => {};
  }, []);

  const enabled = useMemo(() => !prefersReduced, [prefersReduced]);
  const { getLenis } = useSmoothScroll(enabled);

  // 3) Evita conflitto con scroll-behavior:smooth quando Lenis è attivo
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    return () => {
      el.style.scrollBehavior = prev;
    };
  }, [enabled]);

  // 2) Resize dopo mount e ad ogni cambio route (doppio rAF) + cleanup corretto
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    const run = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          getLenis()?.resize();
        });
      });
    };

    // 4) (Opzionale) attesa fonts per evitare micro jump
    if (document.fonts?.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [getLenis, pathname]);

  return <>{children}</>;
}
