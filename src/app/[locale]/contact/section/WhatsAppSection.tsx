'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function WhatsAppSection() {
  const t = useTranslations('ContactPage.whatsapp');

  // Refs for elements
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const availabilityRef = useRef<HTMLParagraphElement>(null);

  // ScrollTrigger animations
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        // Set initial states explicitly
        gsap.set(cardRef.current, { opacity: 0, y: 60, scale: 0.95 });
        gsap.set(badgeRef.current, { opacity: 0, y: 20 });
        gsap.set(iconRef.current, { opacity: 0, scale: 0, rotation: -180 });
        gsap.set(titleRef.current, { opacity: 0, y: 20 });
        gsap.set(descriptionRef.current, { opacity: 0, y: 20 });
        gsap.set(ctaRef.current, { opacity: 0, y: 20, scale: 0.9 });
        gsap.set(availabilityRef.current, { opacity: 0 });

        // Timeline with ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%', // Start when top of card hits 85% of viewport
            toggleActions: 'play none none reverse', // play on enter, reverse on leave back
          },
          defaults: { ease: 'power3.out' },
        });

        // Staggered entrance animations
        tl.to(cardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
        })
          .to(badgeRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
          }, '-=0.5')
          .to(iconRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          }, '-=0.3')
          .to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
          }, '-=0.3')
          .to(descriptionRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
          }, '-=0.3')
          .to(ctaRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
          }, '-=0.2')
          .to(availabilityRef.current, {
            opacity: 1,
            duration: 0.4,
          }, '-=0.2');
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  // WhatsApp link (sanitize phone number for URL - remove all non-numeric characters)
  const whatsappPhone = t('phone').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  return (
    <div ref={containerRef} className="mt-[var(--space-12)] md:mt-[var(--space-16)]">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg transition-all hover:shadow-xl md:p-10"
      >
        {/* Background pattern (optional decorative element) */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="whatsapp-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-green-600" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#whatsapp-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="mb-6 inline-flex items-center justify-center"
          >
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              {t('badge')}
            </span>
          </div>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left content */}
            <div className="flex-1">
              {/* WhatsApp Icon */}
              <div
                ref={iconRef}
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 shadow-md md:h-20 md:w-20"
              >
                <svg
                  className="h-8 w-8 text-white md:h-10 md:w-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>

              {/* Title */}
              <h3
                ref={titleRef}
                className="mb-3 font-bacasime text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-neutral-900"
              >
                {t('title')}
              </h3>

              {/* Description */}
              <p
                ref={descriptionRef}
                className="mb-4 max-w-md text-[var(--text-base)] leading-relaxed text-neutral-600 md:mb-0"
              >
                {t('description')}
              </p>
            </div>

            {/* Right content - CTA */}
            <div className="flex flex-col items-start gap-3 md:items-end">
              {/* CTA Button */}
              <a
                ref={ctaRef}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={t('cta')}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>{t('cta')}</span>
              </a>

              {/* Availability badge */}
              <p
                ref={availabilityRef}
                className="flex items-center gap-2 text-sm text-green-700"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                {t('availability')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
