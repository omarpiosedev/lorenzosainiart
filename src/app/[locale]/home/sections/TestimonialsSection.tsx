'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { ShimmerLabel } from '@/components/ui';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

const testimonials = [
  {
    key: 'marco',
    image: '/assets/images/4831a354-4deb-472f-9f1e-cad013deab74.webp',
  },
  {
    key: 'sofia',
    image: '/assets/images/ChatGPT Image 19 ago 2025, 18_30_36.webp',
  },
  {
    key: 'alessandro',
    image: '/assets/images/ChatGPT Image 19 ago 2025, 18_30_41.webp',
  },
  {
    key: 'elena',
    image: '/assets/images/e05dd087-50aa-42dd-a47b-8eabbb6823e3.webp',
  },
  {
    key: 'luca',
    image: '/assets/images/f0137b66-fcfa-4e3d-8374-2b822059a091.webp',
  },
] as const;

// Componente TestimonialCard riutilizzabile
function TestimonialCard({
  testimonial,
  isMobile = false,
  t,
}: {
  testimonial: (typeof testimonials)[number];
  isMobile?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className={`bg-gray-100 rounded-2xl flex-shrink-0 flex flex-col ${
      isMobile ? 'p-4 mx-2 w-80 h-64' : 'p-8 mx-4 w-96 h-80'
    }`}
    >
      <div className="flex items-center mb-3">
        <img
          src={testimonial.image}
          alt={t(`testimonials.${testimonial.key}.name`)}
          className={`rounded-full object-cover mr-4 ${isMobile ? 'w-10 h-10' : 'w-16 h-16'}`}
        />
        <div className={`flex text-orange-500 ${isMobile ? 'text-base' : 'text-xl'}`}>
          ★★★★★
        </div>
      </div>
      <p className={`text-gray-800 leading-relaxed mb-4 flex-1 ${
        isMobile ? 'text-xs sm:text-sm' : 'text-base'
      }`}
      >
        {t(`testimonials.${testimonial.key}.text`)}
      </p>
      <div>
        <p className={`font-semibold text-black ${isMobile ? 'text-xs sm:text-sm' : 'text-base'}`}>
          {t(`testimonials.${testimonial.key}.name`)}
        </p>
        <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {t(`testimonials.${testimonial.key}.company`)}
        </p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations('HomePage.sez5');

  // Refs per marquee containers
  const marqueeDesktopRef = useRef<HTMLDivElement>(null);
  const marqueeMobileRef = useRef<HTMLDivElement>(null);

  // Refs per hover controls (optional)
  const { contextSafe } = useGSAP({ revertOnUpdate: true });

  // Setup GSAP marquee animations
  useGSAP(() => {
    // Desktop marquee
    if (marqueeDesktopRef.current) {
      const marqueeContainer = marqueeDesktopRef.current;
      const marqueeContent = marqueeContainer.querySelector('.marquee-content') as HTMLElement;

      if (marqueeContent) {
        // Calcola larghezza per loop seamless
        const contentWidth = marqueeContent.scrollWidth / 2; // Diviso 2 perché abbiamo duplicati

        // Crea animazione infinita
        gsap.to(marqueeContent, {
          x: -contentWidth,
          duration: 80, // 80 secondi come originale
          ease: 'none',
          repeat: -1, // Infinito
          modifiers: {
            x: gsap.utils.unitize(x => Number.parseFloat(x) % contentWidth), // Loop seamless
          },
        });
      }
    }

    // Mobile marquee
    if (marqueeMobileRef.current) {
      const marqueeContainer = marqueeMobileRef.current;
      const marqueeContent = marqueeContainer.querySelector('.marquee-content') as HTMLElement;

      if (marqueeContent) {
        // Calcola larghezza per loop seamless
        const contentWidth = marqueeContent.scrollWidth / 2;

        // Crea animazione infinita
        gsap.to(marqueeContent, {
          x: -contentWidth,
          duration: 60, // 60 secondi per mobile
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => Number.parseFloat(x) % contentWidth),
          },
        });
      }
    }
  }, {
    dependencies: [],
    revertOnUpdate: true, // Cleanup automatico
  });

  // Hover controls: pause on hover, resume on leave
  const handleMouseEnter = contextSafe(() => {
    gsap.to('.marquee-content', {
      timeScale: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to('.marquee-content', {
      timeScale: 1,
      duration: 0.3,
      ease: 'power2.in',
    });
  });

  return (
    <>
      <div data-section="testimonials" className="relative bg-white xl:min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden xl:block">
          {/* Testimonials Button - Proportional scaling */}
          <div
            className="absolute"
            style={{
              top: '9.72vh', // 105px / 1080px
              left: '50%',
              transform: 'translateX(-50%)', // Centrato orizzontalmente
              width: '5.73vw', // 110px / 1920px (stessa dimensione del pulsante benefits)
              height: '3.98vh', // 43px / 1080px (stessa dimensione del pulsante benefits)
            }}
          >
            <ShimmerLabel className="w-full h-full text-sm font-medium tracking-wide">
              {t('testimonialsLabel')}
            </ShimmerLabel>
          </div>

          {/* Title - Proportional scaling */}
          <div
            className="absolute"
            style={{
              top: '18.52vh', // 200px / 1080px
              left: '50%',
              transform: 'translateX(-50%)', // Centrato orizzontalmente
              width: 'auto',
              height: '8.33vh', // 90px / 1080px (stessa altezza del titolo sez4)
            }}
          >
            <h2
              className="font-bold text-black leading-tight text-center flex items-center justify-center w-full h-full whitespace-nowrap"
              style={{
                fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '3.33vw', // 64px / 1920px, stessa dimensione del titolo sez4
              }}
            >
              {t('title')}
            </h2>
          </div>

          {/* Subtitle - Proportional scaling */}
          <div
            className="absolute"
            style={{
              top: '30.65vh', // 331px / 1080px
              left: '50%',
              transform: 'translateX(-50%)', // Centrato orizzontalmente
              width: '28.02vw', // 538px / 1920px (stessa larghezza del sottotitolo sez4)
              height: '5.56vh', // 60px / 1080px (stessa altezza del sottotitolo sez4)
            }}
          >
            <p
              className="text-gray-800 leading-relaxed text-center flex items-center justify-center w-full h-full"
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '1.25vw', // Stessa dimensione del sottotitolo sez4
              }}
            >
              {t('subtitle')}
            </p>
          </div>

          {/* Marquee Component - Desktop */}
          <div
            className="absolute"
            style={{
              top: '50vh',
              left: '0',
              width: '100%', // ✅ Changed from 100vw to fix mobile horizontal scroll
              maxWidth: '100%',
              height: '380px',
            }}
          >
            <div
              ref={marqueeDesktopRef}
              className="relative w-full h-full overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="flex marquee-content"
                style={{
                  gap: '2rem',
                  width: 'fit-content',
                  willChange: 'transform', // GPU acceleration
                }}
              >
                {/* Prima serie di testimonial */}
                {testimonials.map(testimonial => (
                  <TestimonialCard key={testimonial.key} testimonial={testimonial} t={t} />
                ))}
                {/* Seconda serie per loop continuo */}
                {testimonials.map(testimonial => (
                  <TestimonialCard key={`${testimonial.key}-duplicate`} testimonial={testimonial} t={t} />
                ))}
              </div>

              {/* Left fade overlay - Desktop */}
              <div
                className="absolute left-0 top-0 w-24 h-full pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to right, white 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                }}
              />

              {/* Right fade overlay - Desktop */}
              <div
                className="absolute right-0 top-0 w-24 h-full pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet responsive layout */}
        <div className="xl:hidden px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
          <div className="flex flex-col items-center justify-start pt-24 sm:pt-32 lg:pt-40">

            {/* Testimonials Button - Mobile/Tablet */}
            <ShimmerLabel className="px-6 py-3 text-sm font-medium tracking-wide mb-8 sm:mb-12">
              {t('testimonialsLabel')}
            </ShimmerLabel>

            {/* Title - Mobile/Tablet */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight text-center mb-6 sm:mb-8 lg:mb-10"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('title')}
            </h2>

            {/* Subtitle - Mobile/Tablet */}
            <p
              className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed text-center max-w-2xl mx-auto mb-16 sm:mb-20 lg:mb-32"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('subtitle')}
            </p>

            {/* Marquee Component - Mobile/Tablet */}
            <div
              ref={marqueeMobileRef}
              className="relative w-full overflow-hidden"
              style={{ height: '280px' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="flex marquee-content"
                style={{
                  gap: '1rem',
                  width: 'fit-content',
                  willChange: 'transform', // GPU acceleration
                }}
              >
                {/* Prima serie di testimonial */}
                {testimonials.map(testimonial => (
                  <TestimonialCard key={`mobile-${testimonial.key}`} testimonial={testimonial} isMobile t={t} />
                ))}
                {/* Seconda serie per loop continuo */}
                {testimonials.map(testimonial => (
                  <TestimonialCard key={`mobile-${testimonial.key}-duplicate`} testimonial={testimonial} isMobile t={t} />
                ))}
              </div>

              {/* Left fade overlay - Mobile */}
              <div
                className="absolute left-0 top-0 w-16 h-full pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to right, white 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                }}
              />

              {/* Right fade overlay - Mobile */}
              <div
                className="absolute right-0 top-0 w-16 h-full pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
