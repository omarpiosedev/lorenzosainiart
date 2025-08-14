import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/AppConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/monitoring', '/api/'],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
