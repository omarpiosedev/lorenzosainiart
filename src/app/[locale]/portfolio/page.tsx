import type { Metadata } from 'next';
import pick from 'lodash/pick';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd, PortfolioCollectionJsonLd } from '@/components/seo/JsonLd';
import { getBaseUrl } from '@/utils/AppConfig';
import PortfolioHero from './sections/PortfolioHero';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Portfolio',
    description: 'Explore my creative portfolio featuring photography, video production, and artistic projects.',
    keywords: ['portfolio', 'photography', 'video production', 'creative work', 'visual arts'],
    openGraph: {
      title: 'Portfolio | Lorenzo Saini Art',
      description: 'Explore my creative portfolio featuring photography, video production, and artistic projects.',
      url: `${baseUrl}/${locale}/portfolio`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/portfolio-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'Portfolio showcase',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Portfolio | Lorenzo Saini Art',
      description: 'Explore my creative portfolio featuring photography, video production, and artistic projects.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio`,
      languages: {
        it: `${baseUrl}/it/portfolio`,
        en: `${baseUrl}/en/portfolio`,
      },
    },
  };
}

export default async function PortfolioPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Get messages for PortfolioPage namespace
  const messages = await getMessages();

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Portfolio', url: `${baseUrl}/${locale}/portfolio` },
  ];

  // TODO: When you have actual portfolio items, pass them to PortfolioCollectionJsonLd
  // Example: const portfolioItems = await getPortfolioItems();

  return (
    <NextIntlClientProvider messages={pick(messages, ['PortfolioPage'])}>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PortfolioCollectionJsonLd locale={locale} />
      <PortfolioHero />
    </NextIntlClientProvider>
  );
}
