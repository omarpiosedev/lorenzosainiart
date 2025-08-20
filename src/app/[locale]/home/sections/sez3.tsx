'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Sez3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const horizontalContentRef = useRef<HTMLDivElement>(null);
  const whiteBar1Ref = useRef<HTMLDivElement>(null);
  const whiteBar2Ref = useRef<HTMLDivElement>(null);
  const whiteBar3Ref = useRef<HTMLDivElement>(null);
  const whiteBar4Ref = useRef<HTMLDivElement>(null);
  const textContent1Ref = useRef<HTMLDivElement>(null);
  const textContent2Ref = useRef<HTMLDivElement>(null);
  const textContent3Ref = useRef<HTMLDivElement>(null);
  const textContent4Ref = useRef<HTMLDivElement>(null);
  const [_isHorizontalScrollActive, setIsHorizontalScrollActive] = useState(false);

  const t = useTranslations('HomePage.sez3');
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    if (!sectionRef.current || !horizontalContainerRef.current || !horizontalContentRef.current) {
      return;
    }

    const container = horizontalContainerRef.current;
    const content = horizontalContentRef.current;

    // Set initial state for white bars and text content
    if (whiteBar1Ref.current) {
      gsap.set(whiteBar1Ref.current, { y: -120 });
    }
    if (whiteBar2Ref.current) {
      gsap.set(whiteBar2Ref.current, { y: -120 });
    }
    if (whiteBar3Ref.current) {
      gsap.set(whiteBar3Ref.current, { y: -120 });
    }
    if (whiteBar4Ref.current) {
      gsap.set(whiteBar4Ref.current, { y: -120 });
    }
    if (textContent1Ref.current) {
      gsap.set(textContent1Ref.current, { opacity: 0, y: 30 });
    }
    if (textContent2Ref.current) {
      gsap.set(textContent2Ref.current, { opacity: 0, y: 30 });
    }
    if (textContent3Ref.current) {
      gsap.set(textContent3Ref.current, { opacity: 0, y: 30 });
    }
    if (textContent4Ref.current) {
      gsap.set(textContent4Ref.current, { opacity: 0, y: 30 });
    }

    // Create timeline with delay
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'center center',
        end: '+=3000vh', // Molto più scroll per movimento lentissimo
        scrub: 0.5, // Scrub più fluido per evitare tremori
        // RIMOSSO SNAP - movimento 100% dipendente da scroll
        pin: true,
        anticipatePin: 1,
        pinSpacing: '200vh', // Aggiunto spazio extra dopo la sezione
        onEnter: () => {
          document.body.style.overflow = 'hidden';
        },
        onLeave: () => {
          document.body.style.overflow = 'auto';
          setIsHorizontalScrollActive(false);
        },
        onEnterBack: () => {
          document.body.style.overflow = 'hidden';
        },
        onLeaveBack: () => {
          document.body.style.overflow = 'auto';
          setIsHorizontalScrollActive(false);
        },
        onUpdate: (self) => {
          // Animate white bars based on scroll progress with better timing
          const progress = self.progress;

          // Screen 1 bar animation - starts when screen 1 enters center (20% progress)
          if (whiteBar1Ref.current) {
            if (progress >= 0.20 && progress <= 0.40) {
              const localProgress = Math.min((progress - 0.20) / 0.2, 1);
              // Smoother bar animation with easing
              const easedProgress = gsap.utils.interpolate(0, 1, localProgress ** 0.6);
              gsap.set(whiteBar1Ref.current, { y: gsap.utils.interpolate(-120, 0, easedProgress) });

              // Text appears when bar is 70% down
              if (textContent1Ref.current) {
                if (localProgress >= 0.7) {
                  const textProgress = Math.min((localProgress - 0.7) / 0.3, 1);
                  const easedTextProgress = gsap.utils.interpolate(0, 1, textProgress ** 0.4);
                  gsap.set(textContent1Ref.current, {
                    opacity: easedTextProgress,
                    y: gsap.utils.interpolate(30, 0, easedTextProgress),
                  });
                } else {
                  gsap.set(textContent1Ref.current, { opacity: 0, y: 30 });
                }
              }
            } else if (progress < 0.20) {
              gsap.set(whiteBar1Ref.current, { y: -120 });
              if (textContent1Ref.current) {
                gsap.set(textContent1Ref.current, { opacity: 0, y: 30 });
              }
            } else {
              gsap.set(whiteBar1Ref.current, { y: 0 });
              if (textContent1Ref.current) {
                gsap.set(textContent1Ref.current, { opacity: 1, y: 0 });
              }
            }
          }

          // Screen 2 bar animation - starts when screen 2 enters center (40% progress)
          if (whiteBar2Ref.current) {
            if (progress >= 0.40 && progress <= 0.60) {
              const localProgress = Math.min((progress - 0.40) / 0.2, 1);
              const easedProgress = gsap.utils.interpolate(0, 1, localProgress ** 0.6);
              gsap.set(whiteBar2Ref.current, { y: gsap.utils.interpolate(-120, 0, easedProgress) });

              if (textContent2Ref.current) {
                if (localProgress >= 0.7) {
                  const textProgress = Math.min((localProgress - 0.7) / 0.3, 1);
                  const easedTextProgress = gsap.utils.interpolate(0, 1, textProgress ** 0.4);
                  gsap.set(textContent2Ref.current, {
                    opacity: easedTextProgress,
                    y: gsap.utils.interpolate(30, 0, easedTextProgress),
                  });
                } else {
                  gsap.set(textContent2Ref.current, { opacity: 0, y: 30 });
                }
              }
            } else if (progress < 0.40) {
              gsap.set(whiteBar2Ref.current, { y: -120 });
              if (textContent2Ref.current) {
                gsap.set(textContent2Ref.current, { opacity: 0, y: 30 });
              }
            } else {
              gsap.set(whiteBar2Ref.current, { y: 0 });
              if (textContent2Ref.current) {
                gsap.set(textContent2Ref.current, { opacity: 1, y: 0 });
              }
            }
          }

          // Screen 3 bar animation - starts when screen 3 enters center (60% progress)
          if (whiteBar3Ref.current) {
            if (progress >= 0.60 && progress <= 0.80) {
              const localProgress = Math.min((progress - 0.60) / 0.2, 1);
              const easedProgress = gsap.utils.interpolate(0, 1, localProgress ** 0.6);
              gsap.set(whiteBar3Ref.current, { y: gsap.utils.interpolate(-120, 0, easedProgress) });

              if (textContent3Ref.current) {
                if (localProgress >= 0.7) {
                  const textProgress = Math.min((localProgress - 0.7) / 0.3, 1);
                  const easedTextProgress = gsap.utils.interpolate(0, 1, textProgress ** 0.4);
                  gsap.set(textContent3Ref.current, {
                    opacity: easedTextProgress,
                    y: gsap.utils.interpolate(30, 0, easedTextProgress),
                  });
                } else {
                  gsap.set(textContent3Ref.current, { opacity: 0, y: 30 });
                }
              }
            } else if (progress < 0.60) {
              gsap.set(whiteBar3Ref.current, { y: -120 });
              if (textContent3Ref.current) {
                gsap.set(textContent3Ref.current, { opacity: 0, y: 30 });
              }
            } else {
              gsap.set(whiteBar3Ref.current, { y: 0 });
              if (textContent3Ref.current) {
                gsap.set(textContent3Ref.current, { opacity: 1, y: 0 });
              }
            }
          }

          // Screen 4 bar animation - starts when screen 4 enters center (80% progress)
          if (whiteBar4Ref.current) {
            if (progress >= 0.80 && progress <= 1.0) {
              const localProgress = Math.min((progress - 0.80) / 0.2, 1);
              const easedProgress = gsap.utils.interpolate(0, 1, localProgress ** 0.6);
              gsap.set(whiteBar4Ref.current, { y: gsap.utils.interpolate(-120, 0, easedProgress) });

              if (textContent4Ref.current) {
                if (localProgress >= 0.7) {
                  const textProgress = Math.min((localProgress - 0.7) / 0.3, 1);
                  const easedTextProgress = gsap.utils.interpolate(0, 1, textProgress ** 0.4);
                  gsap.set(textContent4Ref.current, {
                    opacity: easedTextProgress,
                    y: gsap.utils.interpolate(30, 0, easedTextProgress),
                  });
                } else {
                  gsap.set(textContent4Ref.current, { opacity: 0, y: 30 });
                }
              }
            } else if (progress < 0.80) {
              gsap.set(whiteBar4Ref.current, { y: -120 });
              if (textContent4Ref.current) {
                gsap.set(textContent4Ref.current, { opacity: 0, y: 30 });
              }
            } else {
              gsap.set(whiteBar4Ref.current, { y: 0 });
              if (textContent4Ref.current) {
                gsap.set(textContent4Ref.current, { opacity: 1, y: 0 });
              }
            }
          }
        },
      },
    });

    // Add delay phase (no movement) - molto più lungo
    tl.to({}, { duration: 0.2 }) // 20% of timeline is empty/delay
    // Add horizontal scroll phase - molto più lento
      .to(content, {
        xPercent: -80, // 5 screens = 500vw, so -80% to show all screens
        ease: 'none',
        duration: 0.8, // 80% of timeline is horizontal scroll
        onStart: () => {
          setIsHorizontalScrollActive(true);
        },
      });

    const horizontalScrollTween = tl;

    return () => {
      horizontalScrollTween.kill();
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger when component mounts
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} data-section="sez3" className="relative bg-white mb-[10vh]">
      {/* Horizontal Scrolling Container */}
      <div
        ref={horizontalContainerRef}
        className="horizontal-scroll-container bg-white overflow-hidden"
        style={{ height: '100vh' }} // Single screen height
      >
        <div
          ref={horizontalContentRef}
          className="horizontal-content flex h-screen"
          style={{
            width: 'calc(500vw + 250px)', // 5 screens + 5 divisori da 50px
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >

          {/* Screen 0 - Original Content */}
          <div className="horizontal-screen flex items-center justify-center min-h-screen relative" style={{ width: '100vw' }}>
            <div className="w-full max-w-4xl mx-auto text-center px-4 md:px-8 lg:px-16">
              {/* Content */}
              <div className="space-y-8 lg:space-y-10">
                {/* Services Label */}
                <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
                  {t('servicesLabel')}
                </div>

                {/* Main Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-wide" style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {t('title')}
                </h2>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  "
                  {t('subtitle')}
                  "
                </p>

                {/* Services List */}
                <div className="space-y-6">
                  <h3 className="text-lg font-normal text-black" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {t('servicesTitle')}
                  </h3>

                  <div className="space-y-4 max-w-md mx-auto">
                    {['Professional Editing', 'Edited & Unedited (RAW) Images', 'Personal and Commercial Licensing'].map((_, index) => (
                      <div key={index} className="flex items-center space-x-4 justify-center">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-black font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t(`services.${index}`)}
                        </span>
                      </div>
                    ))}
                  </div>
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
          </div>

          {/* Vertical Divider 1 */}
          <div className="w-12 h-screen bg-white flex-shrink-0"></div>

          {/* Screen 1 - Photography */}
          <div
            className="horizontal-screen flex items-center justify-center min-h-screen relative overflow-hidden"
            style={{
              width: '100vw',
              backgroundImage: 'url(\'/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp\')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* White bar at top with content */}
            <div ref={whiteBar1Ref} className="absolute top-0 left-0 right-0 h-24 md:h-28 lg:h-32 bg-white flex items-center px-4 md:px-8 lg:px-12">
              <div ref={textContent1Ref} className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Large title */}
                <h2
                  className="text-3xl md:text-6xl lg:text-7xl font-light text-black tracking-tight leading-none flex items-center"
                  style={{
                    fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
                    lineHeight: '1',
                    minHeight: '2.5rem',
                  }}
                >
                  Photography
                </h2>

                {/* Description */}
                <p
                  className="text-sm md:text-lg lg:text-xl text-gray-500 leading-tight md:leading-relaxed font-light md:max-w-none lg:max-w-none text-left md:text-right md:whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Professional photo shoots for events, portraits, products, and businesses. Every shot is crafted to tell a story and highlight your best image.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Divider 2 */}
          <div className="w-12 h-screen bg-white flex-shrink-0"></div>

          {/* Screen 2 */}
          <div className="horizontal-screen flex items-center justify-center min-h-screen relative overflow-hidden" style={{ width: '100vw' }}>
            {/* White bar at top with content */}
            <div ref={whiteBar2Ref} className="absolute top-0 left-0 right-0 h-24 md:h-28 lg:h-32 bg-white flex items-center px-4 md:px-8 lg:px-12 z-20">
              <div ref={textContent2Ref} className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Large title */}
                <h2
                  className="text-3xl md:text-6xl lg:text-7xl font-light text-black tracking-tight leading-none flex items-center"
                  style={{
                    fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
                    lineHeight: '1',
                    minHeight: '2.5rem',
                  }}
                >
                  Videomaking
                </h2>

                {/* Description */}
                <p
                  className="text-sm md:text-lg lg:text-xl text-gray-500 leading-tight md:leading-relaxed font-light md:max-w-none lg:max-w-none text-left md:text-right md:whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Dynamic and engaging videos, perfect for promotions, events, storytelling, and social media content.
                </p>
              </div>
            </div>

            {/* Background Video - Desktop */}
            <video
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
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
              preload="metadata"
            >
              <source src="/assets/videos/videommobile.webm" type="video/webm" />
            </video>
          </div>

          {/* Vertical Divider 3 */}
          <div className="w-12 h-screen bg-white flex-shrink-0"></div>

          {/* Screen 3 */}
          <div className="horizontal-screen flex items-center justify-center min-h-screen relative overflow-hidden" style={{ width: '100vw' }}>
            {/* White bar at top with content */}
            <div ref={whiteBar3Ref} className="absolute top-0 left-0 right-0 h-24 md:h-28 lg:h-32 bg-white flex items-center px-4 md:px-8 lg:px-12 z-20">
              <div ref={textContent3Ref} className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Large title */}
                <h2
                  className="text-3xl md:text-6xl lg:text-7xl font-light text-black tracking-tight leading-none flex items-center"
                  style={{
                    fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
                    lineHeight: '1',
                    minHeight: '2.5rem',
                  }}
                >
                  Drone Footage
                </h2>

                {/* Description */}
                <p
                  className="text-sm md:text-lg lg:text-xl text-gray-500 leading-tight md:leading-relaxed font-light md:max-w-none lg:max-w-none text-left md:text-right md:whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Stunning aerial shots in high definition: ideal for events, tourism, businesses, and creative projects that need a unique perspective.
                </p>
              </div>
            </div>

            {/* Background Video - Desktop */}
            <video
              className="absolute inset-0 w-full h-full object-cover hidden md:block z-10"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/assets/videos/dronedesktop.webm" type="video/webm" />
            </video>

            {/* Background Video - Mobile */}
            <video
              className="absolute inset-0 w-full h-full object-cover block md:hidden z-10"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/assets/videos/dronemobile.webm" type="video/webm" />
            </video>
          </div>

          {/* Vertical Divider 4 */}
          <div className="w-12 h-screen bg-white flex-shrink-0"></div>

          {/* Screen 4 - Graphic Design */}
          <div className="horizontal-screen flex items-center justify-center relative overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
            {/* Gradient Background */}
            <div className="absolute -inset-4 w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 z-0" style={{ height: 'calc(100vh + 200px)' }}></div>

            {/* Perfect Fan Layout */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {/* Locandina 1 - Right Fan (22°) */}
              <div
                className="absolute transform rotate-0 md:rotate-[22deg] opacity-100 z-20"
                style={{
                  right: '41px',
                  top: '245px',
                  transformOrigin: 'center center',
                }}
              >
                <style jsx>
                  {`
                  @media (min-width: 768px) {
                    div {
                      right: 300px !important;
                      top: 180px !important;
                    }
                  }
                `}
                </style>
                <img
                  src="/assets/images/locandina1.webp"
                  alt="Graphic Design Sample 1"
                  className="w-[225px] h-[318px] md:w-72 md:h-96 lg:w-[465px] lg:h-[656px] object-cover rounded-xl shadow-2xl"
                />
              </div>

              {/* Locandina 2 - Center Fan (-22°) */}
              <div
                className="absolute transform rotate-0 md:rotate-[-22deg] opacity-100 z-10"
                style={{
                  left: '87px',
                  top: '89px',
                  transformOrigin: 'center center',
                }}
              >
                <style jsx>
                  {`
                  @media (min-width: 768px) {
                    div {
                      left: 320px !important;
                      top: 137px !important;
                    }
                  }
                `}
                </style>
                <img
                  src="/assets/images/locandina2.webp"
                  alt="Graphic Design Sample 2"
                  className="w-[225px] h-[318px] md:w-80 md:h-[28rem] lg:w-[456px] lg:h-[692px] object-cover rounded-xl shadow-2xl"
                />
              </div>

              {/* Locandina 3 - Right Fan (0°) */}
              <div
                className="absolute transform rotate-0 md:rotate-0 opacity-100 z-30"
                style={{
                  left: '57px',
                  top: '402px',
                  transformOrigin: 'center center',
                }}
              >
                <style jsx>
                  {`
                  @media (min-width: 768px) {
                    div {
                      left: 680px !important;
                      top: 170px !important;
                    }
                  }
                `}
                </style>
                <img
                  src="/assets/images/locandina3.webp"
                  alt="Graphic Design Sample 3"
                  className="w-[225px] h-[318px] md:w-64 md:h-80 lg:w-[540px] lg:h-[775px] object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>

            {/* White bar at top with content */}
            <div ref={whiteBar4Ref} className="absolute top-0 left-0 right-0 h-24 md:h-28 lg:h-32 bg-white flex items-center px-4 md:px-8 lg:px-12 z-20">
              <div ref={textContent4Ref} className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Large title */}
                <h2
                  className="text-3xl md:text-6xl lg:text-7xl font-light text-black tracking-tight leading-none flex items-center"
                  style={{
                    fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
                    lineHeight: '1',
                    minHeight: '2.5rem',
                  }}
                >
                  Graphic Design
                </h2>

                {/* Description */}
                <p
                  className="text-sm md:text-lg lg:text-xl text-gray-500 leading-tight md:leading-relaxed font-light md:max-w-none lg:max-w-none text-left md:text-right md:whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Custom covers, posters, templates, and visual materials designed to communicate your ideas effectively and creatively.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Divider 5 - Final */}
          <div className="w-12 h-screen bg-white flex-shrink-0"></div>

        </div>
      </div>
    </div>
  );
}
