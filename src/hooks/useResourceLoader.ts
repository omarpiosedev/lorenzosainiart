'use client';

import { useEffect, useState } from 'react';

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
  const [isClient, setIsClient] = useState(false); // Per evitare problemi di hydration

  // Calcola la percentuale di progresso reale delle risorse
  useEffect(() => {
    const totalWeight = resources.reduce((sum, resource) => sum + resource.weight, 0);
    const loadedWeight = resources
      .filter(resource => resource.loaded)
      .reduce((sum, resource) => sum + resource.weight, 0);

    const newActualProgress = Math.round((loadedWeight / totalWeight) * 100);
    setActualProgress(newActualProgress);
  }, [resources]);

  // Gestisce il progresso smooth e il timing
  useEffect(() => {
    // Non avviare il timer se non siamo lato client
    if (!isClient) {
      return;
    }

    const minDuration = 3000; // 3 secondi
    const maxDuration = 8000; // Timeout di sicurezza: massimo 8 secondi
    const startTime = (typeof window !== 'undefined' && (window as any).loadingStartTime) || Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const timeProgress = Math.min((elapsedTime / minDuration) * 100, 100);

      // La barra va sempre da 0 a 100 in modo fluido in 3 secondi
      setProgress(Math.round(timeProgress));

      // Completa quando:
      // 1. Sono passati 3 secondi E le risorse sono tutte caricate, OPPURE
      // 2. È scaduto il timeout di sicurezza (8 secondi)
      const shouldComplete
        = (elapsedTime >= minDuration && actualProgress >= 100)
          || elapsedTime >= maxDuration;

      if (shouldComplete) {
        if (!isComplete) {
          // Mostra 100% per 500ms prima di completare
          setProgress(100);
          setTimeout(() => {
            setIsComplete(true);
            setIsLoading(false);
          }, 500);
        }
      } else {
        // Continua ad aggiornare ogni 50ms per fluidità
        setTimeout(updateProgress, 50);
      }
    };

    updateProgress();
  }, [actualProgress, isComplete, isClient]);

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

  // Effect per inizializzare lato client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Esegui solo lato client per evitare problemi di hydration
    if (!isClient) {
      return;
    }

    // Segna il tempo di inizio caricamento
    if (typeof window !== 'undefined') {
      (window as any).loadingStartTime = Date.now();
    }

    // 1. Caricamento fonts (critici per il testo visibile)
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        markResourceLoaded('fonts');
      }).catch(() => {
        // Fallback in caso di errore
        markResourceLoaded('fonts');
      });
    } else {
      // Fallback per browser older
      setTimeout(() => markResourceLoaded('fonts'), 1000);
    }

    // 2. Preload solo background hero (visibile immediatamente)
    const heroImage = new Image();
    heroImage.onload = () => markResourceLoaded('heroBackground');
    heroImage.onerror = () => markResourceLoaded('heroBackground'); // Continua anche se fallisce
    heroImage.src = '/assets/images/backgropund.webp';
  }, [isClient]);

  // Handler per il video
  const handleVideoLoaded = () => {
    markResourceLoaded('video');
  };

  // Espone la funzione per il video component immediatamente
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      (window as any).markVideoLoaded = handleVideoLoaded;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).markVideoLoaded;
      }
    };
  }, [isClient]);

  return {
    progress,
    isLoading,
    isComplete,
    resources,
  };
}
