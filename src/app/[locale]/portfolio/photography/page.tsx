import type { Metadata } from 'next';
import pick from 'lodash/pick';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
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
          url: `${baseUrl}/assets/images/portfolio-photography-og.jpg`,
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
      <main className="min-h-screen bg-white">
        {/* Photography Portfolio Content */}
        <section className="relative w-full min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-24 lg:py-32">
            <h1
              className="text-center text-black"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 300,
                letterSpacing: '0.02em',
              }}
            >
              Photography Portfolio
            </h1>
            <p
              className="text-center text-black/70 mt-6 max-w-2xl mx-auto"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Content coming soon
            </p>
          </div>
        </section>
      </main>
    </NextIntlClientProvider>
  );
}
