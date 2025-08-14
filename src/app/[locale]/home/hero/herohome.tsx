'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function HeroHome() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const resizeText = () => {
      const textElement = textRef.current;
      if (!textElement) return;
      
      const container = textElement.parentElement;
      if (!container) return;
      
      const containerWidth = container.offsetWidth - 32; // padding
      const isMobile = window.innerWidth < 768;
      let fontSize = isMobile ? 300 : 500;
      
      textElement.style.fontSize = `${fontSize}px`;
      
      while (textElement.scrollWidth > containerWidth && fontSize > 20) {
        fontSize -= 2;
        textElement.style.fontSize = `${fontSize}px`;
      }
    };

    // Delay to ensure font is loaded
    setTimeout(() => {
      resizeText();
    }, 100);
    
    resizeText();
    window.addEventListener('resize', resizeText);
    
    return () => window.removeEventListener('resize', resizeText);
  }, []);

  return (
    <>
      <style>{`
        @media (min-width: 2560px) {
          .hero-image-2k {
            scale: 1.2 !important;
            max-width: 90rem !important;
          }
        }
      `}</style>
      <div className="relative w-full h-screen overflow-hidden flex justify-center items-end">
      {/* Sfondo background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
        style={{
          backgroundImage: 'url(/assets/images/new-background.jpg)',
        }}
      />

      {/* Copia Sharp - parte alta nitida */}
      <Image
        src="/assets/images/center-image.png"
        alt="Centro nitido"
        width={2000}
        height={1000}
        className="absolute bottom-40 sm:bottom-0 left-1/2 transform -translate-x-1/2 w-screen scale-200 sm:scale-100 sm:w-full sm:max-w-6xl h-auto object-contain z-20 hero-image-2k"
        style={{
          maskImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) 40%,
            rgba(0,0,0,0.8) 50%,
            rgba(0,0,0,0.4) 65%,
            rgba(0,0,0,0.1) 80%,
            rgba(0,0,0,0) 100%
          )`,
          WebkitMaskImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) 40%,
            rgba(0,0,0,0.8) 50%,
            rgba(0,0,0,0.4) 65%,
            rgba(0,0,0,0.1) 80%,
            rgba(0,0,0,0) 100%
          )`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />


      {/* Testo "LORENZOSAINI'S ART" sopra al background */}
      <div className="absolute inset-0 flex items-start justify-center pt-40 z-15 pointer-events-none px-4">
        <h1 
          ref={textRef}
          className="text-white text-center leading-none whitespace-nowrap md:whitespace-nowrap"
          style={{
            fontFamily: 'Lavener, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          <span className="block md:inline">LORENZO</span>
          <span className="block md:inline md:ml-4 whitespace-nowrap">SAINI'S ART</span>
        </h1>
      </div>

      {/* Dissolvenza finale verso bianco */}
      <div
        className="absolute bottom-0 left-0 w-full h-2/5 z-30 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.3) 30%,
            rgba(255,255,255,0.6) 60%,
            rgba(255,255,255,0.9) 85%,
            rgba(255,255,255,1) 100%
          )`,
        }}
      />
    </div>
    </>
  );
}
