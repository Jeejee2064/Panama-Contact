import { serviceSlugMap, whyPanamaSlugMap } from '@/data/slugs';

const BASE = 'https://panama-contact.com';
const LOCALES = ['en', 'fr', 'es', 'pt', 'de'];

// locale → URL prefix (en has none due to localePrefix: 'as-needed')
const prefix = (locale) => (locale === 'en' ? '' : `/${locale}`);

// Localized static page paths per locale (must match i18n/routing.js pathnames)
const localizedPaths = {
  home: { en: '', fr: '', es: '', pt: '', de: '' },
  services: {
    en: '/services',
    fr: '/services',
    es: '/servicios',
    pt: '/servicos',
    de: '/dienstleistungen',
  },
  whyPanama: {
    en: '/why-move-to-panama',
    fr: '/pourquoi-s-installer-au-panama',
    es: '/por-que-panama',
    pt: '/por-que-panama',
    de: '/warum-panama',
  },
  contact: {
    en: '/contact',
    fr: '/contact',
    es: '/contacto',
    pt: '/contato',
    de: '/kontakt',
  },
};

// Base path for service/why-panama detail pages per locale
const serviceBase = {
  en: '/services',
  fr: '/services',
  es: '/servicios',
  pt: '/servicos',
  de: '/dienstleistungen',
};

const whyBase = {
  en: '/why-panama',
  fr: '/pourquoi-panama',
  es: '/por-que-panama',
  pt: '/por-que-panama',
  de: '/warum-panama',
};

export default function sitemap() {
  const entries = [];

  // Static pages
  const staticPages = [
    { key: 'home',      priority: 1.0, changeFrequency: 'monthly' },
    { key: 'services',  priority: 0.9, changeFrequency: 'weekly'  },
    { key: 'whyPanama', priority: 0.8, changeFrequency: 'monthly' },
    { key: 'contact',   priority: 0.7, changeFrequency: 'yearly'  },
  ];

  for (const { key, priority, changeFrequency } of staticPages) {
    entries.push({
      url: `${BASE}${localizedPaths[key]['en']}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}${prefix(l)}${localizedPaths[key][l]}`])
        ),
      },
    });
  }

  // Service detail pages
  for (const [, translations] of Object.entries(serviceSlugMap)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${prefix(locale)}${serviceBase[locale]}/${translations[locale]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}${prefix(l)}${serviceBase[l]}/${translations[l]}`])
          ),
        },
      });
    }
  }

  // Why Panama detail pages
  for (const [, translations] of Object.entries(whyPanamaSlugMap)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${prefix(locale)}${whyBase[locale]}/${translations[locale]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}${prefix(l)}${whyBase[l]}/${translations[l]}`])
          ),
        },
      });
    }
  }

  return entries;
}
