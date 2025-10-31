/**
 * JSON-LD Structured Data Components
 * Provides rich snippets for search engines following Next.js 16 + React 19 best practices
 * Implements Schema.org vocabulary for enhanced SEO
 */

import { getBaseUrl } from '@/utils/AppConfig';

type JsonLdProps = {
  locale: string;
};

type PortfolioItem = {
  name: string;
  description: string;
  image: string;
  dateCreated?: string;
  creator?: string;
};

type BlogArticle = {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
};

export function WebsiteJsonLd({ locale }: JsonLdProps) {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Lorenzo Saini Art Portfolio',
    'description': 'A modern portfolio showcasing creative work in photography, video, and art',
    'url': `${baseUrl}/${locale}`,
    'inLanguage': locale,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${baseUrl}/${locale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PersonJsonLd({ locale }: JsonLdProps) {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Lorenzo Saini',
    'url': `${baseUrl}/${locale}`,
    'jobTitle': 'Creative Artist & Photographer',
    'description': 'Creative artist specializing in photography, video production, and visual arts',
    'knowsAbout': ['Photography', 'Video Production', 'Visual Arts', 'Creative Direction'],
    'hasOccupation': {
      '@type': 'Occupation',
      'name': 'Photographer and Visual Artist',
      'occupationLocation': {
        '@type': 'Country',
        'name': locale === 'it' ? 'Italia' : 'Italy',
      },
    },
    'sameAs': [
      // Add social media profiles here when available
      // 'https://instagram.com/lorenzosaini',
      // 'https://twitter.com/lorenzosaini',
      // 'https://linkedin.com/in/lorenzosaini',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Portfolio Collection Schema
 * Use this for the portfolio page to describe the collection of works
 */
export function PortfolioCollectionJsonLd({ locale, items }: JsonLdProps & { items?: PortfolioItem[] }) {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': locale === 'it' ? 'Portfolio di Lorenzo Saini' : 'Lorenzo Saini Portfolio',
    'description': locale === 'it'
      ? 'Collezione di opere creative: fotografia, video e arte visiva'
      : 'Collection of creative works: photography, video, and visual arts',
    'url': `${baseUrl}/${locale}/portfolio`,
    'creator': {
      '@type': 'Person',
      'name': 'Lorenzo Saini',
    },
    ...(items && items.length > 0 && {
      hasPart: items.map(item => ({
        '@type': 'CreativeWork',
        'name': item.name,
        'description': item.description,
        'image': item.image,
        'creator': {
          '@type': 'Person',
          'name': item.creator || 'Lorenzo Saini',
        },
        ...(item.dateCreated && { dateCreated: item.dateCreated }),
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Blog Article Schema
 * Use this for individual blog posts
 */
export function ArticleJsonLd({ article }: { article: BlogArticle }) {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'image': article.image,
    'datePublished': article.datePublished,
    'dateModified': article.dateModified || article.datePublished,
    'author': {
      '@type': 'Person',
      'name': article.author,
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Lorenzo Saini',
      'url': baseUrl,
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * ImageObject Schema
 * Use this for portfolio images or photography work
 */
export function ImageObjectJsonLd({
  name,
  description,
  url,
  contentUrl,
  creator = 'Lorenzo Saini',
  datePublished,
}: {
  name: string;
  description: string;
  url: string;
  contentUrl: string;
  creator?: string;
  datePublished?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    'name': name,
    'description': description,
    'url': url,
    'contentUrl': contentUrl,
    'creator': {
      '@type': 'Person',
      'name': creator,
    },
    ...(datePublished && { datePublished }),
    'license': 'https://creativecommons.org/licenses/by-nc-nd/4.0/', // Adjust as needed
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
