import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { notFound } from 'next/navigation';
import { lavener } from '@/libs/fonts';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/AppConfig';
import LayoutClient from './LayoutClient';
import '@/styles/global.css';

// Types
type NavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = getBaseUrl();

  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const title = tMeta('title');
  const description = tMeta('description');
  const keywords = tMeta.raw('keywords') as string[];
  const ogLocale = tMeta('ogLocale');

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords,
    authors: [{ name: 'Lorenzo Saini', url: baseUrl }],
    creator: 'Lorenzo Saini',
    publisher: 'Lorenzo Saini',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'profile',
      locale: ogLocale,
      url: `${baseUrl}/${locale}`,
      siteName: title,
      title,
      description,
      images: [
        {
          url: '/assets/images/LogoBianco.webp',
          width: 1200,
          height: 630,
          alt: 'Lorenzo Saini - Photography & Visual Art',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/images/LogoBianco.webp'],
      creator: '@lorenzosaini', // Add actual Twitter handle if available
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'it': `${baseUrl}/it`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/it`,
      },
    },
    icons: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
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
    other: {
      'theme-color': '#060010',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#060010' },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// Force static rendering for better performance
export const dynamic = 'force-static';

export default async function RootLayout(props: LayoutProps) {
  const { locale } = await props.params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Get translations for navigation
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  // Get translations for structured data (JSON-LD)
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });

  // Get messages for NextIntlClientProvider
  const messages = await getMessages({ locale });

  // Generate navigation items with translations and accessibility
  const navItems: NavItem[] = [
    {
      label: tNav('home'),
      href: `/${locale}`,
      ariaLabel: tNav('aria.home'),
    },
    {
      label: tNav('portfolio'),
      href: `/${locale}/portfolio`,
      ariaLabel: tNav('aria.portfolio'),
    },
    {
      label: tNav('blog'),
      href: `/${locale}/blog`,
      ariaLabel: tNav('aria.blog'),
    },
    {
      label: tNav('aboutMe'),
      href: `/${locale}/aboutme`,
      ariaLabel: tNav('aria.aboutMe'),
    },
    {
      label: tNav('contact'),
      href: `/${locale}/contact`,
      ariaLabel: tNav('aria.contact'),
    },
  ];

  return (
    <html lang={locale} className={lavener.variable}>
      <head>
        {/* Structured Data for Artist */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${getBaseUrl()}/#person`,
              'name': 'Lorenzo Saini',
              'jobTitle': tMeta('jobTitle'),
              'description': tMeta('description'),
              'url': getBaseUrl(),
              'sameAs': [
                // Add actual social media URLs when available
                // 'https://instagram.com/lorenzosaini',
                // 'https://twitter.com/lorenzosaini',
              ],
              'knowsAbout': [
                'Photography',
                'Fashion Photography',
                'Portrait Photography',
                'Commercial Photography',
                'Visual Arts',
              ],
              'workLocation': {
                '@type': 'Place',
                'name': 'Italy',
              },
            }),
          }}
        />
      </head>
      <body className={`m-0 p-0 relative ${lavener.className}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LayoutClient navItems={navItems}>
            {props.children}
          </LayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
