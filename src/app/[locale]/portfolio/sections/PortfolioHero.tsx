'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

type ImageConfig = {
  id: string;
  alt: string;
  className: string;
  gradient: string;
  socialIcon?: 'instagram' | 'pinterest' | 'twitter' | null;
};

export default function PortfolioHero() {
  const t = useTranslations('PortfolioPage');
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const isEntranceComplete = useRef(false);

  // Mobile-first image configuration matching the reference screenshot
  const images: ImageConfig[] = [
    {
      id: 'img-1',
      alt: 'Portfolio image 1',
      // Mobile: top-left, Desktop: maintained
      className:
        'absolute top-[2%] left-[2%] w-[35%] h-[23%] lg:top-[8%] lg:left-[5%] lg:w-[15%] lg:h-[40%]',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      socialIcon: 'instagram',
    },
    {
      id: 'img-2',
      alt: 'Portfolio image 2',
      // Mobile: top-right (large), Desktop: maintained
      className:
        'absolute top-[10%] right-[2%] w-[42%] h-[32%] lg:top-[-5%] lg:left-[35%] lg:right-auto lg:w-[15%] lg:h-[35%]',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      socialIcon: 'pinterest',
    },
    {
      id: 'img-3',
      alt: 'Portfolio image 3',
      // Mobile: middle-left, Desktop: maintained
      className:
        'absolute top-[48%] left-[3%] w-[34%] h-[24%] lg:top-[30%] lg:left-auto lg:right-[12%] lg:w-[15%] lg:h-[33%]',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      socialIcon: 'pinterest',
    },
    {
      id: 'img-4',
      alt: 'Portfolio image 4',
      // Mobile: bottom-right, Desktop: maintained
      className:
        'absolute top-[75%] right-[4%] w-[45%] h-[18%] lg:bottom-[-3%] lg:top-auto lg:left-[8%] lg:right-auto lg:w-[18%] lg:h-[38%]',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      socialIcon: null,
    },
    {
      id: 'img-5',
      alt: 'Portfolio image 5',
      // Mobile: bottom-center, Desktop: maintained
      className:
        'absolute top-[83%] left-[35%] w-[32%] h-[20%] lg:bottom-[10%] lg:top-auto lg:left-[32%] lg:w-[12%] lg:h-[22%]',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      socialIcon: 'pinterest',
    },
    {
      id: 'img-6',
      alt: 'Portfolio image 6',
      // Mobile: hidden or very bottom, Desktop: maintained
      className:
        'absolute top-[105%] right-[28%] w-[16%] h-[15%] lg:bottom-[-8%] lg:top-auto lg:w-[16%] lg:h-[33%]',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      socialIcon: null,
    },
    {
      id: 'img-7',
      alt: 'Portfolio image 7',
      // Mobile: very bottom right, Desktop: maintained
      className:
        'absolute top-[110%] right-[-3%] w-[14%] h-[12%] lg:bottom-[-10%] lg:top-auto lg:w-[14%] lg:h-[28%]',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      socialIcon: 'twitter',
    },
    {
      id: 'img-8',
      alt: 'Portfolio image 8',
      // Mobile: hidden or off-screen, Desktop: maintained
      className:
        'absolute top-[115%] right-[-10%] w-[14%] h-[12%] lg:bottom-[30%] lg:top-auto lg:w-[14%] lg:h-[33%]',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      socialIcon: 'instagram',
    },
  ];

  // Entrance animations
  useGSAP(
    () => {
      if (!titleRef.current || !subtitleRef.current) {
        return;
      }

      // Set initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 60,
        filter: 'blur(12px)',
        scale: 0.95,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.98,
      });

      // Get all image items
      const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

      gsap.set(imageElements, {
        opacity: 0,
        scale: 0.88,
        filter: 'blur(10px)',
        y: 40,
      });

      // Timeline for staggered entrance
      const tl = gsap.timeline({
        delay: 0.4,
      });

      tl.to(
        imageElements,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 2.4,
          stagger: {
            amount: 1.6,
            from: 'random',
            ease: 'power1.inOut',
          },
          ease: 'expo.out',
        },
      )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 2.6,
            ease: 'expo.out',
          },
          '-=1.4',
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.8,
            ease: 'expo.out',
            onComplete: () => {
              isEntranceComplete.current = true;
            },
          },
          '-=1.6',
        );
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Parallax effect for images (delayed until entrance completes)
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Wait for entrance animation to complete
      const checkInterval = setInterval(() => {
        if (isEntranceComplete.current) {
          clearInterval(checkInterval);

          const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

          imageElements.forEach((item, index) => {
            // Different parallax speeds for depth effect
            const speeds = [-60, -40, -80, -50, -70, -45, -65, -55];
            const speed = speeds[index] || -50;

            gsap.to(item, {
              y: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          });
        }
      }, 100);

      return () => clearInterval(checkInterval);
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Mouse parallax effect (delayed until entrance completes)
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      let handleMouseMove: ((e: MouseEvent) => void) | null = null;

      // Wait for entrance animation to complete
      const checkInterval = setInterval(() => {
        if (isEntranceComplete.current) {
          clearInterval(checkInterval);

          const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

          handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalizza le coordinate del mouse da -1 a 1
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;

            imageElements.forEach((item, index) => {
              // Different speeds for depth effect
              const speeds = [0.8, 0.5, 1.0, 0.6, 0.9, 0.55, 0.75, 0.85];
              const speed = speeds[index] || 0.7;

              // Movimento pronunciato (max 100px)
              const xMove = xPercent * 100 * speed;
              const yMove = yPercent * 100 * speed;

              gsap.to(item, {
                x: xMove,
                y: yMove,
                duration: 1.2,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            });
          };

          window.addEventListener('mousemove', handleMouseMove);
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (handleMouseMove) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  return (
    <section
      ref={containerRef}
      data-section="portfolio-hero"
      className="relative w-full bg-[#060010] overflow-hidden"
      style={{
        minHeight: '100vh',
        height: '100vh',
      }}
    >
      {/* Portfolio Images - Positioned absolutely */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`portfolio-image ${image.className} overflow-hidden rounded-lg`}
          style={{
            willChange: 'transform',
            opacity: 0,
          }}
        >
          {/* Gradient Placeholder */}
          <div
            className="gradient-placeholder absolute inset-0 flex items-center justify-center"
            style={{
              background: image.gradient,
            }}
          >
            {/* Placeholder Number */}
            <div className="text-white/30 text-6xl font-bold">
              {index + 1}
            </div>

            {/* Social Icon Badge */}
            {image.socialIcon && (
              <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                {image.socialIcon === 'instagram' && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
                {image.socialIcon === 'pinterest' && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                )}
                {image.socialIcon === 'twitter' && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Central Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4">
        <h1
          ref={titleRef}
          className="text-white text-center leading-[1.1] mb-6"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            letterSpacing: '0.05em',
            fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
            textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            opacity: 0,
          }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            opacity: 0,
          }}
        >
          <span className="text-white/70">{t('hero.label')}</span>
        </div>
      </div>
    </section>
  );
}
