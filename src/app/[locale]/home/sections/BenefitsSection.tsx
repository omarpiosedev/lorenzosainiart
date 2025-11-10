'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { TrustedUsers } from '@/components/lightswind/trustedusers';
import { ShimmerLabel } from '@/components/ui';
import { Compare } from '@/components/ui/compare';
import clockAnimation from '../../../../../public/assets/animations/12-hr-clock.json';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BenefitsSection() {
  // Container ref for GSAP scope - enables proper cleanup
  const sectionRef = useRef<HTMLDivElement>(null);

  // Desktop refs
  const cameraImageDesktopRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const clockDesktopRef = useRef<HTMLDivElement>(null);
  const quintaImageDesktopRef = useRef<HTMLDivElement>(null);
  const trustedUsersDesktopRef = useRef<HTMLDivElement>(null);
  const polaroidDesktopRef = useRef<HTMLDivElement>(null);

  // Mobile refs
  const cameraImageMobileRef = useRef<HTMLDivElement>(null);
  const leftHandMobileRef = useRef<HTMLDivElement>(null);
  const rightHandMobileRef = useRef<HTMLDivElement>(null);
  const clockMobileRef = useRef<HTMLDivElement>(null);
  const quintaImageMobileRef = useRef<HTMLDivElement>(null);
  const trustedUsersMobileRef = useRef<HTMLDivElement>(null);
  const polaroidMobileRef = useRef<HTMLDivElement>(null);

  // React 19.2 + GSAP: Refs to save all tweens and ScrollTriggers for proper memory management
  const scrollAnimationsRef = useRef<gsap.core.Tween[]>([]);
  const quintaScaleTweensRef = useRef<gsap.core.Tween[]>([]);
  const trustedUsersTriggersRef = useRef<ScrollTrigger[]>([]);
  const polaroidTweensRef = useRef<gsap.core.Tween[]>([]);

  // ✅ OPTIMIZED: Use ref instead of state to avoid re-renders during scroll
  // Context7 best practice: State updates in ScrollTrigger callbacks can cause unwanted re-renders
  const restartTriggerRef = useRef(0);
  const [restartTrigger, setRestartTrigger] = useState(0);
  const t = useTranslations('HomePage.sez4');

  // Modern useGSAP hook replaces useEffect for automatic cleanup
  // React 19.2 + GSAP: Save all tweens in refs for proper memory management
  useGSAP(() => {
    // Clear all ref arrays at the start
    scrollAnimationsRef.current = [];
    quintaScaleTweensRef.current = [];
    trustedUsersTriggersRef.current = [];
    polaroidTweensRef.current = [];

    // ✅ OPTIMIZED: Helper function to reduce code duplication
    // React 19.2 + GSAP: Save tween in ref for memory management
    const createScrollAnimation = (
      ref: React.RefObject<HTMLDivElement | null>,
      fromValue: string,
      toValue: string,
      property: 'top' | 'left' | 'right' | 'width' | 'height' = 'top',
    ) => {
      if (!ref.current) {
        return;
      }

      const tween = gsap.fromTo(
        ref.current,
        { [property]: fromValue },
        {
          [property]: toValue,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 120%',
            end: 'top 60%',
            scrub: 2,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true, // ✅ Added: Recalculate on resize
          },
        },
      );

      // Save tween to ref for React 19.2 memory management
      scrollAnimationsRef.current.push(tween);
    };

    // ✅ OPTIMIZED: Camera animations (desktop & mobile) - using helper
    createScrollAnimation(cameraImageDesktopRef, '35vh', '18vh', 'top');
    createScrollAnimation(cameraImageMobileRef, '50%', '30%', 'top');

    // ✅ OPTIMIZED: Hand animations (desktop & mobile) - using helper
    createScrollAnimation(leftHandRef, '13.23vw', '11vw', 'right');
    createScrollAnimation(rightHandRef, '13.54vw', '11vw', 'left');
    createScrollAnimation(leftHandMobileRef, '57.39%', '47%', 'right');
    createScrollAnimation(rightHandMobileRef, '65.34%', '55%', 'left');

    // ✅ OPTIMIZED: Clock animations (desktop & mobile) - using helper
    createScrollAnimation(clockDesktopRef, '150px', '80px', 'top');
    createScrollAnimation(clockMobileRef, '150px', '80px', 'top');

    // ✅ OPTIMIZED: Quinta image scale animations (GPU-accelerated)
    // React 19.2 + GSAP: Save tween in ref for memory management
    // Animate the image element inside the container for zoom-out effect
    // Desktop - zoom from 2.99x down to 2.3x (maintains the original scale design)
    if (quintaImageDesktopRef.current) {
      const imgElement = quintaImageDesktopRef.current.querySelector('img');
      if (imgElement) {
        const tween = gsap.fromTo(
          imgElement,
          { scale: 2.99 },
          {
            scale: 2.3,
            ease: 'none',
            scrollTrigger: {
              trigger: quintaImageDesktopRef.current,
              start: 'top 120%',
              end: 'top 60%',
              scrub: 2,
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          },
        );
        // Save tween to ref for React 19.2 memory management
        quintaScaleTweensRef.current.push(tween);
      }
    }

    // Mobile - zoom from 1.4x down to 1x
    if (quintaImageMobileRef.current) {
      const imgElement = quintaImageMobileRef.current.querySelector('img');
      if (imgElement) {
        const tween = gsap.fromTo(
          imgElement,
          { scale: 1.4 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: quintaImageMobileRef.current,
              start: 'top 120%',
              end: 'top 60%',
              scrub: 2,
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          },
        );
        // Save tween to ref for React 19.2 memory management
        quintaScaleTweensRef.current.push(tween);
      }
    }

    // ✅ OPTIMIZED: TrustedUsers restart trigger (Card 6 - Desktop)
    // React 19.2 + GSAP: Save ScrollTrigger in ref for memory management
    // Use ref for tracking, setState only once for React re-render
    // Context7 best practice: Avoid setState in scroll callbacks to prevent re-render storms
    if (trustedUsersDesktopRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: trustedUsersDesktopRef.current,
        start: 'top 80%',
        onEnter: () => {
          restartTriggerRef.current += 1;
          setRestartTrigger(restartTriggerRef.current); // Trigger re-render for TrustedUsers
        },
        onEnterBack: () => {
          restartTriggerRef.current += 1;
          setRestartTrigger(restartTriggerRef.current);
        },
      });
      // Save ScrollTrigger to ref for React 19.2 memory management
      trustedUsersTriggersRef.current.push(trigger);
    }

    // ✅ OPTIMIZED: TrustedUsers restart trigger (Card 6 - Mobile)
    // React 19.2 + GSAP: Save ScrollTrigger in ref for memory management
    if (trustedUsersMobileRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: trustedUsersMobileRef.current,
        start: 'top 80%',
        onEnter: () => {
          restartTriggerRef.current += 1;
          setRestartTrigger(restartTriggerRef.current);
        },
        onEnterBack: () => {
          restartTriggerRef.current += 1;
          setRestartTrigger(restartTriggerRef.current);
        },
      });
      // Save ScrollTrigger to ref for React 19.2 memory management
      trustedUsersTriggersRef.current.push(trigger);
    }

    // ✅ OPTIMIZED: Helper for polaroid scatter animations
    // React 19.2 + GSAP: Save tween in ref for memory management
    const createPolaroidScatter = (
      ref: React.RefObject<HTMLDivElement | null>,
      positions: Array<{ x: number; y: number; rotation: number }>,
    ) => {
      if (!ref.current) {
        return;
      }

      const polaroids = ref.current.querySelectorAll('.polaroid');

      // Set initial state - all stacked on top of each other
      gsap.set(polaroids, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: i => polaroids.length - i,
      });

      const tween = gsap.to(polaroids, {
        rotation: i => positions[i]?.rotation || 0,
        x: i => positions[i]?.x || 0,
        y: i => positions[i]?.y || 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.4)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Save tween to ref for React 19.2 memory management
      polaroidTweensRef.current.push(tween);
    };

    // ✅ OPTIMIZED: Polaroid animations - using helper
    createPolaroidScatter(polaroidDesktopRef, [
      { x: -80, y: -60, rotation: -20 },
      { x: 100, y: -40, rotation: 15 },
      { x: 10, y: 10, rotation: 3 },
      { x: -90, y: 80, rotation: -12 },
      { x: 85, y: 90, rotation: 18 },
    ]);

    createPolaroidScatter(polaroidMobileRef, [
      { x: -50, y: -40, rotation: -18 },
      { x: 60, y: -30, rotation: 12 },
      { x: 5, y: 5, rotation: 2 },
      { x: -55, y: 50, rotation: -10 },
      { x: 50, y: 60, rotation: 16 },
    ]);

    // CRITICAL: Complete cleanup to prevent DOM errors during navigation
    // React 19.2 + GSAP: Kill all tweens and ScrollTriggers BEFORE React unmounts
    return () => {
      // Kill all scroll animation tweens
      scrollAnimationsRef.current.forEach((tween) => {
        try {
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        } catch {
          // Silently ignore if already killed
        }
      });

      // Kill all quinta scale tweens
      quintaScaleTweensRef.current.forEach((tween) => {
        try {
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        } catch {
          // Silently ignore if already killed
        }
      });

      // Kill all TrustedUsers ScrollTriggers
      trustedUsersTriggersRef.current.forEach((trigger) => {
        try {
          trigger.kill();
        } catch {
          // Silently ignore if already killed
        }
      });

      // Kill all polaroid animation tweens
      polaroidTweensRef.current.forEach((tween) => {
        try {
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        } catch {
          // Silently ignore if already killed
        }
      });

      // Clear all ref arrays
      scrollAnimationsRef.current = [];
      quintaScaleTweensRef.current = [];
      trustedUsersTriggersRef.current = [];
      polaroidTweensRef.current = [];
    };
  }, {
    // Empty dependencies array - animations only run once on mount
    dependencies: [],
    // Scope to sectionRef - limits GSAP context to this container for better cleanup
    scope: sectionRef,
    // revertOnUpdate ensures all GSAP properties are reverted on re-render
    revertOnUpdate: true,
  });

  return (
    <div ref={sectionRef} data-section="benefits" className="relative bg-white" style={{ minHeight: '160vh' }}>
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
          <ShimmerLabel className="w-full h-full text-sm font-medium tracking-wide">
            {t('benefitsLabel')}
          </ShimmerLabel>
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
                src="/assets/images/BenefitsCard/0540d16f-f5f9-4418-be0b-8aef4fe3b5465ecb.webp"
                alt="Portfolio work 1"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Polaroid 2 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/BenefitsCard/17703902-a4f5-480c-9e90-262e76cd18c1_rw_1920e304.webp"
                alt="Portfolio work 2"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Polaroid 3 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/BenefitsCard/bed90b78-ab84-4521-8013-884324b73e5f_car_3x4f19e.webp"
                alt="Portfolio work 3"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Polaroid 4 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/BenefitsCard/fca350ae-e988-408f-b48d-295c227f5627a5a0.webp"
                alt="Portfolio work 4"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Polaroid 5 */}
            <div className="polaroid absolute bg-white p-2 shadow-lg transform-gpu" style={{ width: '60%', height: '40%' }}>
              <img
                src="/assets/images/BenefitsCard/fe12425f-7171-410c-83c1-8d41fd8b0887ac62.webp"
                alt="Portfolio work 5"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
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
            className="absolute transform-gpu"
            style={{
              right: '-10%',
              bottom: '-10%',
              width: '80%',
              height: '80%',
            }}
          >
            <img
              src="/assets/images/quintacard.webp"
              alt="Portrait Photography - Eyes"
              className="w-full h-full object-contain transform-gpu"
              loading="lazy"
              decoding="async"
              style={{
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
          <ShimmerLabel className="px-6 py-3 text-sm font-medium tracking-wide mb-8 sm:mb-12">
            {t('benefitsLabel')}
          </ShimmerLabel>

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
                    src="/assets/images/BenefitsCard/0540d16f-f5f9-4418-be0b-8aef4fe3b5465ecb.webp"
                    alt="Portfolio work 1"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Polaroid 2 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/BenefitsCard/17703902-a4f5-480c-9e90-262e76cd18c1_rw_1920e304.webp"
                    alt="Portfolio work 2"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Polaroid 3 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/BenefitsCard/bed90b78-ab84-4521-8013-884324b73e5f_car_3x4f19e.webp"
                    alt="Portfolio work 3"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Polaroid 4 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/BenefitsCard/fca350ae-e988-408f-b48d-295c227f5627a5a0.webp"
                    alt="Portfolio work 4"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Polaroid 5 */}
                <div className="polaroid absolute bg-white p-1.5 shadow-lg transform-gpu" style={{ width: '65%', height: '35%' }}>
                  <img
                    src="/assets/images/BenefitsCard/fe12425f-7171-410c-83c1-8d41fd8b0887ac62.webp"
                    alt="Portfolio work 5"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
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
                className="absolute transform-gpu"
                style={{
                  top: '-15%',
                  left: '-30%',
                  width: '160%',
                  height: '160%',
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
