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

        {/* Sposi - posizione diversa per breakpoint con clipping preciso */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            overflow: 'hidden',
            clipPath: 'inset(0)',
          }}
        >
          <img
            src="/assets/images/sposi.png"
            alt="Couple"
            style={{
              width: breakpoint === 'mobile' ? '375px' : breakpoint === 'tablet' ? '450px' : '600px',
              height: 'auto',
              transform: breakpoint === 'mobile'
                ? 'translate(15px, 20px)'
                : breakpoint === 'tablet'
                  ? 'translate(10px, 30px)'
                  : 'translate(20px, 40px)',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
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
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '60px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)',
              backdropFilter: 'blur(20px)',
            }}
          />

          {/* Layer 2 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '100px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 80%, transparent 100%)',
              backdropFilter: 'blur(16px)',
            }}
          />

          {/* Layer 3 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '140px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0.02) 90%, transparent 100%)',
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Layer 4 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '180px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(255,255,255,0.015) 85%, rgba(255,255,255,0.005) 95%, transparent 100%)',
              backdropFilter: 'blur(9px)',
            }}
          />

          {/* Layer 5 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '220px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.055) 30%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.012) 80%, rgba(255,255,255,0.004) 92%, transparent 100%)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Layer 6 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '260px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.035) 25%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.008) 75%, rgba(255,255,255,0.003) 88%, rgba(255,255,255,0.001) 96%, transparent 100%)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Layer 7 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '300px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.005) 70%, rgba(255,255,255,0.002) 85%, rgba(255,255,255,0.0008) 94%, transparent 100%)',
              backdropFilter: 'blur(2.5px)',
            }}
          />

          {/* Layer 8 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '340px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.012) 15%, rgba(255,255,255,0.007) 45%, rgba(255,255,255,0.003) 65%, rgba(255,255,255,0.001) 80%, rgba(255,255,255,0.0004) 92%, transparent 100%)',
              backdropFilter: 'blur(1.5px)',
            }}
          />

          {/* Layer 9 - finale molto sottile */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '384px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.006) 10%, rgba(255,255,255,0.003) 40%, rgba(255,255,255,0.0015) 60%, rgba(255,255,255,0.0006) 75%, rgba(255,255,255,0.0002) 88%, rgba(255,255,255,0.0001) 96%, transparent 100%)',
              backdropFilter: 'blur(0.8px)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
