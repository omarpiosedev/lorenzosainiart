'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import PhilosophyText from '@/components/ui/PhilosophyText';

export default function Sez2() {
  const [showImages, setShowImages] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / sectionHeight));

        // Mostra le immagini quando si è scrollato almeno al 50% della sezione
        setShowImages(scrollProgress > 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} data-section="sez2" className="relative bg-white" style={{ height: '200vh' }}>
      {/* Top fade gradient for mobile */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-16 pointer-events-none z-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 80%, white 100%)',
          }}
        />
      </div>

      {/* Fixed background text content */}
      <PhilosophyText />

      {/* Content area for scrolling images */}
      <div className="absolute inset-0 z-20">
        {/* Images appear only in the second half of the section */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            showImages ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: '100vh', // Start from the second screen
          }}
        >
          {/* Three image layout - Responsive design */}
          <div className="w-full h-full relative">
            {/* First image - Square, responsive breakpoints */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[45vw] h-[22.93vh] top-[13.375vh] left-[3.25vw]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[19.17vw] lg:h-[34.07vh] lg:top-[10.83vh] lg:left-[17.29vw]"
            >
              <Image
                src="/assets/image1.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 45vw, 19.17vw"
                className="object-cover"
                quality={85}
                priority={false}
                loading="lazy"
              />
            </div>

            {/* Second image - Vertical rectangle, responsive breakpoints */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[43.75vw] h-[33.375vh] top-[2.93vh] right-[3.25vw]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[10.31vw] lg:h-[27.5vh] lg:top-[17.41vh] lg:right-[23.23vw]"
            >
              <Image
                src="/assets/image2.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 43.75vw, 10.31vw"
                className="object-cover"
                quality={85}
                priority={false}
                loading="lazy"
              />
            </div>

            {/* Third image - Horizontal rectangle, responsive breakpoints */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[93.75vw] h-[31.85vh] left-[3.25vw] bottom-[1.66vh]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[30vw] lg:h-[35.56vh] lg:left-[29.58vw] lg:bottom-[2.13vh]"
            >
              <Image
                src="/assets/image3.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 93.75vw, 30vw"
                className="object-cover"
                quality={85}
                priority={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
