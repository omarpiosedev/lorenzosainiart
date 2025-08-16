'use client';

import { useEffect, useState } from 'react';

export default function HeroHome() {
  const [scale, setScale] = useState(1);
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScale = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

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
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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
    <section className="w-screen h-screen overflow-hidden relative">
      {/* Signature e Button - fuori dal contenitore scalato */}
      <div className="absolute top-4 left-4 z-20">
        <p
          className="text-white leading-tight"
        >
          <span style={{
            fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '15px' : '16px',
            opacity: 1,
          }}
          >
            Lorenzo Saini
          </span>
          <br />
          <span style={{
            fontSize: breakpoint === 'mobile' ? '11px' : breakpoint === 'tablet' ? '13px' : '14px',
            opacity: 0.6,
          }}
          >
            Photographer
          </span>
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20">
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

      <div
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/images/new-background.jpg)',
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          left: '50%',
          top: '50%',
          marginLeft: `-${baseWidth / 2}px`,
          marginTop: `-${baseHeight / 2}px`,
        }}
      >
        {/* Cloud layer */}
        <div className="absolute inset-0 z-2 flex items-center justify-center overflow-hidden">
          <img
            src="/assets/images/cloud-layer.png"
            alt="Clouds"
            className="w-full h-auto object-cover scale-125"
          />
        </div>

        {/* Sposi - posizione diversa per breakpoint */}
        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
          <img
            src="/assets/images/sposi.png"
            alt="Couple"
            style={{
              width: breakpoint === 'mobile' ? '375px' : breakpoint === 'tablet' ? '450px' : '600px', // Mobile: full width
              height: 'auto',
              transform: breakpoint === 'mobile'
                ? 'translate(15px, 20px)' // Mobile: poco a destra, più in alto
                : breakpoint === 'tablet'
                  ? 'translate(10px, 30px)'
                  : 'translate(20px, 40px)',
            }}
          />
        </div>

        {/* Titolo - dimensioni e posizione diverse */}
        <div
          className={`absolute z-5 ${breakpoint === 'mobile' ? 'inset-x-0' : 'inset-0 flex items-start justify-center'}`}
          style={{
            paddingTop: breakpoint === 'mobile' ? '150px' : breakpoint === 'tablet' ? '150px' : '200px',
          }}
        >
          <h1
            className="font-bold text-white leading-none text-center tracking-wider"
            style={{
              fontFamily: 'Lavener',
              fontSize: breakpoint === 'mobile' ? '60px' : breakpoint === 'tablet' ? '72px' : '96px', // Mobile: ancora più grande
              lineHeight: breakpoint === 'mobile' ? '0.9' : 'normal', // Mobile: più compatto
              width: breakpoint === 'mobile' ? '100%' : 'auto', // Mobile: full width reale
            }}
          >
            LORENZO
            <br />
            SAINI'S ART
          </h1>
        </div>

        {/* Overlay gradient at bottom with progressive blur */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
          style={{ height: '384px' }}
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, white 0%, white 18%, rgba(255,255,255,0.98) 25%, rgba(255,255,255,0.92) 32%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0.5) 58%, rgba(255,255,255,0.35) 68%, rgba(255,255,255,0.2) 78%, rgba(255,255,255,0.1) 88%, rgba(255,255,255,0.05) 95%, transparent 100%)',
            }}
          >
          </div>

          {/* Progressive blur layers */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '80px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '160px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)',
              backdropFilter: 'blur(18px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '288px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 65%, rgba(255,255,255,0.02) 80%, rgba(255,255,255,0.005) 92%, transparent 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '320px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.01) 75%, rgba(255,255,255,0.003) 88%, rgba(255,255,255,0.001) 96%, transparent 100%)',
              backdropFilter: 'blur(4px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '384px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.018) 40%, rgba(255,255,255,0.01) 55%, rgba(255,255,255,0.005) 70%, rgba(255,255,255,0.002) 82%, rgba(255,255,255,0.0008) 90%, rgba(255,255,255,0.0003) 96%, transparent 100%)',
              backdropFilter: 'blur(2px)',
            }}
          >
          </div>
        </div>
      </div>
    </section>
  );
}
