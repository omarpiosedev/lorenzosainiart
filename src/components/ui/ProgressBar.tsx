'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type ProgressBarProps = {
  progress: number;
  className?: string;
};

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fillRef.current || !percentageRef.current) {
      return;
    }

    // Animazione fluida della barra di progresso
    gsap.to(fillRef.current, {
      width: `${progress}%`,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Animazione del testo percentuale
    gsap.to(percentageRef.current, {
      innerHTML: Math.round(progress),
      duration: 0.3,
      ease: 'power2.out',
      snap: { innerHTML: 1 },
    });
  }, [progress]);

  return (
    <div className={`w-full max-w-md ${className}`}>
      {/* Barra di progresso */}
      <div
        ref={progressRef}
        className="relative h-1 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm"
      >
        <div
          ref={fillRef}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-black/80 to-black rounded-full transition-all duration-300 ease-out"
          style={{ width: '0%' }}
        />
      </div>

      {/* Percentuale */}
      <div className="flex justify-center mt-4">
        <span
          ref={percentageRef}
          className="text-sm font-lavener text-black/80 tabular-nums"
        >
          0
        </span>
        <span className="text-sm font-lavener text-black/60 ml-1">%</span>
      </div>
    </div>
  );
}
