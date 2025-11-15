import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getBaseUrl } from '@/utils/AppConfig';

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
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="min-h-screen safe-top safe-bottom">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Pagina contact vuota */}
          </div>
        </div>
      </main>
    </>
  );
}
