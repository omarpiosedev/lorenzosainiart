'use client';

import { gsap } from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function HeroHome() {
  const [scale, setScale] = useState(1);
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [initialViewport, setInitialViewport] = useState<{ width: number; height: number } | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Refs per le animazioni
  const sposiRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);
  const titleDesktopRef = useRef<HTMLHeadingElement>(null);
  const titleMobileRef = useRef<HTMLHeadingElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      // Ottieni dimensioni del viewport
      const viewport = window.visualViewport;
      const currentWidth = viewport ? viewport.width : window.innerWidth;
      const currentHeight = viewport ? viewport.height : window.innerHeight;

      // Inizializza viewport di riferimento alla prima esecuzione
      if (!initialViewport) {
        setInitialViewport({ width: currentWidth, height: currentHeight });
      }

      // Se c'è una differenza significativa rispetto al viewport iniziale,
      // probabilmente è zoom manuale - ignora il ricalcolo
      if (initialViewport) {
        const widthDiff = Math.abs(currentWidth - initialViewport.width) / initialViewport.width;
        const heightDiff = Math.abs(currentHeight - initialViewport.height) / initialViewport.height;

        // Se la differenza è > 10% ma il rapporto aspect è simile, è zoom - ignora
        if ((widthDiff > 0.1 || heightDiff > 0.1)
          && Math.abs((currentWidth / currentHeight) - (initialViewport.width / initialViewport.height)) < 0.1) {
          return; // Non aggiornare lo scaling
        }
      }

      // Design diversi per breakpoint
      let baseWidth, baseHeight, currentBreakpoint;

      if (currentWidth < 768) {
        // Mobile: design verticale ottimizzato
        baseWidth = 375; // iPhone standard width
        baseHeight = 800; // Altezza ottimizzata per mobile
        currentBreakpoint = 'mobile';
      } else if (currentWidth < 1024) {
        // Tablet: design intermedio
        baseWidth = 1024;
        baseHeight = 768;
        currentBreakpoint = 'tablet';
      } else {
        // Desktop: design orizzontale
        baseWidth = 1920;
        baseHeight = 1080;
        currentBreakpoint = 'desktop';
      }

      const scaleX = currentWidth / baseWidth;
      const scaleY = currentHeight / baseHeight;
      const newScale = Math.max(scaleX, scaleY);

      setScale(newScale);
      setBreakpoint(currentBreakpoint as 'mobile' | 'tablet' | 'desktop');

      // Marca come pronto solo dopo il primo calcolo
      if (!isReady) {
        setIsReady(true);
      }
    };

    // Handler per reset del viewport di riferimento (rotazione device, etc.)
    const handleOrientationChange = () => {
      setTimeout(() => {
        setInitialViewport(null); // Reset per permettere nuovo calcolo
        updateScale();
      }, 100); // Piccolo delay per stabilizzazione
    };

    updateScale();

    // Ascolta i resize del window e del visualViewport
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateScale);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateScale);
      }
    };
  }, [initialViewport]);

  // Animazioni quando la pagina è pronta
  useEffect(() => {
    if (isReady && sposiRef.current && cloudRef.current && (titleDesktopRef.current || titleMobileRef.current) && signatureRef.current && contactRef.current) {
      // === NUVOLA ===
      // Trasformazione originale della nuvola per breakpoint
      const cloudOriginalTransform = breakpoint === 'desktop' ? 'scale(0.5)' : breakpoint === 'tablet' ? 'scale(0.6)' : 'scale(1.25)';

      // Posizione iniziale nuvola (dall'alto)
      const cloudStartTransform = breakpoint === 'desktop'
        ? 'scale(0.5) translateY(-200px)'
        : breakpoint === 'tablet'
          ? 'scale(0.6) translateY(-200px)'
          : 'scale(1.25) translateY(-200px)';

      gsap.set(cloudRef.current, {
        transform: cloudStartTransform,
        filter: 'blur(8px)', // Blur iniziale
      });

      // === SPOSI ===
      // Trasformazione originale degli sposi per breakpoint
      const sposiOriginalTransform = breakpoint === 'mobile'
        ? 'translate(15px, 20px)'
        : breakpoint === 'tablet'
          ? 'translate(10px, 30px)'
          : 'translate(20px, 60px)';

      // Posizione iniziale sposi (dal basso)
      const sposiStartTransform = breakpoint === 'mobile'
        ? 'translate(15px, 220px)' // 20px + 200px
        : breakpoint === 'tablet'
          ? 'translate(10px, 230px)' // 30px + 200px
          : 'translate(20px, 260px)'; // 60px + 200px

      gsap.set(sposiRef.current, {
        transform: sposiStartTransform,
        filter: 'blur(8px)', // Blur iniziale
      });

      // === SIGNATURE E CONTACT ===
      // Impostano stati iniziali per signature e contact
      gsap.set([signatureRef.current, contactRef.current], {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(6px)',
      });

      // === TITOLO ===
      // Imposta stato iniziale del titolo
      const activeTitle = titleDesktopRef.current || titleMobileRef.current;
      if (activeTitle) {
        gsap.set(activeTitle, {
          opacity: 0,
          scale: 0.6,
          filter: 'blur(10px)',
          y: 50, // Parte leggermente dal basso
        });
      }

      // === TIMELINE CINEMATOGRAFICA ===
      const tl = gsap.timeline({ delay: 0.2 });

      // Nuvola, sposi, signature e contact appaiono insieme
      tl.set([cloudRef.current, sposiRef.current, signatureRef.current, contactRef.current], {
        opacity: 1, // Appaiono istantaneamente insieme
      })
        .to(cloudRef.current, {
          transform: cloudOriginalTransform,
          filter: 'blur(0px)', // Blur si dissolve
          duration: 2.0,
          ease: 'power4.out',
        }, '+=0')
        .to(sposiRef.current, {
          transform: sposiOriginalTransform,
          filter: 'blur(0px)', // Blur si dissolve
          duration: 2.0, // Stessa durata per sincronizzazione perfetta
          ease: 'power4.out',
        }, '<') // "<" significa che inizia esattamente insieme al precedente

        // Signature e contact si animano insieme alle immagini
        .to([signatureRef.current, contactRef.current], {
          scale: 1,
          filter: 'blur(0px)',
          duration: 2.0,
          ease: 'power4.out',
        }, '<') // Iniziano insieme alle immagini

        // === TITOLO - Appare dopo con effetto cinematografico ===
        .to(activeTitle, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.8, // Durata più lunga per effetto drammatico
          ease: 'power3.out',
        }, '-=1.2'); // Inizia 1.2s prima che finiscano nuvola e sposi (più presto)
    }
  }, [isReady, breakpoint]);

  // Ottieni dimensioni base del breakpoint corrente
  const getBaseDimensions = () => {
    switch (breakpoint) {
      case 'mobile':
        return { width: 375, height: 800 };
      case 'tablet':
        return { width: 1024, height: 768 };
      default:
        return { width: 1920, height: 1080 };
    }
  };

  const { width: baseWidth, height: baseHeight } = getBaseDimensions();

  return (
    <section
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
          left: '24px', // Spostata leggermente verso il centro
          opacity: 0, // Nascosta inizialmente
        }}
      >
        <p className="text-white" style={{ lineHeight: '0.9' }}>
          <span style={{
            fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '15px' : '16px',
            opacity: 1, // Massima opacità
            fontWeight: 'bold',
          }}
          >
            Lorenzo Saini
          </span>
          <br />
          <span style={{
            fontSize: breakpoint === 'mobile' ? '11px' : breakpoint === 'tablet' ? '13px' : '14px',
            opacity: 0.6,
            fontStyle: 'italic', // Font in diagonale (corsivo)
            transform: 'skew(-8deg)', // Leggera inclinazione diagonale
            display: 'inline-block',
            marginTop: '4px', // Spazio extra sopra Photographer
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
          <br />
          <span style={{
            fontSize: breakpoint === 'mobile' ? '11px' : breakpoint === 'tablet' ? '13px' : '14px',
            opacity: 0.6,
            fontStyle: 'italic',
            transform: 'skew(-8deg)',
            display: 'inline-block',
          }}
          >
            Designer
          </span>
        </p>
      </div>

      {/* Contact button - fisso nella hero section */}
      <div
        ref={contactRef}
        className="absolute z-30"
        style={{
          top: '16px',
          right: '24px', // Spostato leggermente verso il centro
          opacity: 0, // Nascosto inizialmente
        }}
      >
        <button
          className="bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          style={{
            padding: breakpoint === 'mobile' ? '6px 12px' : breakpoint === 'tablet' ? '8px 16px' : '12px 24px',
            fontSize: breakpoint === 'mobile' ? '10px' : breakpoint === 'tablet' ? '12px' : '14px',
          }}
        >
          Contact
        </button>
      </div>

      {/* Container solo per background */}
      <div
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/images/backgropund.webp)',
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
          top: '50%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
          overflow: 'visible',
          zIndex: 5,
        }}
      >
        {/* Contenitore per nuvola e sposi */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            overflow: 'hidden',
            clipPath: 'inset(0)',
          }}
        >
          {/* Cloud layer */}
          <Image
            ref={cloudRef}
            src="/assets/images/cloud.webp"
            alt="Clouds"
            width={1920}
            height={1080}
            loading="lazy"
            className="absolute w-full h-auto object-cover"
            style={{
              zIndex: 1,
              transform: breakpoint === 'desktop' ? 'scale(0.5)' : breakpoint === 'tablet' ? 'scale(0.6)' : 'scale(1.25)',
              opacity: 0, // Nascosta inizialmente
            }}
          />

          {/* Sposi - posizione diversa per breakpoint */}
          <Image
            ref={sposiRef}
            src="/assets/images/sposi.webp"
            alt="Couple"
            width={650}
            height={800}
            priority
            style={{
              width: breakpoint === 'mobile' ? '375px' : breakpoint === 'tablet' ? '450px' : '650px',
              height: 'auto',
              transform: breakpoint === 'mobile'
                ? 'translate(15px, 20px)'
                : breakpoint === 'tablet'
                  ? 'translate(10px, 30px)'
                  : 'translate(20px, 60px)',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              zIndex: 10,
              position: 'relative',
              opacity: 0, // Nascosti inizialmente
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
            <h1
              ref={titleMobileRef}
              className="font-bold text-white leading-none text-center tracking-wider"
              style={{
                fontFamily: 'Lavener',
                fontSize: '60px',
                lineHeight: '0.9',
                width: '100%',
                opacity: 0, // Nascosto inizialmente
              }}
            >
              LORENZO
              <br />
              SAINI'S ART
            </h1>
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
          {/* Base gradient - bianco molto più intenso all'inizio */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, white 0%, white 35%, rgba(255,255,255,0.995) 40%, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,0.75) 62%, rgba(255,255,255,0.58) 70%, rgba(255,255,255,0.38) 78%, rgba(255,255,255,0.22) 86%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.04) 96%, transparent 100%)',
            }}
          >
          </div>

          {/* Progressive blur layers - più graduali per effetto smooth */}
          {/* Layer 1 - blur più intenso alla base */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: breakpoint === 'desktop' ? '80px' : '60px',
              background: breakpoint === 'desktop'
                ? 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 60%, transparent 100%)'
                : 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)',
              backdropFilter: breakpoint === 'desktop' ? 'blur(30px)' : 'blur(20px)',
            }}
          />

          {/* Layer 2 */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: breakpoint === 'desktop' ? '130px' : '100px',
              background: breakpoint === 'desktop'
                ? 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)'
                : 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 80%, transparent 100%)',
              backdropFilter: breakpoint === 'desktop' ? 'blur(24px)' : 'blur(16px)',
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
              height: breakpoint === 'desktop' ? '500px' : '384px',
              background: breakpoint === 'desktop'
                ? 'linear-gradient(to top, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.015) 10%, rgba(255,255,255,0.008) 40%, rgba(255,255,255,0.004) 60%, rgba(255,255,255,0.0015) 75%, rgba(255,255,255,0.0005) 88%, rgba(255,255,255,0.0002) 96%, transparent 100%)'
                : 'linear-gradient(to top, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.006) 10%, rgba(255,255,255,0.003) 40%, rgba(255,255,255,0.0015) 60%, rgba(255,255,255,0.0006) 75%, rgba(255,255,255,0.0002) 88%, rgba(255,255,255,0.0001) 96%, transparent 100%)',
              backdropFilter: breakpoint === 'desktop' ? 'blur(1.5px)' : 'blur(0.8px)',
            }}
          />
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
          <h1
            ref={titleDesktopRef}
            className="font-bold text-white leading-none tracking-wider text-center"
            style={{
              fontFamily: 'Lavener',
              fontSize: breakpoint === 'desktop'
                ? 'min(calc((100vw - 32px) / 10), calc(100vh * 0.45))'
                : 'min(calc((100vw - 6px) / (19 * 0.52)), calc(100vh * 0.15))',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              overflow: 'hidden',
              maxWidth: '100vw',
              padding: '0 16px',
              boxSizing: 'border-box',
              opacity: 0, // Nascosto inizialmente
            }}
          >
            LORENZO SAINI'S ART
          </h1>
        </div>
      )}
    </section>
  );
}
