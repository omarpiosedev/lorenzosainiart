import type { Metadata, Viewport } from 'next';
import pick from 'lodash/pick';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PersonJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';
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

  // ✅ BEST PRACTICE: Ottieni tutti i messaggi dal server
  const messages = await getMessages();

  const navItems = [
    { label: 'HOME', href: `/${locale}` },
    { label: 'PORTFOLIO', href: `/${locale}/portfolio` },
    { label: 'BLOG', href: `/${locale}/blog` },
    { label: 'ABOUT ME', href: `/${locale}/aboutme` },
    { label: 'CONTACT', href: `/${locale}/contact` },
  ];

  return (
    <html lang={locale}>
      <head>
        {/* Critical images preload - LCP first */}
        <link rel="preload" as="image" href="/assets/images/backgropund.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/images/sposi.webp" fetchPriority="high" />
        {/* Loading video preload - critical for loading screen */}
        <link rel="preload" as="video" href="/videos/Logoanimated.mp4" type="video/mp4" />
        {/* Font preload for performance */}
        <link rel="preload" as="font" href="/assets/fonts/LAVENER.ttf" type="font/ttf" crossOrigin="anonymous" />
        {/* JSON-LD Structured Data for SEO */}
        <WebsiteJsonLd locale={locale} />
        <PersonJsonLd locale={locale} />
      </head>
      <body style={{ margin: '0px', padding: '0px', left: '0px', right: '0px', position: 'relative' }}>
        {/* ✅ BEST PRACTICE: Passa solo i messaggi necessari per i componenti del layout
            Questo riduce il bundle JS client e migliora le performance.
            Include 'loading' per LoadingScreen e 'HomePage' per la pagina principale.
            Altre pagine dovrebbero avvolgere il contenuto in NextIntlClientProvider
            con i loro namespace specifici se necessario. */}
        <NextIntlClientProvider messages={pick(messages, ['loading', 'HomePage'])}>
          <LayoutClient navItems={navItems}>
            {props.children}
          </LayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
