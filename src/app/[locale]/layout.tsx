import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/AppConfig';
import LayoutClient from './LayoutClient';
import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: '%s | Portfolio',
    default: 'Portfolio',
  },
  description:
    'A modern portfolio website showcasing creative work and projects',
  keywords: ['portfolio', 'photography', 'video', 'creative', 'showcase'],
  authors: [{ name: 'Portfolio Owner' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: getBaseUrl(),
    siteName: 'Portfolio',
    title: 'Portfolio',
    description:
      'A modern portfolio website showcasing creative work and projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description:
      'A modern portfolio website showcasing creative work and projects',
  },
  alternates: {
    canonical: getBaseUrl(),
    languages: {
      it: `${getBaseUrl()}/it`,
      en: `${getBaseUrl()}/en`,
    },
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Per iPhone con notch
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const navItems = [
    { label: 'HOME', href: `/${locale}` },
    { label: 'PORTFOLIO', href: `/${locale}/portfolio` },
    { label: 'BLOG', href: `/${locale}/blog` },
    { label: 'ABOUT ME', href: `/${locale}/about` },
    { label: 'CONTACT', href: `/${locale}/contact` },
  ];

  return (
    <html lang={locale}>
      <head>
        {/* Critical images preload - LCP first */}
        <link rel="preload" as="image" href="/assets/images/backgropund.webp" />
        <link rel="preload" as="image" href="/assets/images/cloud.webp" />
        <link rel="preload" as="image" href="/assets/images/sposi.webp" />
        {/* Font preload for performance */}
        <link rel="preload" as="font" href="/assets/fonts/LAVENER.ttf" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, left: 0, right: 0, position: 'relative' }}>
        <NextIntlClientProvider>
          <LayoutClient navItems={navItems}>
            {props.children}
          </LayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
