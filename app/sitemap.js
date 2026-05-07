import { serviceSlugMap, whyPanamaSlugMap } from '@/data/slugs';

const BASE = 'https://panama-contact.com';
const LOCALES = ['en', 'fr', 'es', 'pt'];

// locale → path prefix (en has none due to localePrefix: 'as-needed')
const prefix = (locale) => (locale === 'en' ? '' : `/${locale}`);

export default function sitemap() {
  const entries = [];

  // Static pages
  const staticPages = [
    { path: '',          priority: 1.0, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/why-panama', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact',  priority: 0.7, changeFrequency: 'yearly'  },
  ];

  for (const { path, priority, changeFrequency } of staticPages) {
    entries.push({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}${prefix(l)}${path}`])
        ),
      },
    });
  }

  // Service pages
  for (const [canonical, translations] of Object.entries(serviceSlugMap)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${prefix(locale)}/services/${translations[locale]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}${prefix(l)}/services/${translations[l]}`])
          ),
        },
      });
    }
  }

  // Why Panama pages
  for (const [canonical, translations] of Object.entries(whyPanamaSlugMap)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${prefix(locale)}/why-panama/${translations[locale]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}${prefix(l)}/why-panama/${translations[l]}`])
          ),
        },
      });
    }
  }

  return entries;
}
