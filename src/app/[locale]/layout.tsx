import type { Metadata, Viewport } from 'next';
import pick from 'lodash/pick';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { preload } from 'react-dom';
import { PersonJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';
import { HomeLoadingProvider } from '@/contexts/HomeLoadingContext';
import { routing } from '@/lib/i18n/routing';
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
  // Extract locale from params - this is set by the [locale] route segment
  const { locale: paramLocale } = await props.params;

  // CRITICAL: Validate and normalize locale to prevent hydration mismatch
  // Always use 'it' if paramLocale is invalid or missing
  const locale = hasLocale(routing.locales, paramLocale)
    ? paramLocale
    : routing.defaultLocale;

  // Set the locale for this request (required for next-intl)
  setRequestLocale(locale);

  // ✅ BEST PRACTICE: Ottieni tutti i messaggi dal server
  const messages = await getMessages();

  // ✅ React 19: Preload critical resources for optimal performance
  // Fonts - browser will prioritize these for FOUT prevention
  preload('/assets/fonts/LAVENER.ttf', { as: 'font', type: 'font/ttf', crossOrigin: 'anonymous' });
  preload('/assets/fonts/Effloresce It.otf', { as: 'font', type: 'font/opentype', crossOrigin: 'anonymous' });

  // CRITICAL: LoadingScreen images - must load IMMEDIATELY on page load
  // Only preload assets that are actually used in LoadingScreen component
  preload('/assets/images/LogoNero.webp', { as: 'image', fetchPriority: 'high' });

  // NOTE: Page-specific images (image1.webp, image2.webp, image3.webp, background.webp, sposi.webp)
  // are now preloaded in their respective pages to avoid loading 17MB on all routes
  // See: src/app/[locale]/home/page.tsx for home-specific preloads

  const navItems = [
    { label: 'HOME', href: `/${locale}` },
    { label: 'PORTFOLIO', href: `/${locale}/portfolio` },
    { label: 'BLOG', href: `/${locale}/blog` },
    { label: 'ABOUT ME', href: `/${locale}/aboutme` },
    { label: 'CONTACT', href: `/${locale}/contact` },
  ];

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <WebsiteJsonLd locale={locale} />
        <PersonJsonLd locale={locale} />
      </head>
      <body>
        {/* ✅ BEST PRACTICE: Passa solo i messaggi necessari per i componenti del layout
            Questo riduce il bundle JS client e migliora le performance.
            Include 'loading' per LoadingScreen e 'HomePage' per la pagina principale.
            Altre pagine dovrebbero avvolgere il contenuto in NextIntlClientProvider
            con i loro namespace specifici se necessario.
            CRITICAL: Pass locale AND timeZone explicitly to prevent hydration mismatch. */}
        <NextIntlClientProvider
          locale={locale}
          timeZone="Europe/Rome"
          messages={pick(messages, ['loading', 'HomePage', 'Footer'])}
        >
          <HomeLoadingProvider>
            <LayoutClient navItems={navItems}>
              {props.children}
            </LayoutClient>
          </HomeLoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
