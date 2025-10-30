'use client';

import { gsap } from 'gsap';
import { useImperativeHandle, useRef } from 'react';

type CameraIrisProps = {
  color?: string;
  duration?: number;
  onHalfway?: () => void;
};

export type CameraIrisHandle = {
  open: () => Promise<void>;
};

export const CameraIris = ({ ref, color = '#060010', duration = 0.35, onHalfway }: CameraIrisProps & { ref?: React.RefObject<CameraIrisHandle | null> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shuttersRef = useRef<SVGGElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      return new Promise((resolve) => {
        if (!shuttersRef.current || !containerRef.current) {
          resolve();
          return;
        }

        const shutters = shuttersRef.current.querySelectorAll('path');

        // Transform origins per ogni lama (identici all'esempio)
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

        // Mostra il container all'inizio dell'animazione
        gsap.set(containerRef.current, { display: 'block' });

        // Crea timeline con yoyo (chiudi e riapri) come nell'esempio originale
        const timeline = gsap.timeline({
          yoyo: true,
          repeat: 1,
          onRepeat: () => {
            // Chiamato quando l'iris è completamente chiuso e sta per riaprirsi
            if (onHalfway) {
              onHalfway();
            }
          },
          onComplete: () => {
            // Nascondi il container alla fine dell'animazione
            if (containerRef.current) {
              gsap.set(containerRef.current, { display: 'none' });
            }
            // Risolvi la promise alla fine completa dell'animazione
            resolve();
          },
        });

        // Parte da aperto (rotation 60) e va a chiuso (rotation 0)
        // Poi con yoyo torna automaticamente ad aperto
        shutters.forEach((shutter, index) => {
          timeline.from(
            shutter,
            {
              rotation: 60,
              transformOrigin: transformOrigins[index],
              ease: 'expo.inOut',
              duration,
            },
            0,
          ); // tutti partono allo stesso tempo (position 0)
        });
      });
    },
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10000, overflow: 'hidden', display: 'none' }}
    >
      <svg
        id="shutters_svg"
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
        <g id="shutters" ref={shuttersRef}>
          <path
            id="shutter1"
            d="M495.6,509C466.2,673.8,390.8,839,296,1000H707C704,784.9,608.2,584.6,495.6,509Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter2"
            d="M296,1000c90.9-137,167-319,203-499C368,593,201.3,655.6,0,707Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter3"
            d="M0,707V295c142.6,85.4,302.9,158.8,499,208C363.2,592.2,198.6,661.4,0,707Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter4"
            d="M290,4,0,295.8C180.2,401.6,334.3,464.8,498,501,396,354.6,310,60.8,290,4Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter5"
            d="M290,4H709C622.7,137.4,560.5,310.4,498,499,400.1,346.2,335.5,170.8,290,4Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter6"
            d="M1001.5,292.5,705.8,3.5C619.9,146.2,563.7,301.6,498,500,646.3,398.3,944,312.5,1001.5,292.5Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter7"
            d="M999,294.9l.2,422.9C854.5,630.2,691.9,554.9,492.9,504.5,593.7,433,779.3,358.7,999,294.9Z"
            transform="translate(0 -3.5)"
            fill={color}
            strokeWidth="1"
            stroke="#000"
          />
          <path
            id="shutter8"
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
