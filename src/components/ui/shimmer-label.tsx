import type { CSSProperties } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

export type ShimmerLabelProps = {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * ShimmerLabel - Non-interactive shimmer badge for section labels
 *
 * A decorative component with shimmer animation, used for section headers.
 * Unlike ShimmerButton, this is a non-interactive div without hover states.
 */
export const ShimmerLabel = (
  { ref, shimmerColor = '#ffffff', shimmerSize = '0.05em', shimmerDuration = '3s', borderRadius = '100px', background = 'rgba(0, 0, 0, 1)', className, children }: ShimmerLabelProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  return (
    <div
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as CSSProperties
      }
      className={cn(
        'relative z-0 inline-flex items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-3 py-1.5 whitespace-nowrap text-white [background:var(--bg)]',
        className,
      )}
      ref={ref}
    >
      {/* spark container */}
      <div className={cn('-z-30 blur-[2px]', '[container-type:size] absolute inset-0 overflow-visible')}>
        {/* spark */}
        <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
          {/* spark before */}
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {children}

      {/* Highlight - no hover/active states for non-interactive element */}
      <div
        className={cn(
          'absolute inset-0 size-full',
          'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
        )}
      />

      {/* backdrop */}
      <div className={cn('absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]')} />
    </div>
  );
};

ShimmerLabel.displayName = 'ShimmerLabel';
