'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Register GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

type HeaderProps = {
  variant?: 'white' | 'black';
};

export default function Header({ variant = 'black' }: HeaderProps) {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [mountKey, setMountKey] = useState(0);

  // Refs per le animazioni
  const signatureRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | undefined>(undefined);

  // Incrementa mountKey ogni volta che il componente viene montato/visitato
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: forces GSAP animations to restart on mount
    setMountKey(prev => prev + 1);
  }, []);

  // Detect breakpoint
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  // Animazioni GSAP
  useGSAP(() => {
    if (!signatureRef.current || !contactRef.current || !logoRef.current) {
      return;
    }

    // Imposta stati iniziali
    gsap.set([signatureRef.current, contactRef.current, logoRef.current], {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(6px)',
      willChange: 'opacity, transform, filter',
    });

    // Timeline animazione
    tl.current = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        gsap.set([signatureRef.current, contactRef.current, logoRef.current], {
          willChange: 'auto',
        });
      },
    });

    tl.current.set([signatureRef.current, contactRef.current, logoRef.current], {
      opacity: 1,
    })
      .to([signatureRef.current, contactRef.current, logoRef.current], {
        scale: 1,
        filter: 'blur(0px)',
        duration: 2.0,
        ease: 'power4.out',
      }, '+=0');

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
    dependencies: [breakpoint, mountKey],
  });

  const textColor = variant === 'white' ? 'text-white' : 'text-black';
  const logoSrc = variant === 'white' ? '/assets/images/LogoBianco.webp' : '/assets/images/LogoNero.webp';
  const buttonBg = variant === 'white'
    ? 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'
    : 'bg-black/10 backdrop-blur-sm text-black border-black/20 hover:bg-black/20';

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* Signature - fisso nell'header */}
      <div
        ref={signatureRef}
        className="absolute z-30"
        style={{
          top: '16px',
          left: '24px',
          opacity: 0,
        }}
      >
        <p className={textColor} style={{ lineHeight: '0.9' }}>
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

      {/* Contact button - fisso nell'header */}
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
          className={`rounded-full border transition-colors ${buttonBg}`}
          style={{
            padding: breakpoint === 'mobile' ? '6px 12px' : breakpoint === 'tablet' ? '8px 16px' : '12px 24px',
            fontSize: breakpoint === 'mobile' ? '10px' : breakpoint === 'tablet' ? '12px' : '14px',
          }}
        >
          Contact
        </button>
      </div>

      {/* Logo - centrato in alto sulla stessa linea di signature e contact */}
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
          src={logoSrc}
          alt="Lorenzo Saini Logo"
          width={breakpoint === 'mobile' ? 40 : breakpoint === 'tablet' ? 50 : 60}
          height={breakpoint === 'mobile' ? 40 : breakpoint === 'tablet' ? 50 : 60}
          quality={90}
          className="object-contain"
        />
      </div>
    </header>
  );
}
