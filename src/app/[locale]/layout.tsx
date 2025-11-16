import type { Metadata, Viewport } from 'next';
import pick from 'lodash/pick';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PersonJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';
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

  // CRITICAL: Validate locale and return 404 for unsupported locales
  // Context7 next-intl Best Practice: Use hasLocale + notFound for validation
  if (!hasLocale(routing.locales, paramLocale)) {
    notFound();
  }

  // Context7 next-intl Best Practice: Enable static rendering with setRequestLocale
  // This allows Next.js to statically generate pages for each locale
  setRequestLocale(paramLocale);

  // ✅ BEST PRACTICE: Get all messages from server
  const messages = await getMessages();

  // ✅ React 19: Preload critical resources for optimal performance
  // Google Fonts (Bacasime Antique and Lora) are already preloaded via @import in global.css

  const navItems = [
    { label: 'HOME', href: `/${paramLocale}` },
    { label: 'PORTFOLIO', href: `/${paramLocale}/portfolio` },
    { label: 'BLOG', href: `/${paramLocale}/blog` },
    { label: 'ABOUT ME', href: `/${paramLocale}/aboutme` },
    { label: 'CONTACT', href: `/${paramLocale}/contact` },
  ];

  return (
    <html lang={paramLocale} suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <WebsiteJsonLd locale={paramLocale} />
        <PersonJsonLd locale={paramLocale} />
      </head>
      <body>
        {/* ✅ BEST PRACTICE: Pass only necessary messages to client components
            This reduces client JS bundle and improves performance.
            Other pages should wrap content in NextIntlClientProvider
            with their specific namespaces if needed.
            CRITICAL: Pass locale AND timeZone explicitly to prevent hydration mismatch. */}
        <NextIntlClientProvider
          locale={paramLocale}
          timeZone="Europe/Rome"
          messages={pick(messages, ['HomePage', 'Footer', 'BackgroundMusic', 'LoadingScreen'])}
        >
          <LayoutClient navItems={navItems}>
            {props.children}
          </LayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
