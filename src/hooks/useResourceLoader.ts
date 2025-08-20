'use client';

import { useEffect, useRef, useState } from 'react';

type LoadingResource = {
  name: string;
  loaded: boolean;
  weight: number; // Peso per il calcolo della percentuale
};

type UseResourceLoaderReturn = {
  progress: number;
  isLoading: boolean;
  isComplete: boolean;
  resources: LoadingResource[];
  markResourceLoaded: (name: string) => void; // Exposed for direct usage
};

export function useResourceLoader(): UseResourceLoaderReturn {
  const [resources, setResources] = useState<LoadingResource[]>([
    { name: 'video', loaded: false, weight: 40 }, // Video logo del loading screen
    { name: 'fonts', loaded: false, weight: 30 }, // Font per testo visibile
    { name: 'heroBackground', loaded: false, weight: 30 }, // Background della prima sezione
  ]);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [actualProgress, setActualProgress] = useState(0); // Progresso reale delle risorse

  const startTimeRef = useRef<number | null>(null);

  // Calcola la percentuale di progresso reale delle risorse
  useEffect(() => {
    const totalWeight = resources.reduce((sum, resource) => sum + resource.weight, 0) || 1;
    const loadedWeight = resources
      .filter(resource => resource.loaded)
      .reduce((sum, resource) => sum + resource.weight, 0);

    const newActualProgress = Math.round((loadedWeight / totalWeight) * 100);
    setActualProgress(newActualProgress);
  }, [resources]);

  // Funzione per marcare una risorsa come caricata
  const markResourceLoaded = (resourceName: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.name === resourceName
          ? { ...resource, loaded: true }
          : resource,
      ),
    );
  };

  // Initialize start time once
  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  }, []);

  // Gestisce il progresso smooth e il timing con cleanup robusto
  useEffect(() => {
    const minDuration = 3000; // 3 secondi
    const maxDuration = 8000; // Timeout di sicurezza: massimo 8 secondi
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    let intervalId: number | null = null;
    let completionTimeoutId: number | null = null;

    const tick = () => {
      const elapsed = Date.now() - (startTimeRef.current as number);
      const timeProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(Math.round(timeProgress));

      const shouldComplete
        = (elapsed >= minDuration && actualProgress >= 100) || elapsed >= maxDuration;

      if (shouldComplete) {
        if (!isComplete) {
          setProgress(100);
          completionTimeoutId = window.setTimeout(() => {
            setIsComplete(true);
            setIsLoading(false);
          }, 500);
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    tick();
    intervalId = window.setInterval(tick, 50);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (completionTimeoutId) {
        clearTimeout(completionTimeoutId);
      }
    };
  }, [actualProgress, isComplete]);

  // Font loading with proper cleanup
  useEffect(() => {
    let timeoutId: number | null = null;

    // 1. Caricamento fonts (critici per il testo visibile)
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => markResourceLoaded('fonts'))
        .catch(() => markResourceLoaded('fonts'));
    } else {
      // Fallback per browser older
      timeoutId = window.setTimeout(() => markResourceLoaded('fonts'), 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // 2. Preload hero background con abort mechanism
    const heroImage = new Image();
    heroImage.onload = () => !cancelled && markResourceLoaded('heroBackground');
    heroImage.onerror = () => !cancelled && markResourceLoaded('heroBackground');
    heroImage.src = '/assets/images/background.webp'; // Fixed typo: backgropund -> background

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    progress,
    isLoading,
    isComplete,
    resources,
    markResourceLoaded, // Exposed for direct usage
  };
}
