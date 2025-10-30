'use client';

import { gsap } from 'gsap';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

type CameraIrisProps = {
  color?: string;
  duration?: number;
  blades?: number; // Numero di lame del diaframma
};

export type CameraIrisHandle = {
  open: () => Promise<void>;
  close: () => Promise<void>;
};

export const CameraIris = ({ ref, color = '#000000', duration = 1.2, blades: _blades = 8 }: CameraIrisProps & { ref?: React.RefObject<CameraIrisHandle | null> }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const irisRef = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      return new Promise((resolve) => {
        if (!irisRef.current) {
          resolve();
          return;
        }

        // Animazione di apertura: cerchio si espande fino a coprire tutto
        gsap.to(irisRef.current, {
          attr: { r: '150%' },
          duration,
          ease: 'power2.inOut',
          onComplete: () => resolve(),
        });
      });
    },
    close: () => {
      return new Promise((resolve) => {
        if (!irisRef.current) {
          resolve();
          return;
        }

        // Animazione di chiusura: cerchio si restringe al centro
        gsap.to(irisRef.current, {
          attr: { r: '0%' },
          duration,
          ease: 'power2.inOut',
          onComplete: () => resolve(),
        });
      });
    },
  }));

  // Stato iniziale: completamente chiuso (cerchio grande che copre tutto)
  useEffect(() => {
    if (irisRef.current) {
      gsap.set(irisRef.current, {
        attr: { r: '0%' },
      });
    }
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10000 }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Maschera per l'effetto iris */}
          <mask id="iris-mask">
            {/* Rettangolo bianco = visibile */}
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {/* Cerchio nero = nascosto */}
            <circle
              ref={irisRef}
              cx="50"
              cy="50"
              r="0"
              fill="black"
            />
          </mask>
        </defs>

        {/* Overlay colorato con la maschera iris applicata */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill={color}
          mask="url(#iris-mask)"
        />
      </svg>
    </div>
  );
};

CameraIris.displayName = 'CameraIris';
