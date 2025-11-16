'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';

// Dynamically import Lanyard to avoid SSR issues with Three.js
const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading 3D badge...</div>
    </div>
  ),
});

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// Skills logos (SVG files)
const skillLogos = [
  { name: 'Photoshop', logo: '/assets/svg/adobe-photoshop-2.svg' },
  { name: 'After Effects', logo: '/assets/svg/after-effects-1.svg' },
  { name: 'DaVinci Resolve', logo: '/assets/svg/davinci-resolve-12.svg' },
  { name: 'Premiere Pro', logo: '/assets/svg/premiere-pro-cc.svg' },
  { name: 'Final Cut Pro', logo: '/assets/svg/final-cut-pro-x.svg' },
  { name: 'Logic Pro X', logo: '/assets/svg/logic-pro-x.svg' },
  { name: 'Microsoft', logo: '/assets/svg/microsoft.svg' },
];

// Duplicate logos to create a longer marquee
const skills = [
  ...skillLogos,
  ...skillLogos,
  ...skillLogos,
  ...skillLogos,
  ...skillLogos,
];

export default function LicensesCertifications() {
  const containerRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger animations
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        // Animate section title and description
        gsap.from('.licenses-header', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.licenses-header',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });

        // Animate 3D badge container
        gsap.from('.lanyard-container', {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lanyard-container',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Animate EASA description
        gsap.from('.easa-description', {
          opacity: 0,
          x: 30,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.easa-description',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Curved marquee animation (horizontal with arc effect)
        const marqueeTrack = containerRef.current?.querySelector(
          '.marquee-track',
        ) as HTMLElement;
        const skillItems = gsap.utils.toArray('.skill-item') as HTMLElement[];

        if (marqueeTrack && skillItems.length > 0) {
          const trackWidth = marqueeTrack.scrollWidth / 2; // Half because we duplicate

          // Infinite horizontal scroll (slower)
          gsap.to(marqueeTrack, {
            x: -trackWidth,
            duration: 80,
            ease: 'none',
            repeat: -1,
          });

          // Add curved effect to items based on their position
          skillItems.forEach((item) => {
            gsap.to(item, {
              duration: 80,
              ease: 'none',
              repeat: -1,
              onUpdate() {
                // Get item's current X position relative to viewport
                const rect = item.getBoundingClientRect();
                const viewportCenter = window.innerWidth / 2;
                const itemCenter = rect.left + rect.width / 2;

                // Calculate distance from viewport center (-1 to 1)
                const distanceFromCenter = (itemCenter - viewportCenter) / viewportCenter;

                // Create arc: items at center go down, edges go up (inverted)
                const arcHeight = 120;
                const yOffset = -(distanceFromCenter ** 2) * arcHeight;

                gsap.set(item, {
                  y: yOffset,
                  rotateY: distanceFromCenter * 15, // Slight 3D rotation
                });
              },
            });
          });
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="licenses-header text-center mb-8 md:mb-12">
          {/* Main Title */}
          <h2 className="font-bacasime text-2xl md:text-3xl text-black">
            Licenze e Competenze
          </h2>
        </div>

        {/* Content Grid: 3D Badge + Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 3D Interactive Lanyard Badge */}
          <div className="lanyard-container w-full">
            <Lanyard />
            <p className="text-xs text-gray-400 text-center mt-4">
              Drag and interact with the 3D badge
            </p>
          </div>

          {/* EASA License Description */}
          <div className="easa-description font-lora text-gray-600 space-y-4">
            <div>
              <h3 className="font-bacasime text-lg text-black mb-2">
                Cos'è la Licenza EASA?
              </h3>
              <p className="leading-relaxed">
                L'
                <strong>EASA</strong>
                {' '}
                (European Union Aviation Safety Agency) è
                l'agenzia dell'Unione Europea responsabile della regolamentazione
                dei droni e dei sistemi aeromobili senza pilota (UAS). La licenza
                EASA per droni certifica le competenze professionali per operazioni
                aeree con APR secondo le normative europee.
              </p>
            </div>

            <div>
              <h4 className="font-bacasime text-base text-black mb-2">
                Competenze Certificate
              </h4>
              <ul className="space-y-2 leading-relaxed">
                <li>✓ Pilotaggio droni categoria A1, A2, A3</li>
                <li>✓ Normative UAS e spazio aereo</li>
                <li>✓ Valutazione rischi e sicurezza operativa</li>
                <li>✓ Riprese aeree professionali e cinematografia</li>
              </ul>
            </div>

            <p className="text-sm italic text-gray-500 pt-2">
              Certificazione europea per operazioni professionali con droni,
              riconosciuta a livello internazionale per garantire sicurezza e qualità.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Marquee - Curved Horizontal (Full Width) */}
      <div
        className="mt-8 md:mt-12 relative overflow-hidden pt-48 pb-16 w-full"
        style={{ perspective: '1000px' }}
      >
        {/* Curved marquee track */}
        <div className="marquee-track flex gap-12 md:gap-16 items-center">
          {/* First set of skills */}
          {skills.map((skill, idx) => (
            <div
              key={`skill-1-${skill.name}-${idx}`}
              className="skill-item flex-shrink-0"
            >
              <Image
                src={skill.logo}
                alt={skill.name}
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {skills.map((skill, idx) => (
            <div
              key={`skill-2-${skill.name}-${idx}`}
              className="skill-item flex-shrink-0"
            >
              <Image
                src={skill.logo}
                alt={skill.name}
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
