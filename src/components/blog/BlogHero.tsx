'use client';

import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

type BlogHeroProps = {
  badge: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
};

export function BlogHero({ badge, title, subtitle1, subtitle2 }: BlogHeroProps) {
  return (
    <section className="relative w-full bg-white pb-[var(--space-16)] pt-[calc(var(--space-20)+8rem)] md:pb-[var(--space-20)] md:pt-[calc(var(--space-24)+5rem)]">
      <div className="container mx-auto max-w-7xl px-[var(--space-4)] md:px-[var(--space-8)]">
        {/* Badge */}
        <div className="mb-[var(--space-4)] flex justify-center">
          <span className="inline-block rounded-full bg-neutral-100 px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-sm)] font-medium tracking-wider text-neutral-800">
            {badge}
          </span>
        </div>

        {/* Title with letter-by-letter animation - slower */}
        <h1 className="heading-compact mb-[var(--space-4)] flex justify-center">
          <TextGenerateEffect
            words={title}
            className="text-balance text-center font-lavener text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-neutral-900"
            animateBy="letter"
            duration={0.5}
            staggerDelay={0.08}
            initialDelay={0.3}
            filter={true}
          />
        </h1>

        {/* Subtitle */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-pretty text-[var(--text-base)] leading-relaxed text-neutral-600">
            {subtitle1}
          </p>
          <p className="text-pretty mt-[var(--space-2)] text-[var(--text-base)] leading-relaxed text-neutral-600">
            {subtitle2}
          </p>
        </div>
      </div>
    </section>
  );
}
