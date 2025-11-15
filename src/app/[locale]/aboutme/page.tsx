import type { Metadata } from 'next';
import pick from 'lodash/pick';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getBaseUrl } from '@/utils/AppConfig';
import AboutContent from './section/AboutContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'About Me',
    description:
      'Learn about Lorenzo Saini, a creative artist specializing in photography, video production, and visual arts.',
    keywords: [
      'about',
      'artist',
      'photographer',
      'creative professional',
      'biography',
    ],
    openGraph: {
      title: 'About Me | Lorenzo Saini Art',
      description:
        'Learn about Lorenzo Saini, a creative artist specializing in photography, video production, and visual arts.',
      url: `${baseUrl}/${locale}/aboutme`,
      type: 'profile',
      images: [
        {
          url: `${baseUrl}/assets/images/about-og.webp`,
          width: 1200,
          height: 630,
          alt: 'About Lorenzo Saini',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Me | Lorenzo Saini Art',
      description:
        'Learn about Lorenzo Saini, a creative artist specializing in photography, video production, and visual arts.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/aboutme`,
      languages: {
        it: `${baseUrl}/it/aboutme`,
        en: `${baseUrl}/en/aboutme`,
      },
    },
  };
}

export default async function AboutMePage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Get messages for AboutPage namespace
  const messages = await getMessages();

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'About Me', url: `${baseUrl}/${locale}/aboutme` },
  ];

  return (
    <NextIntlClientProvider messages={pick(messages, ['AboutPage'])}>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <AboutContent />
    </NextIntlClientProvider>
  );
}
