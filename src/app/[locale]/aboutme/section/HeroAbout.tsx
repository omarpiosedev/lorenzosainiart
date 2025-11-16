'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function HeroAbout() {
  const t = useTranslations('AboutPage');
  const params = useParams();
  const locale = params.locale as string;

  // Refs for GSAP animations
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP animations using useGSAP hook
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
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
    <main
      ref={containerRef}
      className="flex items-center justify-center px-6 md:px-12 lg:px-24 pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20"
    >
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
            <span className="px-4 py-2 bg-gray-200 text-black text-sm rounded-full whitespace-nowrap font-lora">
              {t('badge')}
            </span>
          </div>

          {/* Heading */}
          <div className="leading-tight text-wrap-balanced heading-compact font-bacasime">
            <TextGenerateEffect
              words={t('greeting')}
              className="text-2xl md:text-3xl lg:text-4xl text-black mb-2 block"
              duration={1.2}
              staggerDelay={0.12}
              initialDelay={0.8}
              animateBy="letter"
            />
            <TextGenerateEffect
              words={t('name')}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black block"
              duration={1.2}
              staggerDelay={0.12}
              initialDelay={2.6}
              animateBy="letter"
            />
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl text-wrap-pretty line-clamp-4 md:line-clamp-none font-lora">
            {t('description')}
          </p>

          {/* CTA Button */}
          <div>
            <Link
              href={`/${locale}/portfolio`}
              className="inline-block px-8 py-4 bg-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors btn-fluid min-w-fit whitespace-nowrap font-lora-medium"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
