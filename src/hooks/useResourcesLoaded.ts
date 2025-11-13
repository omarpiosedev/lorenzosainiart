'use client';

import { useEffect, useState } from 'react';

/**
 * useResourcesLoaded - Hook to monitor critical resources loading
 *
 * Monitors:
 * - Document ready state (loading → interactive → complete)
 * - Critical fonts (Lavener, Effloresce It) via Font Loading API
 * - Critical images (LoadingScreen assets)
 * - Safety timeout (max 5 seconds)
 *
 * Returns true when all resources are loaded OR timeout is reached
 */
export const useResourcesLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Skip if already loaded
    if (isLoaded) {
      return;
    }

    let isMounted = true;

    const checkResourcesLoaded = async () => {
      try {
        // 1. Check document ready state
        const isDocumentReady = document.readyState === 'complete';

        // 2. Check critical fonts using Font Loading API
        // Wait for fonts to be ready (max 3 seconds)
        const fontsPromise = Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 3000)),
        ]);

        // 3. Check critical images (LoadingScreen polaroids + logo)
        const criticalImages = [
          '/assets/images/LoadingScreen/Polaroid 1.webp',
          '/assets/images/LoadingScreen/Polaroid2.webp',
          '/assets/images/LoadingScreen/Polaroid3.webp',
          '/assets/images/LoadingScreen/Polaroid4.webp',
          '/assets/images/LoadingScreen/Polaroid5.webp',
          '/assets/images/LogoNero.webp',
        ];

        const imagePromises = criticalImages.map((src) => {
          return new Promise<void>((resolve) => {
            // Check if image is already loaded in DOM
            const existingImg = document.querySelector(`img[src="${src}"]`) as HTMLImageElement;
            if (existingImg && existingImg.complete) {
              resolve();
              return;
            }

            // Otherwise, preload the image
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if image fails
            img.src = src;
          });
        });

        // Wait for all resources with timeout
        await Promise.all([
          fontsPromise,
          ...imagePromises,
          // Ensure document is ready
          new Promise<void>((resolve) => {
            if (isDocumentReady) {
              resolve();
            } else {
              window.addEventListener('load', () => resolve(), { once: true });
            }
          }),
        ]);

        // Mark as loaded if still mounted
        if (isMounted) {
          setIsLoaded(true);
        }
      } catch {
        // If any error occurs, mark as loaded anyway to prevent infinite loading
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    // Start checking resources
    checkResourcesLoaded();

    // Safety timeout: force loaded state after 5 seconds
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoaded(true);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isLoaded]);

  return isLoaded;
};
