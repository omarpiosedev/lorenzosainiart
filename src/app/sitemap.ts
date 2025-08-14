import type { MetadataRoute } from 'next';
import { AppConfig, getBaseUrl } from '@/utils/AppConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const locales = AppConfig.locales;

  // Generate sitemap entries for all locales
  const urls: MetadataRoute.Sitemap = [];

  // Add homepage for each locale
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}`]),
        ),
      },
    });
  });

  return urls;
}
