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
    title: 'Blog',
    description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
    keywords: ['blog', 'articles', 'photography tips', 'creative process', 'artistic insights'],
    openGraph: {
      title: 'Blog | Lorenzo Saini Art',
      description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
      url: `${baseUrl}/${locale}/blog`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/blog-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'Lorenzo Saini Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | Lorenzo Saini Art',
      description: 'Read insights, stories, and updates from Lorenzo Saini about creative processes, photography techniques, and artistic inspiration.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        it: `${baseUrl}/it/blog`,
        en: `${baseUrl}/en/blog`,
      },
    },
  };
}

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blog', url: `${baseUrl}/${locale}/blog` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">BLOG</h1>
        </div>
      </div>
    </>
  );
}
