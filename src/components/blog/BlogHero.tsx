import { useTranslations } from 'next-intl';

export function BlogHero() {
  const t = useTranslations('BlogPage.hero');

  return (
    <section className="relative w-full bg-white pb-[var(--space-16)] pt-[calc(var(--space-20)+8rem)] md:pb-[var(--space-20)] md:pt-[calc(var(--space-24)+5rem)]">
      <div className="container mx-auto max-w-7xl px-[var(--space-4)] md:px-[var(--space-8)]">
        {/* Badge */}
        <div className="mb-[var(--space-4)] flex justify-center">
          <span className="inline-block rounded-full bg-neutral-100 px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-sm)] font-medium tracking-wider text-neutral-800">
            {t('badge')}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-[var(--space-4)] text-center font-lavener text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-neutral-900">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[var(--text-lg)] leading-relaxed text-neutral-600">
            {t('subtitle1')}
          </p>
          <p className="mt-[var(--space-2)] text-[var(--text-lg)] leading-relaxed text-neutral-600">
            {t('subtitle2')}
          </p>
        </div>
      </div>
    </section>
  );
}
