import type { Metadata } from 'next';
import pick from 'lodash/pick';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/ui';
import { getBaseUrl } from '@/utils/AppConfig';
import ContactClient from './section/ContactClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Contact',
    description: 'Get in touch with Lorenzo Saini for creative collaborations, commissions, or inquiries.',
    keywords: ['contact', 'inquiries', 'commissions', 'collaborations', 'get in touch'],
    openGraph: {
      title: 'Contact | Lorenzo Saini Art',
      description: 'Get in touch with Lorenzo Saini for creative collaborations, commissions, or inquiries.',
      url: `${baseUrl}/${locale}/contact`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/contact-og.webp`,
          width: 1200,
          height: 630,
          alt: 'Contact Lorenzo Saini',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact | Lorenzo Saini Art',
      description: 'Get in touch with Lorenzo Saini for creative collaborations, commissions, or inquiries.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        it: `${baseUrl}/it/contact`,
        en: `${baseUrl}/en/contact`,
      },
    },
  };
}

export default async function ContactPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Get messages for ContactPage namespace
  const messages = await getMessages();

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Contact', url: `${baseUrl}/${locale}/contact` },
  ];

  return (
    <NextIntlClientProvider messages={pick(messages, ['ContactPage'])}>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Header variant="black" />
      <ContactClient />
    </NextIntlClientProvider>
  );
}
