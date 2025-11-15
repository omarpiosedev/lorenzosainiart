'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function AboutContent() {
  const t = useTranslations('AboutPage');
  const params = useParams();
  const locale = params.locale as string;

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // GSAP animations using useGSAP hook
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        // Fade in header
        gsap.from(headerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate image with scale
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
        });

        // Stagger content elements
        gsap.from(contentRef.current?.children || [], {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.4,
          ease: 'power3.out',
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white overflow-hidden"
    >
      {/* Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-transparent"
      >
        {/* Left: Name & Role */}
        <div className="flex flex-col">
          <h2 className="text-base md:text-lg font-bold text-black text-wrap-balanced heading-compact">
            {t('header.name')}
          </h2>
          <div className="flex flex-col text-xs md:text-sm text-gray-600">
            <p>{t('header.role1')}</p>
            <p>{t('header.role2')}</p>
          </div>
        </div>

        {/* Center: Logo */}
        <Link
          href={`/${locale}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-700 ease-in-out hover:rotate-[360deg]">
            <Image
              src="/assets/images/LogoNero.webp"
              alt="Lorenzo Saini Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 48px, 64px"
            />
          </div>
        </Link>

        {/* Right: Contact Button */}
        <Link
          href={`/${locale}/contact`}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors btn-fluid min-w-fit whitespace-nowrap"
        >
          {t('contact')}
        </Link>
      </header>

      {/* Main Section */}
      <main className="flex items-center justify-center px-6 md:px-12 lg:px-24 pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Circular Image */}
          <div ref={imageRef} className="flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden bg-gray-300">
              <Image
                src="/assets/images/about/1760967654159.jpeg"
                alt="Lorenzo Saini - Photographer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 450px"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div ref={contentRef} className="flex flex-col space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <span className="px-4 py-2 bg-gray-200 text-black text-sm rounded-full whitespace-nowrap">
                {t('badge')}
              </span>
            </div>

            {/* Heading */}
            <TextGenerateEffect
              words={t('heading')}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-wrap-balanced heading-compact"
              duration={0.8}
              staggerDelay={0.3}
              initialDelay={0.8}
              animateBy="word"
            />

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl text-wrap-pretty line-clamp-4 md:line-clamp-none">
              {t('description')}
            </p>

            {/* CTA Button */}
            <div>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-block px-8 py-4 bg-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors btn-fluid min-w-fit whitespace-nowrap"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bio & Testimonial Section */}
      <section className="w-full bg-white pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-20 lg:pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Biography */}
          <div className="flex flex-col space-y-6">
            <div className="text-[15px] md:text-base text-black leading-relaxed">
              <p className="text-wrap-pretty">
                <span className="float-left text-[70px] md:text-[85px] font-bold leading-[0.8] mr-2 mt-1">
                  {t('bio.dropCap')}
                </span>
                {t('bio.paragraph1')}
              </p>
            </div>
            <p className="text-[15px] md:text-base text-black leading-relaxed text-wrap-pretty clear-both">
              {t('bio.paragraph2')}
            </p>
          </div>

          {/* Right: Testimonial */}
          <div className="flex flex-col justify-center space-y-6 lg:pl-6">
            <blockquote className="text-[15px] md:text-base text-black leading-relaxed text-wrap-pretty">
              "
              {t('testimonial.quote')}
              "
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0">
                <Image
                  src={t('testimonial.avatar')}
                  alt={t('testimonial.name')}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[15px] font-semibold text-black">
                  {t('testimonial.name')}
                </p>
                <p className="text-[13px] text-gray-600">
                  {t('testimonial.company')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
