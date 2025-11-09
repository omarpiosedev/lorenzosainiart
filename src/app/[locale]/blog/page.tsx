import type { Metadata } from 'next';
import type { BlogPost } from '@/sanity/types';
import { setRequestLocale } from 'next-intl/server';
import { BlogFeed } from '@/components/blog/BlogFeed';
import { BlogHero } from '@/components/blog/BlogHero';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { client } from '@/sanity/client';
import { getBaseUrl } from '@/utils/AppConfig';

type Props = {
  params: Promise<{ locale: string }>;
};

const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  _type,
  _createdAt,
  title,
  subtitle,
  slug,
  "author": author->{
    _id,
    _type,
    name,
    slug,
    image,
    bio,
    role
  },
  featured,
  category,
  images,
  content,
  tags,
  publishedAt
}`;

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

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blog', url: `${baseUrl}/${locale}/blog` },
  ];

  // Fetch posts from Sanity
  const posts = await client.fetch<BlogPost[]>(POSTS_QUERY);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen">
        <BlogHero />
        <BlogFeed posts={posts} locale={locale} />
      </div>
    </>
  );
}
