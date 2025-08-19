'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { TrustedUsers } from '@/components/lightswind/trustedusers';
import { Compare } from '@/components/ui/compare';
import clockAnimation from '../../../../../public/assets/animations/12-hr-clock.json';

gsap.registerPlugin(ScrollTrigger);

export default function Sez4() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraImageDesktopRef = useRef<HTMLDivElement>(null);
  const cameraImageMobileRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const leftHandMobileRef = useRef<HTMLDivElement>(null);
  const rightHandMobileRef = useRef<HTMLDivElement>(null);
  const clockDesktopRef = useRef<HTMLDivElement>(null);
  const clockMobileRef = useRef<HTMLDivElement>(null);
  const quintaImageDesktopRef = useRef<HTMLDivElement>(null);
  const quintaImageMobileRef = useRef<HTMLDivElement>(null);
  const trustedUsersDesktopRef = useRef<HTMLDivElement>(null);
  const trustedUsersMobileRef = useRef<HTMLDivElement>(null);
  const polaroidDesktopRef = useRef<HTMLDivElement>(null);
  const polaroidMobileRef = useRef<HTMLDivElement>(null);
  const [restartTrigger, setRestartTrigger] = useState(0);
  const t = useTranslations('HomePage.sez4');

  useEffect(() => {
    // Desktop animation
    if (cameraImageDesktopRef.current) {
      // Imposta posizione iniziale
      gsap.set(cameraImageDesktopRef.current, { top: '35vh' });

      gsap.to(cameraImageDesktopRef.current, {
        top: '18vh',
        ease: 'none',
        scrollTrigger: {
          trigger: cameraImageDesktopRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Mobile animation
    if (cameraImageMobileRef.current) {
      // Imposta posizione iniziale
      gsap.set(cameraImageMobileRef.current, { top: '50%' });

      gsap.to(cameraImageMobileRef.current, {
        top: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: cameraImageMobileRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Left hand animation (moves to the right)
    if (leftHandRef.current) {
      // Imposta posizione iniziale
      gsap.set(leftHandRef.current, { right: '13.23vw' });

      gsap.to(leftHandRef.current, {
        right: '11vw', // Movimento ridotto
        ease: 'none',
        scrollTrigger: {
          trigger: leftHandRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Right hand animation (moves to the left)
    if (rightHandRef.current) {
      // Imposta posizione iniziale
      gsap.set(rightHandRef.current, { left: '13.54vw' });

      gsap.to(rightHandRef.current, {
        left: '11vw', // Movimento ridotto
        ease: 'none',
        scrollTrigger: {
          trigger: rightHandRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Mobile left hand animation (moves to the right)
    if (leftHandMobileRef.current) {
      // Imposta posizione iniziale
      gsap.set(leftHandMobileRef.current, { right: '57.39%' });

      gsap.to(leftHandMobileRef.current, {
        right: '47%', // Movimento aumentato per mobile
        ease: 'none',
        scrollTrigger: {
          trigger: leftHandMobileRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Mobile right hand animation (moves to the left)
    if (rightHandMobileRef.current) {
      // Imposta posizione iniziale
      gsap.set(rightHandMobileRef.current, { left: '65.34%' });

      gsap.to(rightHandMobileRef.current, {
        left: '55%', // Movimento aumentato per mobile
        ease: 'none',
        scrollTrigger: {
          trigger: rightHandMobileRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Clock Desktop animation
    if (clockDesktopRef.current) {
      // Imposta posizione iniziale
      gsap.set(clockDesktopRef.current, { top: '150px' });

      gsap.to(clockDesktopRef.current, {
        top: '80px',
        ease: 'none',
        scrollTrigger: {
          trigger: clockDesktopRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Clock Mobile animation
    if (clockMobileRef.current) {
      // Imposta posizione iniziale
      gsap.set(clockMobileRef.current, { top: '150px' });

      gsap.to(clockMobileRef.current, {
        top: '80px',
        ease: 'none',
        scrollTrigger: {
          trigger: clockMobileRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Quinta Image Desktop animation - reduce size
    if (quintaImageDesktopRef.current) {
      // Imposta dimensioni iniziali (size aumentata)
      gsap.set(quintaImageDesktopRef.current, {
        width: 'calc(80% + 100px)',
        height: 'calc(80% + 100px)',
      });

      gsap.to(quintaImageDesktopRef.current, {
        width: '80%', // Riduce a dimensioni normali (-100px)
        height: '80%', // Riduce a dimensioni normali (-100px)
        ease: 'none',
        scrollTrigger: {
          trigger: quintaImageDesktopRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Quinta Image Mobile animation - reduce size (preciso)
    if (quintaImageMobileRef.current) {
      // Imposta dimensioni iniziali (size aumentata)
      gsap.set(quintaImageMobileRef.current, {
        width: 'calc(160% + 200px)', // Partenza aumentata
        height: 'calc(160% + 200px)', // Partenza aumentata
      });

      gsap.to(quintaImageMobileRef.current, {
        width: '160%', // Ritorna alle dimensioni originali precise
        height: '160%', // Ritorna alle dimensioni originali precise
        ease: 'none',
        scrollTrigger: {
          trigger: quintaImageMobileRef.current,
          start: 'top 120%',
          end: 'top 60%',
          scrub: 2,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // TrustedUsers restart trigger (Card 6 - Desktop)
    ScrollTrigger.create({
      trigger: trustedUsersDesktopRef.current,
      start: 'top 80%', // Quando Card 6 entra in viewport
      onEnter: () => {
        // Incrementa restartTrigger per forzare il restart del CountUp
        setRestartTrigger(prev => prev + 1);
      },
      onEnterBack: () => {
        // Restart anche quando si scrolla indietro verso la card
        setRestartTrigger(prev => prev + 1);
      },
    });

    // TrustedUsers restart trigger (Card 6 - Mobile)
    ScrollTrigger.create({
      trigger: trustedUsersMobileRef.current,
      start: 'top 80%', // Quando Card 6 entra in viewport
      onEnter: () => {
        // Incrementa restartTrigger per forzare il restart del CountUp
        setRestartTrigger(prev => prev + 1);
      },
      onEnterBack: () => {
        // Restart anche quando si scrolla indietro verso la card
        setRestartTrigger(prev => prev + 1);
      },
    });

    // Polaroid scattered animation - Desktop
    if (polaroidDesktopRef.current) {
      const polaroids = polaroidDesktopRef.current.querySelectorAll('.polaroid');

      // Predefined scattered positions and rotations for each polaroid (more spread out)
      const scatteredPositions = [
        { x: -80, y: -60, rotation: -20 }, // Far top left
        { x: 100, y: -40, rotation: 15 }, // Far top right
        { x: 10, y: 10, rotation: 3 }, // Center (slightly rotated)
        { x: -90, y: 80, rotation: -12 }, // Far bottom left
        { x: 85, y: 90, rotation: 18 }, // Far bottom right
      ];

      // Set initial state - all stacked on top of each other
      gsap.set(polaroids, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: i => polaroids.length - i, // First polaroid on top
      });

      gsap.to(polaroids, {
        rotation: i => scatteredPositions[i]?.rotation || 0,
        x: i => scatteredPositions[i]?.x || 0,
        y: i => scatteredPositions[i]?.y || 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.4)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: polaroidDesktopRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Polaroid scattered animation - Mobile
    if (polaroidMobileRef.current) {
      const polaroids = polaroidMobileRef.current.querySelectorAll('.polaroid');

      // Predefined scattered positions and rotations for mobile (more spread out)
      const scatteredPositionsMobile = [
        { x: -50, y: -40, rotation: -18 }, // Far top left
        { x: 60, y: -30, rotation: 12 }, // Far top right
        { x: 5, y: 5, rotation: 2 }, // Center (slightly rotated)
        { x: -55, y: 50, rotation: -10 }, // Far bottom left
        { x: 50, y: 60, rotation: 16 }, // Far bottom right
      ];

      // Set initial state - all stacked on top of each other
      gsap.set(polaroids, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: i => polaroids.length - i, // First polaroid on top
      });

      gsap.to(polaroids, {
        rotation: i => scatteredPositionsMobile[i]?.rotation || 0,
        x: i => scatteredPositionsMobile[i]?.x || 0,
        y: i => scatteredPositionsMobile[i]?.y || 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.4)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: polaroidMobileRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} data-section="sez4" className="relative bg-white" style={{ minHeight: '160vh' }}>
      {/* Desktop Layout - Scales proportionally based on 1920x1080 design */}
      <div className="hidden xl:block">
        {/* Benefits Button - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '8.33vh', // ~90px / 1080px (raised from 116px)
            left: '47.14vw', // 905px / 1920px
            width: '5.73vw', // 110px / 1920px
            height: '3.98vh', // 43px / 1080px
          }}
        >
          <div className="inline-flex items-center justify-center w-full h-full bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
            {t('benefitsLabel')}
          </div>
        </div>

        {/* Title - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '13.89vh', // ~150px / 1080px (raised from 172px)
            left: '38.54vw', // 740px / 1920px
            width: '22.86vw', // 439px / 1920px
            height: '8.33vh', // 90px / 1080px
          }}
        >
          <h2
            className="font-bold text-black leading-tight text-center flex items-center justify-center w-full h-full"
            style={{
              fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '3.33vw', // 64px / 1920px, scales proportionally
            }}
          >
            {t('title')}
          </h2>
        </div>

        {/* Subtitle - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '26vh', // Abbassato ulteriormente
            left: '35.99vw', // 691px / 1920px
            width: '28.02vw', // 538px / 1920px
            height: '5.56vh', // 60px / 1080px
          }}
        >
          <p
            className="text-gray-800 leading-relaxed text-center flex items-center justify-center w-full h-full"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '1.25vw', // Proportional font size
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* First 3 Cards - Desktop Layout - Empty */}
        {/* Card 1 - Portrait Gallery */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-4"
          style={{
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '18.23vw', // ~350px (425px scaled down)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '57.88vh', // ~625px (521px * 1.2)
          }}
        >
          {/* Polaroid Container */}
          <div
            ref={polaroidDesktopRef}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Polaroid 1 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/4831a354-4deb-472f-9f1e-cad013deab74.webp"
                alt="Portrait 1"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="h-4 bg-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-handwriting">Portrait 1</span>
              </div>
            </div>

            {/* Polaroid 2 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/ChatGPT Image 19 ago 2025, 18_30_36.webp"
                alt="Portrait 2"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="h-4 bg-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-handwriting">Portrait 2</span>
              </div>
            </div>

            {/* Polaroid 3 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/ChatGPT Image 19 ago 2025, 18_30_41.webp"
                alt="Portrait 3"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="h-4 bg-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-handwriting">Portrait 3</span>
              </div>
            </div>

            {/* Polaroid 4 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/e05dd087-50aa-42dd-a47b-8eabbb6823e3.webp"
                alt="Portrait 4"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="h-4 bg-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-handwriting">Portrait 4</span>
              </div>
            </div>

            {/* Polaroid 5 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/f0137b66-fcfa-4e3d-8374-2b822059a091.webp"
                alt="Portrait 5"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="h-4 bg-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-handwriting">Portrait 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Equipment */}
        <div
          className="absolute rounded-2xl p-6 flex flex-col shadow-sm overflow-hidden"
          style={{
            backgroundColor: '#f3f4f6',
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '40.78vw', // ~783px (790px scaled)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '57.88vh', // ~625px (521px * 1.2)
          }}
        >
          {/* Text - Top */}
          <div
            className="absolute text-center flex items-center justify-center"
            style={{
              top: '3.24vh', // 35px / 1080px = 3.24vh
              left: '1.61vw', // 31px / 1920px = 1.61vw
              width: '17.97vw', // 345px / 1920px = 17.97vw
              height: '8.24vh', // 89px / 1080px = 8.24vh
            }}
          >
            <h3
              className="text-black font-semibold leading-tight"
              style={{
                fontSize: '1.77vw', // 34px / 1920px = 1.77vw
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {t('benefits.equipment.title')}
            </h3>
          </div>

          {/* Camera Lens Image - Bottom */}
          <div
            ref={cameraImageDesktopRef}
            className="absolute"
            style={{
              left: '2vw', // Expanded left margin
              right: '2vw', // Expanded right margin
              width: '17.20vw', // Increased width
              height: '50vh', // Increased height for larger image
            }}
          >
            <img
              src="/assets/images/camera-lens.webp"
              alt="Professional Camera Lens"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Card 3 - Compare Component */}
        <div
          className="absolute rounded-2xl overflow-hidden"
          style={{
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '63.33vw', // ~1216px (1155px scaled)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '57.88vh', // ~625px (521px * 1.2)
          }}
        >
          <Compare
            firstImage="/assets/images/fotononeditata.webp"
            secondImage="/assets/images/fotoeditata.webp"
            className="w-full h-full"
            slideMode="drag"
            showHandlebar={true}
            autoplay={true}
            autoplayDuration={4000}
            firstImageClassName="object-cover"
            secondImageClassName="object-cover"
          />

          {/* Text Overlay - Bottom */}
          <div
            className="absolute text-center flex items-center justify-center"
            style={{
              bottom: '0',
              left: '0',
              right: '0',
              height: '8.24vh', // Stessa altezza della Card 2 (89px / 1080px = 8.24vh)
            }}
          >
            <h3
              className="text-white font-semibold leading-tight"
              style={{
                fontSize: '1.77vw', // Stessa grandezza delle altre card (34px / 1920px = 1.77vw)
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              }}
            >
              {t('benefits.editing.title')}
            </h3>
          </div>
        </div>

        {/* Card 4 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '102vh', // Spostato più in basso per nuove dimensioni
            left: '18.23vw', // ~350px (425px scaled down)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '49.46vh', // ~534px (445px * 1.2)
          }}
        >
          {/* Mano Sinistra - 262x152, top 92, destra 254 */}
          <div
            ref={leftHandRef}
            className="absolute"
            style={{
              top: '17vh', // Abbassata ulteriormente
              width: '13.65vw', // 262px / 1920px = 13.65vw
              height: '14.07vh', // 152px / 1080px = 14.07vh
            }}
          >
            <img
              src="/assets/images/manosinistra.webp"
              alt="Left Hand"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Mano Destra - 210x115, top 131, sinistra 260 */}
          <div
            ref={rightHandRef}
            className="absolute"
            style={{
              top: '19vh', // Abbassata
              width: '10.94vw', // 210px / 1920px = 10.94vw
              height: '10.65vh', // 115px / 1080px = 10.65vh
            }}
          >
            <img
              src="/assets/images/manodestra.webp"
              alt="Right Hand"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Scritta Seamless client experience - 285x83.35, font size 38, top 324, sinistra destra 61 */}
          <div
            className="absolute text-center flex items-center justify-center"
            style={{
              top: '38vh', // Abbassata
              left: '3.18vw', // 61px / 1920px = 3.18vw
              right: '3.18vw', // 61px / 1920px = 3.18vw
              width: '14.84vw', // 285px / 1920px = 14.84vw
              height: '7.72vh', // 83.35px / 1080px = 7.72vh
            }}
          >
            <h3
              className="text-black font-semibold leading-tight"
              style={{
                fontSize: '1.77vw', // Stessa grandezza della Card 2 (34px / 1920px = 1.77vw)
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Seamless client
              <br />
              experience
            </h3>
          </div>
        </div>

        {/* Card 5 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '102vh', // Spostato più in basso per nuove dimensioni
            left: 'calc(100vw - 44.06vw - 15.47vw)', // Stessa distanza dal margine destro della Card 3
            width: '44.06vw', // ~846px (705px * 1.2) - dimensione originale
            height: '26.40vh', // ~285px (238px * 1.2) - dimensione originale
          }}
        >
          <div
            ref={quintaImageDesktopRef}
            className="absolute"
            style={{
              right: '-10%', // Posizione originale: -10% della card
              bottom: '-10%', // Posizione originale: -10% della card
              width: 'calc(80% + 100px)', // Ingrandita di 100px in larghezza (iniziale)
              height: 'calc(80% + 100px)', // Ingrandita di 100px in altezza (iniziale)
            }}
          >
            <img
              src="/assets/images/quintacard.webp"
              alt="Portrait Photography - Eyes"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              style={{
                transform: 'scale(2.3)', // Scala originale: 2.3x
                transformOrigin: 'center center',
              }}
            />
          </div>

          {/* Text Overlay */}
          <div
            className="absolute text-left flex items-center"
            style={{
              top: '13.20vh', // 50% convertito: 50% di 26.40vh = 13.20vh
              left: '2.20vw', // 5% convertito: 5% di 44.06vw = 2.20vw
              width: '22.03vw', // 50% convertito: 50% di 44.06vw = 22.03vw
              height: '8.24vh', // Stessa altezza delle altre card
              transform: 'translateY(-50%)', // Centrato verticalmente
              zIndex: 10, // Davanti all'overlay
            }}
          >
            <h3
              className="text-black font-semibold leading-tight"
              style={{
                fontSize: '1.77vw', // Stessa dimensione delle altre card
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Tailored to
              <br />
              your vision
            </h3>
          </div>

          {/* Overlay fade from left - Desktop only */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #f3f4f6 0%, #f3f4f6 30%, rgba(243, 244, 246, 0.6) 45%, rgba(243, 244, 246, 0.3) 55%, transparent 65%)',
            }}
          />
        </div>

        {/* Card 6 - Desktop Layout */}
        <div
          ref={trustedUsersDesktopRef}
          className="absolute bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-4"
          style={{
            top: 'calc(130vh + 4px)', // Spostato 4px più in basso
            left: '40.78vw', // ~783px (790px scaled)
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '20.53vh', // ~222px (185px * 1.2)
          }}
        >
          <div className="flex items-center justify-center w-full h-full">
            <TrustedUsers
              avatars={[]}
              rating={5}
              totalUsersText={300}
              caption="satisfied"
              className="text-center"
              starColorClass="text-orange-500"
              ringColors={[]}
              starSize="2vw" // Stelle grandi per desktop (basate su viewport width)
              numberSize="4vw" // Numero molto grande per desktop
              textSize="1.2vw" // Testo proporzionale per desktop
              restartTrigger={restartTrigger}
            />
          </div>
        </div>

        {/* Card 7 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: 'calc(130vh + 4px)', // Spostato 4px più in basso
            left: 'calc(100vw - 21.31vw - 15.47vw)', // Stessa distanza dal margine destro della Card 3
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '20.53vh', // ~222px (185px * 1.2)
          }}
        >
          {/* Text */}
          <div
            className="absolute w-full text-center"
            style={{ top: '32px' }}
          >
            <h3
              className="text-black font-semibold leading-tight"
              style={{
                fontSize: '1.5vw', // Ingrandito
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              7 day turnaround
            </h3>
          </div>

          {/* Clock Animation */}
          <div
            ref={clockDesktopRef}
            className="absolute"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: '224px',
              height: '224px',
            }}
          >
            <Lottie
              animationData={clockAnimation}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet responsive layout */}
      <div className="xl:hidden min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-start pt-16 sm:pt-20 lg:pt-24">

          {/* Benefits Button - Mobile/Tablet */}
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide mb-8 sm:mb-12">
            {t('benefitsLabel')}
          </div>

          {/* Title - Mobile/Tablet */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight text-center mb-6 sm:mb-8 lg:mb-10"
            style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('title')}
          </h2>

          {/* Subtitle - Mobile/Tablet */}
          <p
            className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('subtitle')}
          </p>

          {/* Cards - Mobile/Tablet Layout - Empty (All stacked vertically) */}
          <div className="flex flex-col gap-6 w-full max-w-sm sm:max-w-lg lg:max-w-xl">

            {/* Card 1 - Mobile/Tablet - Portrait Gallery - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden flex items-center justify-center p-4" style={{ aspectRatio: '352/522' }}>
              {/* Polaroid Container */}
              <div
                ref={polaroidMobileRef}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Polaroid 1 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/4831a354-4deb-472f-9f1e-cad013deab74.webp"
                    alt="Portrait 1"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="h-3 bg-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">Portrait 1</span>
                  </div>
                </div>

                {/* Polaroid 2 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/ChatGPT Image 19 ago 2025, 18_30_36.webp"
                    alt="Portrait 2"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="h-3 bg-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">Portrait 2</span>
                  </div>
                </div>

                {/* Polaroid 3 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/ChatGPT Image 19 ago 2025, 18_30_41.webp"
                    alt="Portrait 3"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="h-3 bg-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">Portrait 3</span>
                  </div>
                </div>

                {/* Polaroid 4 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/e05dd087-50aa-42dd-a47b-8eabbb6823e3.webp"
                    alt="Portrait 4"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="h-3 bg-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">Portrait 4</span>
                  </div>
                </div>

                {/* Polaroid 5 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/f0137b66-fcfa-4e3d-8374-2b822059a091.webp"
                    alt="Portrait 5"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="h-3 bg-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">Portrait 5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Mobile/Tablet - Equipment - Responsive aspect ratio 352:522 */}
            <div className="relative rounded-2xl w-full p-6 flex flex-col shadow-sm overflow-hidden" style={{ aspectRatio: '352/522', backgroundColor: '#f3f4f6' }}>
              {/* Text - Top */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  top: '6.7%', // 35px / 522px = 6.7% della card
                  left: '7.7%', // 27px / 352px = 7.7% della card
                  width: '84.7%', // 298px / 352px = 84.7% della card
                  height: '17%', // 89px / 522px = 17% della card
                }}
              >
                <h3
                  className="font-semibold text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Font size che si scala con il viewport come l'immagine
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {t('benefits.equipment.title')}
                </h3>
              </div>

              {/* Camera Lens Image - Bottom */}
              <div
                ref={cameraImageMobileRef}
                className="absolute"
                style={{
                  left: '9.9%', // 35px / 352px = 9.9% della card mobile
                  right: '9.9%', // 35px / 352px = 9.9% della card mobile
                  width: '79.8%', // 281px / 352px = 79.8% della card mobile
                  height: '93.9%', // 490px / 522px = 93.9% della card mobile
                }}
              >
                <img
                  src="/assets/images/camera-lens.webp"
                  alt="Professional Camera Lens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Card 3 - Mobile/Tablet - Compare Component - Responsive aspect ratio 352:522 */}
            <div className="relative rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              <Compare
                firstImage="/assets/images/fotononeditata.webp"
                secondImage="/assets/images/fotoeditata.webp"
                className="w-full h-full"
                slideMode="drag"
                showHandlebar={true}
                autoplay={true}
                autoplayDuration={4000}
                firstImageClassName="object-cover"
                secondImageClassName="object-cover"
              />

              {/* Text Overlay - Bottom */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '17%', // Stessa altezza proporzionale della Card 2 mobile (89px / 522px = 17%)
                }}
              >
                <h3
                  className="font-semibold text-white leading-tight"
                  style={{
                    fontSize: '4.5vh', // Stessa grandezza delle altre card mobile
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {t('benefits.editing.title')}
                </h3>
              </div>
            </div>

            {/* Card 4 - Mobile/Tablet - Experience - Responsive aspect ratio 352:522 */}
            <div className="relative rounded-2xl w-full p-6 flex flex-col shadow-sm overflow-hidden" style={{ aspectRatio: '352/522', backgroundColor: '#f3f4f6' }}>
              {/* Mano Sinistra - 262x152, top 109, destra 202 */}
              <div
                ref={leftHandMobileRef}
                className="absolute"
                style={{
                  top: '24%', // Abbassata ulteriormente (era 20.88%)
                  width: '74.43%', // 262px / 352px = 74.43%
                  height: '29.12%', // 152px / 522px = 29.12%
                }}
              >
                <img
                  src="/assets/images/manosinistra.webp"
                  alt="Left Hand"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Mano Destra - 210x115, top 159, sinistra 230 */}
              <div
                ref={rightHandMobileRef}
                className="absolute"
                style={{
                  top: '30.46%', // 159px / 522px = 30.46%
                  width: '59.66%', // 210px / 352px = 59.66%
                  height: '22.03%', // 115px / 522px = 22.03%
                }}
              >
                <img
                  src="/assets/images/manodestra.webp"
                  alt="Right Hand"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Scritta - 285x83.35, font size 38, top 387, sinistra destra 34 */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  top: '74.14%', // 387px / 522px = 74.14%
                  left: '9.66%', // 34px / 352px = 9.66%
                  right: '9.66%', // 34px / 352px = 9.66%
                  width: '80.97%', // 285px / 352px = 80.97%
                  height: '15.96%', // 83.35px / 522px = 15.96%
                }}
              >
                <h3
                  className="font-semibold text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Stessa grandezza della Card 2 mobile
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Seamless client
                  <br />
                  experience
                </h3>
              </div>
            </div>

            {/* Card 5 - Mobile/Tablet - Responsive aspect ratio 352:522 */}
            <div className="relative bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              {/* Image - Much larger */}
              <div
                ref={quintaImageMobileRef}
                className="absolute"
                style={{
                  top: '-15%',
                  left: '-30%',
                  width: 'calc(160% + 200px)', // Ingrandita di 200px in larghezza (iniziale enfatizzata)
                  height: 'calc(160% + 200px)', // Ingrandita di 200px in altezza (iniziale enfatizzata)
                }}
              >
                <img
                  src="/assets/images/quintacard.webp"
                  alt="Portrait Photography - Eyes"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Text - Top positioned and centered */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  top: '6.7%', // 35px / 522px = 6.7% della card
                  left: '7.7%', // 27px / 352px = 7.7% della card
                  width: '84.7%', // 298px / 352px = 84.7% della card
                  height: '17%', // 89px / 522px = 17% della card
                  zIndex: 10,
                }}
              >
                <h3
                  className="font-semibold text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Font size che si scala con il viewport come l'immagine
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Tailored to
                  <br />
                  your vision
                </h3>
              </div>

              {/* Overlay fade from top */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, #f3f4f6 0%, #f3f4f6 30%, rgba(243, 244, 246, 0.6) 45%, rgba(243, 244, 246, 0.3) 55%, transparent 65%)',
                  zIndex: 5, // Sotto il testo ma sopra l'immagine
                }}
              />
            </div>

            {/* Card 6 - Mobile/Tablet - Responsive aspect ratio 352:201 */}
            <div ref={trustedUsersMobileRef} className="bg-gray-100 rounded-2xl w-full overflow-hidden flex items-center justify-center p-4" style={{ aspectRatio: '352/201' }}>
              <div className="flex items-center justify-center w-full h-full">
                <TrustedUsers
                  avatars={[]}
                  rating={5}
                  totalUsersText={300}
                  caption="satisfied"
                  className="text-center"
                  starColorClass="text-orange-500"
                  ringColors={[]}
                  starSize="5vh" // Stelle grandi per mobile (basate su viewport height)
                  numberSize="8vh" // Numero molto grande per mobile
                  textSize="3vh" // Testo proporzionale per mobile
                  restartTrigger={restartTrigger}
                />
              </div>
            </div>

            {/* Card 7 - Mobile/Tablet - Turnaround - Responsive aspect ratio 352:201 */}
            <div className="relative bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/201' }}>
              {/* Text */}
              <div
                className="absolute w-full text-center"
                style={{ top: '24px' }}
              >
                <h3
                  className="font-semibold text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Font size che si scala con il viewport come nelle altre card
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  7 day turnaround
                </h3>
              </div>

              {/* Clock Animation */}
              <div
                ref={clockMobileRef}
                className="absolute"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '240px',
                  height: '240px',
                }}
              >
                <Lottie
                  animationData={clockAnimation}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
