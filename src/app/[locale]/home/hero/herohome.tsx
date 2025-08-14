'use client';

import Image from 'next/image';

export default function HeroHome() {
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
