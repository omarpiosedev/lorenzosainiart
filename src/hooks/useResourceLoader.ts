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
    { name: 'video', loaded: false, weight: 30 },
    { name: 'fonts', loaded: false, weight: 20 },
    { name: 'criticalImages', loaded: false, weight: 25 },
    { name: 'gsap', loaded: false, weight: 15 },
    { name: 'i18n', loaded: false, weight: 10 },
  ]);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [actualProgress, setActualProgress] = useState(0); // Progresso reale delle risorse

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
    const minDuration = 3000; // 3 secondi
    const startTime = (window as any).loadingStartTime || Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const timeProgress = Math.min((elapsedTime / minDuration) * 100, 100);

      // La barra va sempre da 0 a 100 in modo fluido in 3 secondi
      setProgress(Math.round(timeProgress));

      // Completa quando sono passati 3 secondi E le risorse sono tutte caricate
      if (elapsedTime >= minDuration && actualProgress >= 100) {
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
  }, [actualProgress, isComplete]);

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

  useEffect(() => {
    // Segna il tempo di inizio caricamento
    (window as any).loadingStartTime = Date.now();

    // 1. Caricamento fonts
    if (document.fonts) {
      document.fonts.ready.then(() => {
        markResourceLoaded('fonts');
      });
    } else {
      // Fallback per browser older
      setTimeout(() => markResourceLoaded('fonts'), 1000);
    }

    // 2. Preload immagini critiche
    const criticalImages = [
      '/assets/images/LogoBianco.webp',
      '/assets/images/backgropund.webp',
    ];

    Promise.all(
      criticalImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Continua anche se immagine non carica
          img.src = src;
        });
      }),
    ).then(() => {
      markResourceLoaded('criticalImages');
    });

    // 3. GSAP ready (se disponibile)
    if (typeof window !== 'undefined') {
      // GSAP è già importato, quindi è disponibile
      setTimeout(() => markResourceLoaded('gsap'), 100);
    }

    // 4. I18n ready
    setTimeout(() => markResourceLoaded('i18n'), 200);
  }, []);

  // Handler per il video
  const handleVideoLoaded = () => {
    markResourceLoaded('video');
  };

  // Espone la funzione per il video component
  useEffect(() => {
    (window as any).markVideoLoaded = handleVideoLoaded;

    return () => {
      delete (window as any).markVideoLoaded;
    };
  }, []);

  return {
    progress,
    isLoading,
    isComplete,
    resources,
  };
}
