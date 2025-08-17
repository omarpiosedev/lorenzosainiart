'use client';

import Image from 'next/image';
import { useRef } from 'react';
import PhilosophyText from '@/components/ui/PhilosophyText';

export default function Sez2() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef} data-section="sez2" className="relative bg-white" style={{ height: '400vh' }}>
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
        {/* Images are always visible */}
        <div
          className="absolute inset-0 flex items-center justify-center"
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
                src="/assets/images/image1.webp"
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
                src="/assets/images/image2.webp"
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
                          w-[93.75vw] h-[31.85vh] left-[3.25vw] top-[523px]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[30vw] lg:h-[35.56vh] lg:left-[29.58vw] lg:top-[673px]"
            >
              <Image
                src="/assets/images/image3.webp"
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

        {/* Third screen images */}
        <div
          className="absolute inset-0"
          style={{
            top: '200vh', // Start from the third screen
          }}
        >
          {/* Third screen layout with three images */}
          <div className="w-full h-full relative">
            {/* First image - Rectangle, bottom-left positioning */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[45vw] h-[16.18vh] left-[2.75vw] bottom-[109.9vh]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[16.61vw] lg:h-[20vh] lg:left-[21.67vw] lg:bottom-[980px]"
            >
              <Image
                src="/assets/images/3969d532-25ad-4012-82b6-a8da803fdab0_rw_38404170.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 180px, 180px"
                className="object-cover"
                quality={95}
                priority={false}
                loading="lazy"
              />
            </div>

            {/* Second image - Rectangle, bottom-right positioning */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[45vw] h-[16.18vh] right-[2.75vw] bottom-[109.9vh]
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:w-[21.2vw] lg:h-[28.15vh] lg:right-[17.71vw] lg:bottom-[980px]"
            >
              <Image
                src="/assets/images/b7195640-fdbe-4964-9b28-12ccc2afeee0_rw_3840d2f7.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 180px, 180px"
                className="object-cover"
                quality={95}
                priority={false}
                loading="lazy"
              />
            </div>

            {/* Third image - Mobile version */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Mobile (400x785 base) - proportional to viewport */
                          w-[94.5vw] h-[72.1vh] left-[2.75vw] bottom-[1.4vh]
                          /* Hidden on desktop */
                          lg:hidden"
            >
              <Image
                src="/assets/images/1d996cf4-ca34-428c-bf3b-b5b9a30bfa82_rw_1920e651 (1).webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 378px, 0px"
                className="object-cover"
                quality={95}
                priority={false}
                loading="lazy"
              />
            </div>

            {/* Third image - Desktop version */}
            <div className="absolute rounded-3xl overflow-hidden shadow-2xl
                          /* Hidden on mobile */
                          hidden
                          /* Desktop (1920x1080 base) - proportional to viewport */
                          lg:block lg:w-[70vw] lg:h-[50vh] lg:left-[15vw] lg:bottom-[200px]"
            >
              <Image
                src="/assets/images/1d996cf4-ca34-428c-bf3b-b5b9a30bfa82_rw_1920e651.webp"
                alt="Lorenzo Saini Photography"
                fill
                sizes="(max-width: 768px) 0px, 1164px"
                className="object-cover"
                quality={95}
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
