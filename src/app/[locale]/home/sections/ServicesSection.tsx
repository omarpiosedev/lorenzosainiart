'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { ShimmerLabel } from '@/components/ui';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ServicesSection() {
  const t = useTranslations('HomePage.sez3');

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Refs for GSAP animations on first screen
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const servicesListRef = useRef<HTMLDivElement>(null);
  const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollArrowRef = useRef<SVGSVGElement>(null);

  // Helper per assegnare ref
  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const setServiceItemRef = (index: number) => (el: HTMLDivElement | null) => {
    serviceItemsRef.current[index] = el;
  };

  // ✅ Effetto "stacked cards" - ogni sezione pinnata, successiva scorre sopra
  // ScrollTrigger pinning works perfectly on mobile WITHOUT ScrollSmoother
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
            anticipatePin: 1, // CRITICAL: Prevents pin jitter on fast scroll (mobile)
            invalidateOnRefresh: true,
          });
        }
      });
    },
    { dependencies: [] },
  );

  // ✅ Reveal animation for first screen elements
  useGSAP(
    () => {
      // Stati iniziali
      gsap.set(labelRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(servicesListRef.current, {
        opacity: 0,
      });

      gsap.set(serviceItemsRef.current, {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.out',
        },
        scrollTrigger: {
          trigger: sectionRefs.current[0],
          start: 'top bottom',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Sequenza animazione
      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.2',
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.3',
        )
        .to(
          servicesListRef.current,
          {
            opacity: 1,
            duration: 0.4,
          },
          '-=0.2',
        )
        .to(
          serviceItemsRef.current,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          '-=0.4',
        );

      // Animazione continua per la freccia scroll
      gsap.to(scrollArrowRef.current, {
        y: 5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    },
    { dependencies: [] },
  );

  // ✅ Progressive blur + fade effect - each section blurs and fades when next one enters
  // Works on both desktop (with ScrollSmoother) and mobile (native scroll)
  useGSAP(
    () => {
      // For each section except the last one
      sectionRefs.current.forEach((section, index) => {
        // Skip last screen only
        if (!section || index >= sectionRefs.current.length - 1) {
          return;
        }

        const nextSection = sectionRefs.current[index + 1];
        if (!nextSection) {
          return;
        }

        // Progressive blur + fade as next section enters viewport
        // This creates the smooth "stacked cards" effect on all devices
        gsap.to(section, {
          filter: 'blur(8px)',
          opacity: 0,
          scrollTrigger: {
            trigger: nextSection,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        });
      });
    },
    { dependencies: [] },
  );

  return (
    <div data-section="services" className="relative">
      {/* ========== SCREEN 1: SERVICES INTRO - LEFT RIGHT SPLIT ========== */}
      <section
        ref={setSectionRef(0)}
        className="relative h-screen overflow-hidden bg-white"
        style={{ zIndex: 1 }}
        aria-label="Services Introduction"
      >
        {/* Main Content - Split Layout */}
        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left Column - Hero Content */}
              <div className="space-y-10">
                {/* Label */}
                <div ref={labelRef}>
                  <ShimmerLabel className="text-xs font-medium tracking-wide uppercase">
                    {t('servicesLabel')}
                  </ShimmerLabel>
                </div>

                {/* Title - Large */}
                <h1
                  ref={titleRef}
                  className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-[1.1] text-wrap-balanced heading-compact font-bacasime"
                  style={{
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('title')}
                </h1>

                {/* Subtitle */}
                <p
                  ref={subtitleRef}
                  className="text-sm md:text-base lg:text-lg text-black/60 leading-relaxed max-w-lg text-wrap-pretty line-clamp-4 md:line-clamp-none font-lora"
                >
                  {t('subtitle')}
                </p>

                {/* Scroll Hint */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-8 h-px bg-black/20" aria-hidden="true" />
                  <span className="text-xs tracking-wide uppercase text-black/40 font-lora">
                    Scroll to see all my services
                  </span>
                  {/* Animated Down Arrow */}
                  <svg
                    ref={scrollArrowRef}
                    className="w-4 h-4 text-black/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Right Column - Services List */}
              <div className="flex flex-col justify-center -mt-8 lg:mt-0">
                {/* Divider Line */}
                <div
                  ref={servicesListRef}
                  className="w-16 h-px bg-black/20 mb-6 lg:mb-8"
                  aria-hidden="true"
                />

                {/* Services Title */}
                <h2 className="text-sm font-medium tracking-wide uppercase text-black/70 mb-6 lg:mb-10 whitespace-nowrap font-lora-medium">
                  {t('servicesTitle')}
                </h2>

                {/* Services List - Numbered */}
                <div className="space-y-4 lg:space-y-8">
                  {[0, 1, 2].map(index => (
                    <div key={index} ref={setServiceItemRef(index)} className="flex items-start gap-6">
                      {/* Number */}
                      <span className="text-sm font-medium text-black/30 tabular-nums min-w-[3ch] pt-1 font-lora-medium">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Vertical Line */}
                      <div className="w-px h-full min-h-[3rem] bg-black/10" aria-hidden="true" />

                      {/* Service Text */}
                      <div className="flex-1 pt-0.5">
                        <span className="text-base md:text-lg lg:text-xl text-black/80 leading-relaxed text-wrap-pretty font-lora">
                          {t(`services.${index}`)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              className="text-[32px] md:text-2xl lg:text-3xl font-semibold text-black tracking-tight leading-tight mb-1.5 md:mb-3 text-wrap-balanced heading-compact font-lora-semibold uppercase"
            >
              {t('photography.title')}
            </h2>
            <p className="text-[14px] md:text-xs lg:text-sm text-black/80 leading-snug md:leading-relaxed text-wrap-pretty line-clamp-3 md:line-clamp-4 font-lora">
              {t('photography.description')}
            </p>
          </div>
        </div>

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
              className="text-[32px] md:text-2xl lg:text-3xl font-semibold text-black tracking-tight leading-tight mb-1.5 md:mb-3 text-wrap-balanced heading-compact font-lora-semibold uppercase"
            >
              {t('videomaking.title')}
            </h2>
            <p className="text-[14px] md:text-xs lg:text-sm text-black/80 leading-snug md:leading-relaxed text-wrap-pretty line-clamp-3 md:line-clamp-4 font-lora">
              {t('videomaking.description')}
            </p>
          </div>
        </div>

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
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/assets/videos/videomdesktop.webm" type="video/webm" />
          </video>

          <video
            className="absolute inset-0 w-full h-full object-cover block md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
              className="text-[32px] md:text-2xl lg:text-3xl font-semibold text-black tracking-tight leading-tight mb-1.5 md:mb-3 text-wrap-balanced heading-compact font-lora-semibold uppercase"
            >
              {t('dronefootage.title')}
            </h2>
            <p className="text-[14px] md:text-xs lg:text-sm text-black/80 leading-snug md:leading-relaxed text-wrap-pretty line-clamp-3 md:line-clamp-4 font-lora">
              {t('dronefootage.description')}
            </p>
          </div>
        </div>

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
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/assets/videos/dronedesktop.webm" type="video/webm" />
          </video>

          <video
            className="absolute inset-0 w-full h-full object-cover block md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/assets/videos/dronemobile.webm" type="video/webm" />
          </video>
        </div>
      </section>
    </div>
  );
}
