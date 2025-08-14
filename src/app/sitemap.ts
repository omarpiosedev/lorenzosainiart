import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

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

    // Add about page for each locale
    urls.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/about`]),
        ),
      },
    });

    // Add portfolio page for each locale
    urls.push({
      url: `${baseUrl}/${locale}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/portfolio`]),
        ),
      },
    });

    // Add counter demo page for each locale
    urls.push({
      url: `${baseUrl}/${locale}/counter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/counter`]),
        ),
      },
    });
  });

  return urls;
}
