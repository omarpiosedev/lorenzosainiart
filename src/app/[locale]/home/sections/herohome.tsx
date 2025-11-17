'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FocusFrame } from '@/components/ui/focus';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroHome() {
  // ✅ OPTIMIZATION 1: State → Refs per valori non-UI (no re-render necessari)
  const scaleRef = useRef(1);
  const breakpointRef = useRef<'mobile' | 'tablet' | 'desktop'>('desktop');
  const initialViewportRef = useRef<{ width: number; height: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Stati UI-only (servono re-render)
  const [isReady, setIsReady] = useState(false);
  const [mountKey, setMountKey] = useState(0);
  const [, forceUpdate] = useState(0); // Force re-render quando necessario

  // Refs per le animazioni
  const containerRef = useRef<HTMLElement>(null);
  const sposiRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);
  const titleDesktopRef = useRef<HTMLHeadingElement>(null);
  const titleMobileRef = useRef<HTMLHeadingElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | undefined>(undefined);
  const sposiParallaxRef = useRef<gsap.core.Tween | null>(null);
  const cloudParallaxRef = useRef<gsap.core.Tween | null>(null);

  // ✅ OPTIMIZATION 9: useLayoutEffect invece di useEffect per mountKey
  // Runs synchronously before paint, no setState warning
  useLayoutEffect(() => {
    setMountKey(prev => prev + 1);
  }, []);

  // ✅ OPTIMIZATION 4: Callback memoizzato per onLoad immagini
  const handleResourceLoad = useCallback((resourceId: string) => () => {
    if (typeof window !== 'undefined' && (window as any).markResourceLoaded) {
      (window as any).markResourceLoaded(resourceId);
    }
  }, []);

  // ✅ OPTIMIZATION 5: useMemo per baseDimensions
  const baseDimensions = useMemo(() => {
    const bp = breakpointRef.current;
    switch (bp) {
      case 'mobile':
        return { width: 375, height: 800 };
      case 'tablet':
        return { width: 1024, height: 768 };
      default:
        return { width: 1920, height: 1080 };
    }
  }, [breakpointRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ OPTIMIZATION 2: Throttle resize con requestAnimationFrame
  useLayoutEffect(() => {
    const updateScale = () => {
      const viewport = window.visualViewport;
      const currentWidth = viewport ? viewport.width : window.innerWidth;
      const currentHeight = viewport ? viewport.height : window.innerHeight;

      // Inizializza viewport di riferimento alla prima esecuzione
      if (!initialViewportRef.current) {
        initialViewportRef.current = { width: currentWidth, height: currentHeight };
      }

      // Se c'è una differenza significativa rispetto al viewport iniziale,
      // probabilmente è zoom manuale - ignora il ricalcolo
      if (initialViewportRef.current) {
        const widthDiff = Math.abs(currentWidth - initialViewportRef.current.width) / initialViewportRef.current.width;
        const heightDiff = Math.abs(currentHeight - initialViewportRef.current.height) / initialViewportRef.current.height;

        // Se la differenza è > 10% ma il rapporto aspect è simile, è zoom - ignora
        if ((widthDiff > 0.1 || heightDiff > 0.1)
          && Math.abs((currentWidth / currentHeight) - (initialViewportRef.current.width / initialViewportRef.current.height)) < 0.1) {
          return;
        }
      }

      // Design diversi per breakpoint
      let baseWidth, baseHeight, currentBreakpoint: 'mobile' | 'tablet' | 'desktop';

      if (currentWidth < 768) {
        baseWidth = 375;
        baseHeight = 800;
        currentBreakpoint = 'mobile';
      } else if (currentWidth < 1024) {
        baseWidth = 1024;
        baseHeight = 768;
        currentBreakpoint = 'tablet';
      } else {
        baseWidth = 1920;
        baseHeight = 1080;
        currentBreakpoint = 'desktop';
      }

      const scaleX = currentWidth / baseWidth;
      const scaleY = currentHeight / baseHeight;
      const newScale = Math.max(scaleX, scaleY);

      // Update refs
      scaleRef.current = newScale;
      const breakpointChanged = breakpointRef.current !== currentBreakpoint;
      breakpointRef.current = currentBreakpoint;

      // Force re-render solo se necessario
      if (breakpointChanged || !isReady) {
        forceUpdate(prev => prev + 1);
      }

      // Marca come pronto solo dopo il primo calcolo
      if (!isReady) {
        setIsReady(true);

        // ✅ OPTIMIZATION 10: Performance monitoring
        if (typeof performance !== 'undefined') {
          performance.mark('hero-ready');
          try {
            performance.measure('hero-load', 'navigationStart', 'hero-ready');
          } catch {
            // Ignore if navigationStart doesn't exist
          }
        }
      }
    };

    // RAF throttling wrapper
    const updateScaleThrottled = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          updateScale();
          rafIdRef.current = null;
        });
      }
    };

    // Handler per reset del viewport di riferimento (rotazione device, etc.)
    const handleOrientationChange = () => {
      const timeoutId = setTimeout(() => {
        initialViewportRef.current = null;
        updateScaleThrottled();
      }, 100);
      return () => clearTimeout(timeoutId);
    };

    updateScale();

    window.addEventListener('resize', updateScaleThrottled);
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateScaleThrottled);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('resize', updateScaleThrottled);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateScaleThrottled);
      }
    };
  }, [isReady]);

  // ✅ OPTIMIZATION 7: DRY parallax function
  const createParallax = useCallback((
    targetRef: React.RefObject<HTMLElement | HTMLImageElement | null>,
    amount: number,
    tweenRef: React.MutableRefObject<gsap.core.Tween | null>,
  ) => {
    if (!isReady || !targetRef.current || !containerRef.current) {
      return;
    }

    tweenRef.current = gsap.to(targetRef.current, {
      y: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      if (tweenRef.current) {
        try {
          if (tweenRef.current.scrollTrigger) {
            tweenRef.current.scrollTrigger.kill();
          }
          tweenRef.current.kill();
          tweenRef.current = null;
        } catch {
          // Silently ignore if already killed
        }
      }
    };
  }, [isReady]);

  // Animazioni quando la pagina è pronta - usando useGSAP per cleanup automatico
  useGSAP(() => {
    if (!isReady) {
      return;
    }
    if (!sposiRef.current || !cloudRef.current || (!titleDesktopRef.current && !titleMobileRef.current) || !signatureRef.current || !contactRef.current || !logoRef.current) {
      return;
    }

    const breakpoint = breakpointRef.current;

    // === NUVOLA E SPOSI ===
    const sposiOriginalTransform = breakpoint === 'mobile'
      ? 'translate(15px, 60px)'
      : breakpoint === 'tablet'
        ? 'translate(10px, 70px)'
        : 'translate(20px, 100px)';

    gsap.set([cloudRef.current, sposiRef.current], {
      opacity: 1,
      filter: 'blur(0px)',
    });

    gsap.set(sposiRef.current, {
      transform: sposiOriginalTransform,
    });

    // === SIGNATURE, CONTACT E LOGO ===
    gsap.set([signatureRef.current, contactRef.current, logoRef.current], {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(6px)',
      willChange: 'opacity, transform, filter',
    });

    // === TITOLO ===
    const activeTitle = titleDesktopRef.current || titleMobileRef.current;
    if (activeTitle) {
      gsap.set(activeTitle, {
        opacity: 0,
        y: '40vh',
        willChange: 'opacity, transform',
      });
    }

    // ✅ OPTIMIZATION 6: Timeline defaults
    tl.current = gsap.timeline({
      defaults: {
        duration: 2.0,
        ease: 'power4.out',
      },
      delay: 0.2,
      onComplete: () => {
        gsap.set([signatureRef.current, contactRef.current, logoRef.current, activeTitle], {
          willChange: 'auto',
        });
      },
    });

    // Signature, contact e logo appaiono insieme
    tl.current.set([signatureRef.current, contactRef.current, logoRef.current], {
      opacity: 1,
    })
      .to([signatureRef.current, contactRef.current, logoRef.current], {
        scale: 1,
        filter: 'blur(0px)',
      }, '+=0')
      .to(activeTitle, {
        y: 0,
        opacity: 1,
        duration: 1.8,
        ease: 'power1.out',
      }, 0);

    return () => {
      if (tl.current) {
        try {
          tl.current.kill();
          tl.current = undefined;
        } catch {
          // Silently ignore if already killed
        }
      }
    };
  }, {
    dependencies: [isReady, breakpointRef.current, mountKey],
    scope: containerRef,
    revertOnUpdate: true,
  });

  // Parallax effect - sposi
  useGSAP(() => {
    const parallaxAmount = breakpointRef.current === 'mobile' ? -50 : -150;
    return createParallax(sposiRef, parallaxAmount, sposiParallaxRef);
  }, {
    dependencies: [isReady, breakpointRef.current, mountKey, createParallax],
    scope: containerRef,
    revertOnUpdate: true,
  });

  // Parallax effect - nuvola
  useGSAP(() => {
    const parallaxAmount = breakpointRef.current === 'mobile' ? 50 : 150;
    return createParallax(cloudRef, parallaxAmount, cloudParallaxRef);
  }, {
    dependencies: [isReady, breakpointRef.current, mountKey, createParallax],
    scope: containerRef,
    revertOnUpdate: true,
  });

  const { width: baseWidth, height: baseHeight } = baseDimensions;
  const scale = scaleRef.current;
  const breakpoint = breakpointRef.current;

  return (
    <section
      ref={containerRef}
      data-section="hero"
      className="w-screen h-screen overflow-hidden relative"
      style={{
        margin: '0 !important',
        padding: '0 !important',
        marginLeft: '0 !important',
        marginRight: '0 !important',
        position: 'relative',
        opacity: isReady ? 1 : 0,
        transition: isReady ? 'opacity 0.3s ease-out' : 'none',
      }}
    >
      {/* Signature - fisso nella hero section */}
      <div
        ref={signatureRef}
        className="absolute z-30"
        style={{
          top: '16px',
          left: '24px',
          opacity: 0,
        }}
      >
        <p className="text-white" style={{ lineHeight: '0.9' }}>
          <span style={{
            fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '15px' : '16px',
            opacity: 1,
            fontWeight: 'bold',
          }}
          >
            Lorenzo Saini
          </span>
          <br />
          <span style={{
            fontSize: breakpoint === 'mobile' ? '11px' : breakpoint === 'tablet' ? '13px' : '14px',
            opacity: 0.6,
            fontStyle: 'italic',
            transform: 'skew(-8deg)',
            display: 'inline-block',
            marginTop: '4px',
          }}
          >
            Photographer
          </span>
          <br />
          <span style={{
            fontSize: breakpoint === 'mobile' ? '11px' : breakpoint === 'tablet' ? '13px' : '14px',
            opacity: 0.6,
            fontStyle: 'italic',
            transform: 'skew(-8deg)',
            display: 'inline-block',
          }}
          >
            Videomaker
          </span>
        </p>
      </div>

      {/* Contact button - fisso nella hero section */}
      <div
        ref={contactRef}
        className="absolute z-30"
        style={{
          top: '16px',
          right: '24px',
          opacity: 0,
        }}
      >
        <button
          type="button"
          className="bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          style={{
            padding: breakpoint === 'mobile' ? '6px 12px' : breakpoint === 'tablet' ? '8px 16px' : '12px 24px',
            fontSize: breakpoint === 'mobile' ? '10px' : breakpoint === 'tablet' ? '12px' : '14px',
          }}
        >
          Contact
        </button>
      </div>

      {/* Logo bianco - centrato in alto sulla stessa linea di signature e contact */}
      <div
        ref={logoRef}
        className="absolute z-30"
        style={{
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
        }}
      >
        <Image
          src="/assets/images/LogoBianco.webp"
          alt="Lorenzo Saini Logo"
          width={breakpoint === 'mobile' ? 40 : breakpoint === 'tablet' ? 50 : 60}
          height={breakpoint === 'mobile' ? 40 : breakpoint === 'tablet' ? 50 : 60}
          quality={90}
          className="object-contain"
        />
      </div>

      {/* Background Image - LCP optimized */}
      <div
        className="absolute"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale * 1.02})`,
          transformOrigin: 'center center',
          left: '50%',
          top: '50%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
          overflow: 'visible',
          zIndex: 1,
        }}
      >
        <Image
          src="/assets/images/background.webp"
          alt="Background"
          fill
          priority
          fetchPriority="high"
          quality={75}
          onLoad={handleResourceLoad('hero-bg')}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Container separato per sposi e nuvola - scala insieme */}
      <div
        className="absolute"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale * 1.02})`,
          transformOrigin: 'center center',
          left: '50%',
          top: '54%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
          overflow: 'visible',
          zIndex: 5,
        }}
      >
        {/* Contenitore per nuvola - dimensioni controllate per breakpoint */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            overflow: 'visible',
          }}
        >
          {/* Cloud layer */}
          <Image
            ref={cloudRef}
            src="/assets/images/cloud.webp"
            alt="Clouds"
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 760px) 70vw, 100vw"
            priority
            quality={85}
            onLoad={handleResourceLoad('hero-cloud')}
            className="object-contain"
            style={{
              zIndex: 1,
              transform: breakpoint === 'mobile' ? 'scale(1.5)' : breakpoint === 'tablet' ? 'scale(1.3)' : 'scale(0.55)',
            }}
          />
        </div>

        {/* Contenitore separato per sposi - dimensioni indipendenti */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            overflow: 'visible',
          }}
        >
          {/* Sposi - posizione diversa per breakpoint */}
          <Image
            ref={sposiRef}
            src="/assets/images/sposi-original.webp"
            alt="Couple"
            width={650}
            height={800}
            priority
            quality={80}
            onLoad={handleResourceLoad('hero-sposi')}
            style={{
              width: breakpoint === 'mobile' ? '450px' : breakpoint === 'tablet' ? '550px' : '800px',
              height: 'auto',
              transform: breakpoint === 'mobile'
                ? 'translate(15px, 60px)'
                : breakpoint === 'tablet'
                  ? 'translate(10px, 70px)'
                  : 'translate(20px, 100px)',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              zIndex: 10,
              position: 'relative',
            }}
          />
        </div>
      </div>

      {/* Container separato per titolo mobile */}
      <div
        className="absolute"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale * 1.02})`,
          transformOrigin: 'center center',
          left: '50%',
          top: '50%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
          overflow: 'visible',
          zIndex: 3,
        }}
      >
        {/* Titolo mobile - dentro il contenitore scalato */}
        {breakpoint === 'mobile' && (
          <div
            className="absolute inset-x-0"
            style={{
              paddingTop: '150px',
              zIndex: 5,
            }}
          >
            <div ref={titleMobileRef} style={{ opacity: 0 }}>
              <FocusFrame
                borderColor="white"
                blurAmount={20}
                animationDuration={1.8}
                delay={0.3}
              >
                <h1
                  className="font-bold text-white leading-none text-center tracking-normal"
                  style={{
                    fontFamily: '\'Bacasime Antique\', serif',
                    fontSize: '55px',
                    lineHeight: '0.9',
                  }}
                >
                  LORENZO SAINI'S ART
                </h1>
              </FocusFrame>
            </div>
          </div>
        )}
      </div>

      {/* Container per overlay gradient - scala insieme */}
      <div
        className="absolute"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale * 1.02})`,
          transformOrigin: 'center center',
          left: '50%',
          top: '50%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
          overflow: 'visible',
          zIndex: 100,
        }}
      >
        {/* Overlay gradient at bottom with progressive blur */}
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            height: breakpoint === 'desktop' ? '500px' : '384px',
            width: `${baseWidth}px`,
            left: '50%',
            marginLeft: `-${baseWidth / 2}px`,
          }}
        >
          {/* Base gradient layer */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, white 0%, white 35%, rgba(255,255,255,0.995) 40%, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,0.75) 62%, rgba(255,255,255,0.58) 70%, rgba(255,255,255,0.38) 78%, rgba(255,255,255,0.22) 86%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.04) 96%, transparent 100%)',
            }}
          />

          {breakpoint === 'mobile'
            ? (
                <>
                  {/* Mobile: 9 layer blur originali */}
                  {/* Layer 1 - blur più intenso alla base */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '60px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)',
                      backdropFilter: 'blur(20px)',
                    }}
                  />

                  {/* Layer 2 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '100px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 80%, transparent 100%)',
                      backdropFilter: 'blur(16px)',
                    }}
                  />

                  {/* Layer 3 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '140px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0.02) 90%, transparent 100%)',
                      backdropFilter: 'blur(12px)',
                    }}
                  />

                  {/* Layer 4 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '180px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(255,255,255,0.015) 85%, rgba(255,255,255,0.005) 95%, transparent 100%)',
                      backdropFilter: 'blur(9px)',
                    }}
                  />

                  {/* Layer 5 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '220px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.055) 30%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.012) 80%, rgba(255,255,255,0.004) 92%, transparent 100%)',
                      backdropFilter: 'blur(6px)',
                    }}
                  />

                  {/* Layer 6 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '260px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.035) 25%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.008) 75%, rgba(255,255,255,0.003) 88%, rgba(255,255,255,0.001) 96%, transparent 100%)',
                      backdropFilter: 'blur(4px)',
                    }}
                  />

                  {/* Layer 7 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '300px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.005) 70%, rgba(255,255,255,0.002) 85%, rgba(255,255,255,0.0008) 94%, transparent 100%)',
                      backdropFilter: 'blur(2.5px)',
                    }}
                  />

                  {/* Layer 8 */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '340px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.012) 15%, rgba(255,255,255,0.007) 45%, rgba(255,255,255,0.003) 65%, rgba(255,255,255,0.001) 80%, rgba(255,255,255,0.0004) 92%, transparent 100%)',
                      backdropFilter: 'blur(1.5px)',
                    }}
                  />

                  {/* Layer 9 - finale molto sottile */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '384px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.006) 10%, rgba(255,255,255,0.003) 40%, rgba(255,255,255,0.0015) 60%, rgba(255,255,255,0.0006) 75%, rgba(255,255,255,0.0002) 88%, rgba(255,255,255,0.0001) 96%, transparent 100%)',
                      backdropFilter: 'blur(0.8px)',
                    }}
                  />
                </>
              )
            : (
                <>
                  {/* Desktop/Tablet: 3 layer ottimizzati */}
                  {/* Heavy blur layer (combines old layers 1-3) */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '140px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.12) 75%, transparent 100%)',
                      backdropFilter: 'blur(28px)',
                    }}
                  />

                  {/* Medium blur layer (combines old layers 4-6) */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '260px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.065) 30%, rgba(255,255,255,0.025) 65%, rgba(255,255,255,0.008) 85%, transparent 100%)',
                      backdropFilter: 'blur(8px)',
                    }}
                  />

                  {/* Light blur layer (combines old layers 7-9) */}
                  <div
                    className="absolute bottom-0 inset-x-0"
                    style={{
                      height: '500px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.012) 25%, rgba(255,255,255,0.005) 55%, rgba(255,255,255,0.002) 75%, rgba(255,255,255,0.0005) 90%, transparent 100%)',
                      backdropFilter: 'blur(2px)',
                    }}
                  />
                </>
              )}
        </div>
      </div>

      {/* Titolo desktop e tablet - fisso nella sezione hero */}
      {(breakpoint === 'desktop' || breakpoint === 'tablet') && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            left: '3px',
            right: '3px',
            top: '0',
            bottom: '0',
            zIndex: 3,
            transform: breakpoint === 'desktop'
              ? 'translateY(-27vh)'
              : breakpoint === 'tablet'
                ? 'translateY(-25vh)'
                : 'translateY(-15vh)',
          }}
        >
          <div ref={titleDesktopRef} style={{ opacity: 0 }}>
            <FocusFrame
              borderColor="white"
              blurAmount={25}
              animationDuration={1.8}
              delay={0.3}
            >
              <h1
                className="font-bold text-white leading-tight tracking-normal text-center px-2"
                style={{
                  fontFamily: '\'Bacasime Antique\', serif',
                  fontSize: breakpoint === 'desktop'
                    ? 'min(calc((100vw - 32px) / 11.5), calc(100vh * 0.41))'
                    : 'min(calc((100vw - 40px) / 10), calc(100vh * 0.11))',
                  whiteSpace: breakpoint === 'desktop' ? 'nowrap' : 'normal',
                  lineHeight: breakpoint === 'desktop' ? 1 : 1.1,
                  maxWidth: '100%',
                }}
              >
                LORENZO SAINI'S ART
              </h1>
            </FocusFrame>
          </div>
        </div>
      )}
    </section>
  );
}
