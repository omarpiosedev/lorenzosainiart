'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useImperativeHandle, useRef } from 'react';

// Register GSAP plugins at module level (best practice)
gsap.registerPlugin(useGSAP);

type CameraIrisProps = {
  color?: string;
  duration?: number;
  onTransitionComplete?: () => void;
};

export type CameraIrisHandle = {
  transition: () => Promise<void>;
};

/**
 * CameraIris - Cinematic page transition component
 *
 * Provides a professional camera iris wipe effect for page transitions.
 * The iris closes, triggers the route change at midpoint, then reopens.
 *
 * @example
 * const irisRef = useRef<CameraIrisHandle>(null)
 *
 * // Trigger transition
 * await irisRef.current?.transition()
 */
export const CameraIris = ({ ref, color = '#060010', duration = 0.6, onTransitionComplete }: CameraIrisProps & { ref?: React.RefObject<CameraIrisHandle | null> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shuttersRef = useRef<SVGGElement>(null);
  const isAnimatingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    transition: () => {
      return new Promise((resolve) => {
        // Prevent multiple simultaneous transitions
        if (isAnimatingRef.current) {
          resolve();
          return;
        }

        if (!shuttersRef.current || !containerRef.current) {
          resolve();
          return;
        }

        isAnimatingRef.current = true;
        const shutters = shuttersRef.current.querySelectorAll('path');

        // Transform origins for each blade (camera iris effect)
        const transformOrigins = [
          '39% 87%',
          '14% 78%',
          '2% 44%',
          '21% 17%',
          '60% 15%',
          '82% 34%',
          '88% 61%',
          '72% 86%',
        ];

        // Show container at start
        gsap.set(containerRef.current, { display: 'block' });

        // Create timeline: close → reopen (yoyo effect)
        const timeline = gsap.timeline({
          yoyo: true,
          repeat: 1,
          onRepeat: () => {
            // Midpoint: iris fully closed, trigger route change
            onTransitionComplete?.();
          },
          onComplete: () => {
            // Hide container when animation completes
            if (containerRef.current) {
              gsap.set(containerRef.current, { display: 'none' });
            }
            isAnimatingRef.current = false;
            resolve();
          },
        });

        // Animate all blades simultaneously from open (60) to closed (0)
        shutters.forEach((shutter, index) => {
          timeline.from(
            shutter,
            {
              rotation: 60,
              transformOrigin: transformOrigins[index],
              ease: 'expo.inOut',
              duration,
            },
            0, // All start at the same time
          );
        });
      });
    },
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10000, overflow: 'hidden', display: 'none' }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1001.5"
        height="996.5"
        viewBox="0 0 1001.5 996.5"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200vmax',
          height: '200vmax',
        }}
      >
        <g ref={shuttersRef}>
          <path
            d="M495.6,509C466.2,673.8,390.8,839,296,1000H707C704,784.9,608.2,584.6,495.6,509Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M296,1000c90.9-137,167-319,203-499C368,593,201.3,655.6,0,707Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M0,707V295c142.6,85.4,302.9,158.8,499,208C363.2,592.2,198.6,661.4,0,707Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M290,4,0,295.8C180.2,401.6,334.3,464.8,498,501,396,354.6,310,60.8,290,4Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M290,4H709C622.7,137.4,560.5,310.4,498,499,400.1,346.2,335.5,170.8,290,4Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M1001.5,292.5,705.8,3.5C619.9,146.2,563.7,301.6,498,500,646.3,398.3,944,312.5,1001.5,292.5Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M999,294.9l.2,422.9C854.5,630.2,691.9,554.9,492.9,504.5,593.7,433,779.3,358.7,999,294.9Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            d="M499,509c169.3,38.9,335.9,109.1,500,209L707,1000c-6-259-117-423-208-491"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
        </g>
      </svg>
    </div>
  );
};

CameraIris.displayName = 'CameraIris';
