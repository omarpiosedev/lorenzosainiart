'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useCallback, useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerAddedRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || lenisRef.current) {
      return;
    }

    document.documentElement.classList.add('lenis');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
    });
    lenisRef.current = lenis;

    // Collega Lenis a ScrollTrigger
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    // Usa il ticker GSAP come RAF unico
    if (!tickerAddedRef.current) {
      gsap.ticker.add((t) => {
        // gsap.ticker passa secondi; Lenis si aspetta ms
        lenisRef.current?.raf(t * 1000);
      });
      tickerAddedRef.current = true;
    }

    // Facoltativo: refresh dopo init per layout corretti
    ScrollTrigger.refresh();

    return () => {
      // Cleanup in ordine: listener -> istanza -> ticker -> classe
      try {
        lenis.off('scroll', onLenisScroll);
      } catch {}
      lenis.destroy();
      lenisRef.current = null;

      // Rimuovi il ticker solo quando non c'è più alcuna istanza
      if (tickerAddedRef.current) {
        gsap.ticker.remove((t) => {
          lenisRef.current?.raf(t * 1000);
        });
        tickerAddedRef.current = false;
      }

      document.documentElement.classList.remove('lenis');
    };
  }, [enabled]);

  const getLenis = useCallback(() => lenisRef.current, []);

  const scrollToSection = useCallback(
    (target: string | HTMLElement, offset: number = 0) => {
      const lenis = lenisRef.current;
      if (!lenis) {
        return;
      }
      lenis.scrollTo(target, {
        offset,
        duration: 1.5,
        easing: (t: number) => 1 - (1 - t) ** 3, // easeOutCubic
      });
    },
    [],
  );

  return { scrollToSection, getLenis };
};
