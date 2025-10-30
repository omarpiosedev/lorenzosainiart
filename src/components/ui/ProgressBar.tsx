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
        className="relative h-1.5 bg-black/10 rounded-full overflow-hidden"
      >
        {/* Glow effect sottile */}
        <div
          ref={fillRef}
          className="absolute top-0 left-0 h-full bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]"
          style={{ width: '0%' }}
        />
      </div>

      {/* Percentuale */}
      <div className="flex justify-center mt-3">
        <span
          ref={percentageRef}
          className="text-base font-lavener text-black/70 tabular-nums tracking-wide"
        >
          0
        </span>
        <span className="text-base font-lavener text-black/50 ml-0.5">%</span>
      </div>
    </div>
  );
}
