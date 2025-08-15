import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NavBar from '@/components/ui/NavBar';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/AppConfig';
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
      <body>
        <NextIntlClientProvider>
          {props.children}
          <NavBar
            logo="/logo.svg"
            logoAlt="Lorenzo Saini Art"
            items={navItems}
            baseColor="#060010"
            pillColor="#fff"
            hoveredPillTextColor="#fff"
            pillTextColor="#060010"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
