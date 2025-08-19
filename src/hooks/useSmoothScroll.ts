'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Solo inizializza se enabled è true e siamo lato client
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Aggiungi classe al documento per Lenis
    document.documentElement.classList.add('lenis');

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Durata dell'animazione (1.2s per un effetto fluido)
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)), // Easing personalizzato
      touchMultiplier: 2, // Sensibilità touch
      wheelMultiplier: 1, // Sensibilità wheel
      infinite: false, // Non infinito per portfolio
    });

    lenisRef.current = lenis;

    // Integrazione con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Animation frame loop per Lenis
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (lenisRef.current) {
        document.documentElement.classList.remove('lenis');
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [enabled]);

  // Funzione per scrollare verso una sezione specifica
  const scrollToSection = (target: string | HTMLElement, offset: number = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.5,
        easing: (t: number) => 1 - (1 - t) ** 3, // easeOutCubic
      });
    }
  };

  // Funzione per ottenere l'istanza Lenis (utile per controlli avanzati)
  const getLenis = () => lenisRef.current;

  return {
    scrollToSection,
    getLenis,
  };
};
