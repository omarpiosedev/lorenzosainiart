'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Biography() {
  const t = useTranslations('AboutPage');

  // Refs for GSAP ScrollTrigger animations
  const bioParagraph1Ref = useRef<HTMLDivElement>(null);
  const bioParagraph2Ref = useRef<HTMLParagraphElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger animations for bio/testimonial section - sequential reveal
  useGSAP(
    () => {
      if (
        !bioParagraph1Ref.current
        || !bioParagraph2Ref.current
        || !testimonialRef.current
      ) {
        return;
      }

      // Create timeline triggered by first paragraph
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bioParagraph1Ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Sequential animations: paragraph 1 → paragraph 2 → testimonial
      tl.from(bioParagraph1Ref.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          bioParagraph2Ref.current,
          {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.5', // Start 0.5s before previous animation ends (overlap)
        )
        .from(
          testimonialRef.current.children,
          {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
          },
          '-=0.5', // Start 0.5s before previous animation ends (overlap)
        );

      // Cleanup: Kill timeline and its ScrollTrigger on unmount
      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    },
    { dependencies: [] }, // Empty dependencies ensures this runs only once per mount
  );

  return (
    <section className="w-full bg-white pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-20 lg:pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Biography */}
        <div className="flex flex-col space-y-6">
          <div
            ref={bioParagraph1Ref}
            className="text-[15px] md:text-base text-black leading-relaxed"
          >
            <p className="text-wrap-pretty">
              <span className="float-left text-[70px] md:text-[85px] font-bold leading-[0.8] mr-2 mt-1">
                {t('bio.dropCap')}
              </span>
              {t('bio.paragraph1')}
            </p>
          </div>
          <p
            ref={bioParagraph2Ref}
            className="text-[15px] md:text-base text-black leading-relaxed text-wrap-pretty clear-both"
          >
            {t('bio.paragraph2')}
          </p>
        </div>

        {/* Right: Testimonial */}
        <div
          ref={testimonialRef}
          className="flex flex-col justify-center space-y-6 lg:pl-6"
        >
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
  );
}
