import type { Metadata } from 'next';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getBaseUrl } from '@/utils/AppConfig';
import ContactForm from './ContactForm';

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

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Contact', url: `${baseUrl}/${locale}/contact` },
  ];

  return (
    <NextIntlClientProvider>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="min-h-screen safe-top safe-bottom">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <ContactPageContent />
          </div>
        </div>
      </main>
    </NextIntlClientProvider>
  );
}

function ContactPageContent() {
  const t = useTranslations('ContactPage');

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
          <span className="text-sm font-medium uppercase tracking-wider">
            {t('badge')}
          </span>
        </div>

        {/* Page Title - FIX 1: text-wrap-balanced heading-compact + reduce font-size */}
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-wrap-balanced heading-compact">
          {t('heading')}
        </h1>

        {/* Description - FIX 2: text-wrap-pretty line-clamp-3 md:line-clamp-none + reduce font-size */}
        <p className="text-[clamp(1rem,2.5vw,1.125rem)] text-neutral-600 dark:text-neutral-400 text-wrap-pretty line-clamp-3 md:line-clamp-none max-w-2xl mx-auto">
          {t('description')}
        </p>
      </header>

      {/* Contact Form */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 md:p-12">
        <ContactForm />
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-8 pt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('info.title')}</h2>
          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="font-medium whitespace-nowrap">
                {t('info.email')}
                :
              </span>
              <a
                href="mailto:info@lorenzosaini.art"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                info@lorenzosaini.art
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium whitespace-nowrap">
                {t('info.phone')}
                :
              </span>
              <a
                href="tel:+393401234567"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                +39 340 123 4567
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('info.social')}</h2>
          <div className="space-y-3">
            <a
              href="https://instagram.com/lorenzosaini"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <span>Instagram</span>
            </a>
            <a
              href="https://linkedin.com/in/lorenzosaini"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <span>LinkedIn</span>
            </a>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 text-wrap-pretty pt-4">
            {t('info.response')}
          </p>
        </div>
      </div>
    </div>
  );
}
