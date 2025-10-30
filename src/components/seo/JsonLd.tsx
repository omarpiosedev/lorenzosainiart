/**
 * JSON-LD Structured Data Component
 * Provides rich snippets for search engines following Next.js 16 best practices
 */

import { getBaseUrl } from '@/utils/AppConfig';

type JsonLdProps = {
  locale: string;
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
    'sameAs': [
      // Add social media profiles here when available
      // 'https://instagram.com/lorenzosaini',
      // 'https://twitter.com/lorenzosaini',
    ],
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
