import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { notFound } from 'next/navigation';
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
  const title = 'Lorenzo Saini - Photography & Visual Art';
  const description = locale === 'it'
    ? 'Portfolio di Lorenzo Saini - Fotografo professionista specializzato in fashion, ritratti e fotografia commerciale. Creatività, passione e qualità professionale.'
    : 'Lorenzo Saini Portfolio - Professional photographer specializing in fashion, portraits and commercial photography. Creativity, passion and professional quality.';

  const ogLocale = locale === 'it' ? 'it_IT' : 'en_US';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords: locale === 'it'
      ? ['lorenzo saini', 'fotografo', 'fotografia', 'fashion', 'ritratti', 'commerciale', 'portfolio', 'italia']
      : ['lorenzo saini', 'photographer', 'photography', 'fashion', 'portraits', 'commercial', 'portfolio', 'italy'],
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

export default async function RootLayout(props: LayoutProps) {
  const { locale } = await props.params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Get translations for navigation
  const t = await getTranslations({ locale, namespace: 'Navigation' });

  // Generate navigation items with translations and accessibility
  const navItems: NavItem[] = [
    {
      label: t('home'),
      href: `/${locale}`,
      ariaLabel: locale === 'it' ? 'Vai alla homepage' : 'Go to homepage',
    },
    {
      label: t('portfolio'),
      href: `/${locale}/portfolio`,
      ariaLabel: locale === 'it' ? 'Visualizza il portfolio' : 'View portfolio',
    },
    {
      label: t('blog'),
      href: `/${locale}/blog`,
      ariaLabel: locale === 'it' ? 'Leggi il blog' : 'Read blog',
    },
    {
      label: t('aboutMe'),
      href: `/${locale}/aboutme`,
      ariaLabel: locale === 'it' ? 'Scopri di più su Lorenzo' : 'Learn more about Lorenzo',
    },
    {
      label: t('contact'),
      href: `/${locale}/contact`,
      ariaLabel: locale === 'it' ? 'Contatta Lorenzo' : 'Contact Lorenzo',
    },
  ];

  return (
    <html lang={locale}>
      <head>
        {/* Critical resources preload for performance */}
        <link
          rel="preload"
          as="image"
          href="/assets/images/backgropund.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="font"
          href="/assets/fonts/LAVENER.ttf"
          type="font/truetype"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <link rel="preload" as="image" href="/assets/images/LogoBianco.webp" />

        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* SEO and performance meta tags */}
        <meta name="author" content="Lorenzo Saini" />
        <meta name="copyright" content="© 2024 Lorenzo Saini. All rights reserved." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#060010" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Progressive Web App meta tags */}
        <meta name="application-name" content="Lorenzo Saini Portfolio" />
        <meta name="apple-mobile-web-app-title" content="Lorenzo Saini" />

        {/* Social media optimization */}
        <meta property="og:site_name" content="Lorenzo Saini - Photography & Visual Art" />
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content="Lorenzo" />
        <meta property="profile:last_name" content="Saini" />
        <meta property="profile:gender" content="male" />

        {/* Additional Twitter Card optimization */}
        <meta name="twitter:site" content="@lorenzosaini" />
        <meta name="twitter:domain" content={getBaseUrl().replace('https://', '').replace('http://', '')} />

        {/* Structured Data for Artist */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${getBaseUrl()}/#person`,
              'name': 'Lorenzo Saini',
              'jobTitle': locale === 'it' ? 'Fotografo Professionista' : 'Professional Photographer',
              'description': locale === 'it'
                ? 'Fotografo professionista specializzato in fashion, ritratti e fotografia commerciale'
                : 'Professional photographer specializing in fashion, portraits and commercial photography',
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
      <body className="m-0 p-0 relative" style={{ fontFamily: 'LAVENER, sans-serif' }}>
        <NextIntlClientProvider>
          <LayoutClient navItems={navItems}>
            {props.children}
          </LayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
