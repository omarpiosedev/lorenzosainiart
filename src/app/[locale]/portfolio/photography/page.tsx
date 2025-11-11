import type { Metadata } from 'next';
import pick from 'lodash/pick';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Photography2DCarousel from '@/components/portfolio/Photography2DCarousel';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { photographyProjects } from '@/data/photographyProjects';
import { getBaseUrl } from '@/utils/AppConfig';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Photography Portfolio',
    description: 'Explore my photography portfolio featuring fashion, editorial, brand, and portrait work.',
    keywords: ['photography', 'fashion photography', 'portrait', 'editorial', 'commercial photography'],
    openGraph: {
      title: 'Photography Portfolio | Lorenzo Saini Art',
      description: 'Explore my photography portfolio featuring fashion, editorial, brand, and portrait work.',
      url: `${baseUrl}/${locale}/portfolio/photography`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/portfolio-photography-og.webp`,
          width: 1200,
          height: 630,
          alt: 'Photography portfolio showcase',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Photography Portfolio | Lorenzo Saini Art',
      description: 'Explore my photography portfolio featuring fashion, editorial, brand, and portrait work.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/photography`,
      languages: {
        it: `${baseUrl}/it/portfolio/photography`,
        en: `${baseUrl}/en/portfolio/photography`,
      },
    },
  };
}

function PhotographyHeader({ locale }: { locale: string }) {
  const t = useTranslations('PortfolioPage.photography');
  const tNav = useTranslations('PortfolioPage.hero.navigation');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-8 md:py-8">
      <div className="flex items-start justify-between">
        {/* Left: Signature */}
        <div>
          <h1
            className="text-white leading-tight"
            style={{
              fontFamily: 'var(--font-lavener)',
              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            {t('header.name')}
          </h1>
          <p
            className="text-white/80 mt-1"
            style={{
              fontFamily: 'var(--font-lavener)',
              fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            {t('header.role')}
          </p>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}/portfolio`}
            className="text-white hover:text-white/70 transition-colors"
            style={{
              fontFamily: 'var(--font-lavener)',
              fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              fontWeight: 400,
            }}
          >
            {tNav('index')}
          </Link>
          <Link
            href={`/${locale}/aboutme`}
            className="text-white hover:text-white/70 transition-colors"
            style={{
              fontFamily: 'var(--font-lavener)',
              fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              fontWeight: 400,
            }}
          >
            {tNav('about')}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default async function PhotographyPortfolioPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const messages = await getMessages();

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Portfolio', url: `${baseUrl}/${locale}/portfolio` },
    { name: 'Photography', url: `${baseUrl}/${locale}/portfolio/photography` },
  ];

  return (
    <NextIntlClientProvider messages={pick(messages, ['PortfolioPage'])}>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="relative min-h-screen bg-white overflow-hidden">
        <PhotographyHeader locale={locale} />
        <Photography2DCarousel projects={photographyProjects} />
      </div>
    </NextIntlClientProvider>
  );
}
