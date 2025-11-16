import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { BlogFeedContainer } from '@/components/blog/BlogFeedContainer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/ui';
import { getBaseUrl } from '@/utils/AppConfig';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Blog',
    description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
    keywords: ['blog', 'articles', 'photography tips', 'creative process', 'artistic insights'],
    openGraph: {
      title: 'Blog | Lorenzo Saini Art',
      description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
      url: `${baseUrl}/${locale}/blog`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/blog-og.webp`,
          width: 1200,
          height: 630,
          alt: 'Lorenzo Saini Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | Lorenzo Saini Art',
      description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        it: `${baseUrl}/it/blog`,
        en: `${baseUrl}/en/blog`,
      },
    },
  };
}

// In Cache Components mode (Next.js 16+), routes are dynamic by default
// Data fetching is not cached unless explicitly marked with 'use cache'
// This ensures fresh data on every navigation without needing dynamic = 'force-dynamic'

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage.hero');

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blog', url: `${baseUrl}/${locale}/blog` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Header variant="black" />
      <div className="min-h-screen">
        <BlogHero
          badge={t('badge')}
          title={t('title')}
          subtitle1={t('subtitle1')}
          subtitle2={t('subtitle2')}
        />
        {/* Wrap data fetching in Suspense for Cache Components compatibility */}
        {/* Empty fallback: shows empty feed instead of skeleton during first load */}
        <Suspense fallback={<div className="w-full bg-white py-[var(--space-12)] md:py-[var(--space-16)]" />}>
          <BlogFeedContainer locale={locale} />
        </Suspense>
      </div>
    </>
  );
}
