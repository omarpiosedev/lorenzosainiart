'use client';

import { useEffect, useState } from 'react';

type ResourceType = 'image' | 'font' | 'video';

type LoadingResource = {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
  loaded: boolean;
  weight: number;
  critical: boolean;
  startTime?: number;
  endTime?: number;
};

type UseResourceLoaderReturn = {
  progress: number;
  isLoading: boolean;
  isComplete: boolean;
  resources: LoadingResource[];
  currentPhase: string;
  markResourceLoaded: (id: string) => void;
};

// Definizione delle risorse critiche da tracciare
const CRITICAL_RESOURCES: LoadingResource[] = [
  // Immagini Hero (60% del peso totale)
  {
    id: 'hero-bg',
    name: 'Hero Background',
    type: 'image',
    url: '/assets/images/backgropund.webp',
    loaded: false,
    weight: 20,
    critical: true,
  },
  {
    id: 'hero-sposi',
    name: 'Hero Sposi',
    type: 'image',
    url: '/assets/images/sposi.webp',
    loaded: false,
    weight: 20,
    critical: true,
  },
  {
    id: 'hero-cloud',
    name: 'Hero Cloud',
    type: 'image',
    url: '/assets/images/cloud.webp',
    loaded: false,
    weight: 20,
    critical: true,
  },
  // Fonts (20% del peso totale)
  {
    id: 'font-lavener',
    name: 'Lavener Font',
    type: 'font',
    url: 'Lavener',
    loaded: false,
    weight: 15,
    critical: true,
  },
  {
    id: 'font-will',
    name: 'Will Font',
    type: 'font',
    url: 'Will',
    loaded: false,
    weight: 5,
    critical: false,
  },
  {
    id: 'font-effloresce',
    name: 'Effloresce Font',
    type: 'font',
    url: 'Effloresce It',
    loaded: false,
    weight: 5,
    critical: false,
  },
  // Video del loading screen (20% del peso)
  {
    id: 'loading-video',
    name: 'Logo Animation',
    type: 'video',
    url: '/videos/Logoanimated.mp4',
    loaded: false,
    weight: 20,
    critical: true,
  },
];

export function useResourceLoader(): UseResourceLoaderReturn {
  const [resources, setResources] = useState<LoadingResource[]>(CRITICAL_RESOURCES);
  const [realProgress, setRealProgress] = useState(0); // Progresso reale delle risorse
  const [progress, setProgress] = useState(0); // Progresso visualizzato (animato)
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingStartTime] = useState(Date.now());

  // Timing constraints
  const MIN_LOADING_TIME = 2000; // 2s minimo per apprezzare l'animazione
  const MAX_LOADING_TIME = 4000; // 4s timeout di sicurezza

  // Funzione per marcare una risorsa come caricata
  const markResourceLoaded = (id: string, timing?: { startTime?: number; endTime?: number }) => {
    setResources((prev) => {
      const updated = prev.map((resource) => {
        if (resource.id === id && !resource.loaded) {
          const now = Date.now();
          return {
            ...resource,
            loaded: true,
            startTime: timing?.startTime,
            endTime: timing?.endTime || now,
          };
        }
        return resource;
      });

      // Debug log in development (disabled for production)
      // if (process.env.NODE_ENV === 'development') {
      //   const justLoaded = updated.find(r => r.id === id);
      //   if (justLoaded && justLoaded.loaded) {
      //     const loadTime = justLoaded.endTime && justLoaded.startTime
      //       ? Math.round(justLoaded.endTime - justLoaded.startTime)
      //       : 'instant';
      //     console.log(`✅ Resource loaded: ${justLoaded.name} (${loadTime}ms)`);
      //   }
      // }

      return updated;
    });
  };

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Strategy 1: PerformanceObserver per tracciamento automatico
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') {
      return;
    }

    // Check if PerformanceObserver is supported
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver not supported, using fallback');
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const perfEntry = entry as PerformanceResourceTiming;

          // Match resource by URL
          const resource = resources.find((r) => {
            if (r.type === 'image' || r.type === 'video') {
              return perfEntry.name.includes(r.url);
            }
            return false;
          });

          if (resource && !resource.loaded) {
            markResourceLoaded(resource.id, {
              startTime: perfEntry.startTime,
              endTime: perfEntry.responseEnd,
            });
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Failed to observe resources:', error);
    }

    return () => observer.disconnect();
  }, [isClient, resources]);

  // Strategy 2: Font Loading API (simplified)
  useEffect(() => {
    if (!isClient || typeof document === 'undefined') {
      return;
    }

    const loadFonts = async () => {
      const fontResources = resources.filter(r => r.type === 'font');

      try {
        // Wait for all fonts to be ready
        await document.fonts.ready;

        // Mark all fonts as loaded
        fontResources.forEach((font) => {
          markResourceLoaded(font.id);
        });
      } catch (error) {
        console.warn('Fonts loading failed:', error);
        // Mark as loaded anyway to not block
        fontResources.forEach((font) => {
          markResourceLoaded(font.id);
        });
      }
    };

    loadFonts();
  }, [isClient]);

  // Strategy 3: Images are loaded by Next.js Image components with onLoad callbacks
  // No manual preloading needed - components will call markResourceLoaded via window API

  // Expose markResourceLoaded to window for components
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      (window as any).markResourceLoaded = (id: string) => {
        markResourceLoaded(id);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).markResourceLoaded;
      }
    };
  }, [isClient]);

  // Calculate real progress based on loaded resources
  useEffect(() => {
    const criticalResources = resources.filter(r => r.critical);
    const totalWeight = criticalResources.reduce((sum, r) => sum + r.weight, 0);
    const loadedWeight = criticalResources
      .filter(r => r.loaded)
      .reduce((sum, r) => sum + r.weight, 0);

    const calculatedProgress = Math.round((loadedWeight / totalWeight) * 100);
    setRealProgress(calculatedProgress);
  }, [resources]);

  // Smooth progress animation - basato sul tempo con cap al realProgress
  useEffect(() => {
    if (!isClient) {
      return;
    }

    const startTime = Date.now();
    const estimatedDuration = MIN_LOADING_TIME; // Durata stimata del caricamento
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      setProgress((currentProgress) => {
        // Se il caricamento è completo, vai a 100%
        if (isComplete) {
          if (currentProgress >= 100) {
            return 100;
          }
          return Math.min(100, currentProgress + 3); // Veloce verso 100%
        }

        // Calcola il progresso basato sul tempo (crescita lineare verso 95%)
        const timeBasedProgress = Math.min(95, (elapsed / estimatedDuration) * 95);

        // Non superare mai il progresso reale delle risorse
        // Questo impedisce che la barra vada avanti se le risorse non sono pronte
        const cappedProgress = Math.min(timeBasedProgress, realProgress + 10);

        // Incrementa gradualmente verso il target
        if (currentProgress < cappedProgress) {
          const diff = cappedProgress - currentProgress;
          const step = Math.max(0.3, diff * 0.08); // Incremento smooth
          return Math.min(cappedProgress, currentProgress + step);
        }

        return currentProgress;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [realProgress, isComplete, isClient, MIN_LOADING_TIME]);

  // Determine current loading phase
  const currentPhase = (() => {
    const fontsLoaded = resources
      .filter(r => r.type === 'font' && r.critical)
      .every(r => r.loaded);

    const imagesLoaded = resources
      .filter(r => r.type === 'image' && r.critical)
      .every(r => r.loaded);

    const videoLoaded = resources
      .filter(r => r.type === 'video')
      .every(r => r.loaded);

    if (!fontsLoaded) {
      return 'Loading fonts...';
    }
    if (!videoLoaded) {
      return 'Loading animation...';
    }
    if (!imagesLoaded) {
      return 'Loading images...';
    }
    return 'Almost ready...';
  })();

  // Check if loading can complete
  useEffect(() => {
    if (isComplete) {
      return;
    }

    const checkCompletion = () => {
      const elapsed = Date.now() - loadingStartTime;
      const resourcesReady = progress >= 100;
      const minTimePassed = elapsed >= MIN_LOADING_TIME;
      const timeoutReached = elapsed >= MAX_LOADING_TIME;

      const shouldComplete = (resourcesReady && minTimePassed) || timeoutReached;

      // Debug: log every check (disabled for production)
      // if (process.env.NODE_ENV === 'development' && progress > 0) {
      //   console.log(
      //     `🔍 Check: progress=${progress}% elapsed=${elapsed}ms ready=${resourcesReady} minTime=${minTimePassed} timeout=${timeoutReached} shouldComplete=${shouldComplete} isComplete=${isComplete}`,
      //   );
      // }

      if (shouldComplete && !isComplete) {
        // Debug: loading complete (disabled for production)
        // if (process.env.NODE_ENV === 'development') {
        //   console.log('🎉 Loading complete!', {
        //     progress,
        //     elapsed: `${elapsed}ms`,
        //     reason: timeoutReached ? 'timeout' : 'resources ready',
        //   });
        // }

        setIsComplete(true);
        setIsLoading(false);
        return true;
      }

      return false;
    };

    // Check immediately
    if (checkCompletion()) {
      return;
    }

    // If resources are ready but min time hasn't passed, set a timer
    if (progress >= 100) {
      const elapsed = Date.now() - loadingStartTime;
      const remaining = MIN_LOADING_TIME - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(checkCompletion, remaining);
        return () => clearTimeout(timer);
      }
    }

    // Otherwise check periodically
    const interval = setInterval(checkCompletion, 100);
    return () => clearInterval(interval);
  }, [progress, loadingStartTime, isComplete]);

  // Debug logging in development (disabled for production)
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development' && isClient) {
    //   console.log('📊 Loading progress:', {
    //     progress: `${progress}%`,
    //     phase: currentPhase,
    //     resources: resources.map(r => ({
    //       name: r.name,
    //       loaded: r.loaded,
    //       weight: `${r.weight}%`,
    //     })),
    //   });
    // }
  }, [progress, currentPhase, isClient]);

  return {
    progress,
    isLoading,
    isComplete,
    resources,
    currentPhase,
    markResourceLoaded,
  };
}
