'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Detects if the user is on macOS or iOS
 * Best practice 2025: Use navigator.platform (not spoofed) + userAgent fallback
 *
 * Why disable Lenis on macOS?
 * - macOS has excellent native smooth scrolling with trackpad
 * - Lenis creates a "double smoothing" effect that feels laggy
 * - Official Lenis issue #237: "Optionally disable smooth scrolling on trackpads"
 *
 * @returns {boolean} true if macOS/iOS, false otherwise
 */
const isMacOS = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Primary check: navigator.platform (more reliable, not spoofed)
  // Modern Macs return "MacIntel", future-proof with includes()
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('mac')) {
    return true;
  }

  // Secondary check: userAgent for iOS devices (iPhone, iPad, iPod)
  // iOS also has native smooth scrolling
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return true;
  }

  return false;
};

export const useSmoothScroll = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if we should enable Lenis:
    // 1. enabled flag must be true
    // 2. Must be client-side
    // 3. Must NOT be macOS/iOS (they have native smooth scrolling)
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Disable Lenis on macOS/iOS - they already have excellent native smooth scrolling
    if (isMacOS()) {
      // Lenis disabled on macOS/iOS - using native smooth scrolling
      return;
    }

    // Aggiungi classe al documento per Lenis
    document.documentElement.classList.add('lenis');

    // Initialize Lenis with autoRaf disabled (we'll use GSAP ticker)
    const lenis = new Lenis({
      duration: 1.2, // Durata dell'animazione (1.2s per un effetto fluido)
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)), // Easing personalizzato
      touchMultiplier: 2, // Sensibilità touch
      wheelMultiplier: 1, // Sensibilità wheel
      infinite: false, // Non infinito per portfolio
      autoRaf: false, // ✅ BEST PRACTICE: Disabilita RAF automatico per usare GSAP ticker
    });

    lenisRef.current = lenis;

    // ✅ BEST PRACTICE: Integrazione GSAP ticker (più performante e sincronizzato)
    // Usa GSAP ticker invece di requestAnimationFrame manuale
    const update = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker passa tempo in secondi, Lenis vuole millisecondi
    };

    // Integrazione con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Aggiungi update al ticker GSAP
    gsap.ticker.add(update);

    // ✅ BEST PRACTICE: Disabilita lag smoothing per scroll immediato
    // Previene delay nelle animazioni di scroll
    gsap.ticker.lagSmoothing(0);

    // Cleanup function
    return () => {
      // Rimuovi update dal ticker GSAP
      gsap.ticker.remove(update);

      if (lenisRef.current) {
        document.documentElement.classList.remove('lenis');
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [enabled]);

  // Funzione per scrollare verso una sezione specifica
  // Funziona sia con Lenis (se disponibile) che con scroll nativo
  const scrollToSection = (target: string | HTMLElement, offset: number = 0) => {
    if (lenisRef.current) {
      // Use Lenis smooth scroll (Windows/Linux)
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.5,
        easing: (t: number) => 1 - (1 - t) ** 3, // easeOutCubic
      });
    } else {
      // Fallback to native smooth scroll (macOS/iOS)
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition + offset,
          behavior: 'smooth', // Use native smooth scroll
        });
      }
    }
  };

  // Funzione per ottenere l'istanza Lenis (utile per controlli avanzati)
  // Returns null on macOS/iOS where Lenis is disabled
  const getLenis = () => lenisRef.current;

  return {
    scrollToSection,
    getLenis,
  };
};
