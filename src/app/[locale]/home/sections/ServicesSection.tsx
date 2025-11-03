'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ServicesSection() {
  const t = useTranslations('HomePage.sez3');
  const params = useParams();
  const locale = params.locale as string;

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Helper per assegnare ref
  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  // ✅ Effetto "stacked cards" - ogni sezione pinnata, successiva scorre sopra
  useGSAP(
    () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) {
          return;
        }

        // Non pinnare l'ultima sezione
        if (index < sectionRefs.current.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          });
        }
      });
    },
    { dependencies: [] },
  );

  return (
    <div data-section="services" className="relative">
      {/* ========== SCREEN 1: SERVICES INTRO ========== */}
      <section
        ref={setSectionRef(0)}
        className="relative flex items-center justify-center h-screen bg-white"
        style={{ zIndex: 1 }}
        aria-label="Services Introduction"
      >
        <div className="w-full max-w-4xl mx-auto text-center px-4 md:px-8 lg:px-16">
          <div className="space-y-8 lg:space-y-10">
            {/* Services Label */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
              {t('servicesLabel')}
            </div>

            {/* Main Title */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-wide"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('title')}
            </h2>

            {/* Subtitle */}
            <p
              className="text-base md:text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              "
              {t('subtitle')}
              "
            </p>

            {/* Services List */}
            <div className="space-y-6">
              <h3
                className="text-lg font-normal text-black"
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {t('servicesTitle')}
              </h3>

              <ul className="space-y-4 max-w-md mx-auto">
                {[
                  'Professional Editing',
                  'Edited & Unedited (RAW) Images',
                  'Personal and Commercial Licensing',
                ].map((_, index) => (
                  <li key={`service-${index}`} className="flex items-center space-x-4 justify-center">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden="true">
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-black font-normal"
                      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      {t(`services.${index}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* View Portfolio Button */}
            <div className="pt-6">
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-normal rounded-full hover:bg-gray-800 transition-colors duration-200 text-base"
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {t('viewPortfolio')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SCREEN 2: PHOTOGRAPHY ========== */}
      <section
        ref={setSectionRef(1)}
        className="relative h-screen w-full overflow-hidden bg-white"
        style={{ zIndex: 2 }}
        aria-label="Photography Services"
      >
        {/* Blob organico bianco - scorre dallo sfondo ed entra nell'immagine */}
        <div
          className="absolute top-0 left-0 z-10"
          style={{
            width: 'clamp(220px, 60vw, 420px)',
            height: 'clamp(90px, 25vh, 350px)',
            background: '#ffffff',
            borderRadius: '0% 48% 85% 15% / 0% 62% 38% 0%',
          }}
        >
          <div className="p-4 md:p-8 lg:p-10 h-full flex flex-col justify-start pt-5 md:pt-12">
            <h2
              className="text-[40px] md:text-3xl lg:text-4xl font-light text-black tracking-tight leading-tight mb-1.5 md:mb-3"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('photography.title')}
            </h2>
            <p
              className="text-[16px] md:text-sm lg:text-base text-black/80 leading-snug md:leading-relaxed font-light"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('photography.description')}
            </p>
          </div>
        </div>

        {/* Immagine con curve liquide agli angoli */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              'url(\'/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp\')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '100px 120px 80px 140px / 90px 80px 120px 120px',
            margin: '20px',
            width: 'calc(100% - 40px)',
            height: 'calc(100% - 40px)',
            zIndex: 5,
          }}
        />
      </section>

      {/* ========== SCREEN 3: VIDEOMAKING ========== */}
      <section
        ref={setSectionRef(2)}
        className="relative h-screen w-full overflow-hidden bg-white"
        style={{ zIndex: 3 }}
        aria-label="Videomaking Services"
      >
        {/* Blob organico bianco - scorre dallo sfondo ed entra nell'immagine */}
        <div
          className="absolute top-0 right-0 z-10"
          style={{
            width: 'clamp(240px, 65vw, 460px)',
            height: 'clamp(100px, 28vh, 380px)',
            background: '#ffffff',
            borderRadius: '52% 0% 18% 82% / 68% 0% 0% 32%',
          }}
        >
          <div className="p-4 md:p-8 lg:p-10 h-full flex flex-col justify-start items-end text-right pt-5 md:pt-12">
            <h2
              className="text-[40px] text-sm md:text-3xl lg:text-4xl font-light text-black tracking-tight leading-tight mb-1.5 md:mb-3"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('videomaking.title')}
            </h2>
            <p
              className="text-[16px] md:text-sm lg:text-base text-black/80 leading-snug md:leading-relaxed font-light"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('videomaking.description')}
            </p>
          </div>
        </div>

        {/* Video container con curve liquide agli angoli */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            borderRadius: '100px 120px 80px 140px / 90px 80px 120px 120px',
            margin: '20px',
            width: 'calc(100% - 40px)',
            height: 'calc(100% - 40px)',
            zIndex: 5,
          }}
        >
          {/* Background Video - Desktop */}
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/assets/videos/videomdesktop.webm" type="video/webm" />
          </video>

          {/* Background Video - Mobile */}
          <video
            className="absolute inset-0 w-full h-full object-cover block md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/assets/videos/videommobile.webm" type="video/webm" />
          </video>
        </div>
      </section>

      {/* ========== SCREEN 4: DRONE FOOTAGE ========== */}
      <section
        ref={setSectionRef(3)}
        className="relative h-screen w-full overflow-hidden bg-white"
        style={{ zIndex: 4 }}
        aria-label="Drone Footage Services"
      >
        {/* Blob organico bianco - scorre dallo sfondo ed entra nell'immagine */}
        <div
          className="absolute bottom-0 left-0 z-10"
          style={{
            width: 'clamp(220px, 60vw, 420px)',
            height: 'clamp(90px, 25vh, 350px)',
            background: '#ffffff',
            borderRadius: '20% 80% 0% 0% / 42% 58% 0% 0%',
          }}
        >
          <div className="p-4 md:p-8 lg:p-10 h-full flex flex-col justify-end pb-5 md:pb-12">
            <h2
              className="text-[40px] md:text-3xl lg:text-4xl font-light text-black tracking-tight leading-tight mb-1.5 md:mb-3"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('dronefootage.title')}
            </h2>
            <p
              className="text-[16px] md:text-sm lg:text-base text-black/80 leading-snug md:leading-relaxed font-light"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('dronefootage.description')}
            </p>
          </div>
        </div>

        {/* Video container con curve liquide agli angoli */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            borderRadius: '100px 120px 80px 140px / 90px 80px 120px 120px',
            margin: '20px',
            width: 'calc(100% - 40px)',
            height: 'calc(100% - 40px)',
            zIndex: 5,
          }}
        >
          {/* Background Video - Desktop */}
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/assets/videos/dronedesktop.webm" type="video/webm" />
          </video>

          {/* Background Video - Mobile */}
          <video
            className="absolute inset-0 w-full h-full object-cover block md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/assets/videos/dronemobile.webm" type="video/webm" />
          </video>
        </div>
      </section>
    </div>
  );
}
