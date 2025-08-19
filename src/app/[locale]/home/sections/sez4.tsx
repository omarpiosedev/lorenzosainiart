'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Compare } from '@/components/ui/compare';

gsap.registerPlugin(ScrollTrigger);

export default function Sez4() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraImageDesktopRef = useRef<HTMLDivElement>(null);
  const cameraImageMobileRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const leftHandMobileRef = useRef<HTMLDivElement>(null);
  const rightHandMobileRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('HomePage.sez4');

  useEffect(() => {
    // Desktop animation
    if (cameraImageDesktopRef.current) {
      // Imposta posizione iniziale
      gsap.set(cameraImageDesktopRef.current, { top: '35vh' });

      gsap.to(cameraImageDesktopRef.current, {
        top: '12vh',
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
        top: '20%',
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} data-section="sez4" className="relative bg-white min-h-screen">
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
            top: '24.07vh', // ~260px / 1080px (raised from 290px)
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
        {/* Card 1 */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '18.23vw', // ~350px (425px scaled down)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '57.88vh', // ~625px (521px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
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
              className="text-black font-medium leading-tight"
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
              className="text-white font-medium leading-tight"
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
              top: '15vh', // Abbassata
              width: '13.65vw', // 262px / 1920px = 13.65vw
              height: '14.07vh', // 152px / 1080px = 14.07vh
            }}
          >
            <img
              src="/assets/images/manosinistra.webp"
              alt="Left Hand"
              className="w-full h-full object-contain"
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
              className="text-black font-medium leading-tight"
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
            left: '40.78vw', // ~783px (790px scaled)
            width: '44.06vw', // ~846px (705px * 1.2)
            height: '26.40vh', // ~285px (238px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 6 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '130vh', // Spostato più in basso per nuove dimensioni
            left: '40.78vw', // ~783px (790px scaled)
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '20.53vh', // ~222px (185px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 7 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '130vh', // Spostato più in basso per nuove dimensioni
            left: '64.53vw', // ~1239px (1156px scaled)
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '20.53vh', // ~222px (185px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight text-center mb-6 sm:mb-8 lg:mb-10"
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

            {/* Card 1 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
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
                  className="font-medium text-black leading-tight"
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
                  className="font-medium text-white leading-tight"
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
                  top: '20.88%', // 109px / 522px = 20.88%
                  width: '74.43%', // 262px / 352px = 74.43%
                  height: '29.12%', // 152px / 522px = 29.12%
                }}
              >
                <img
                  src="/assets/images/manosinistra.webp"
                  alt="Left Hand"
                  className="w-full h-full object-contain"
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
                  className="font-medium text-black leading-tight"
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

            {/* Card 5 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 6 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 7 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
