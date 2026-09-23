import { serviceSlugMap, whyPanamaSlugMap } from '@/data/slugs';
import { routing } from '@/i18n/routing';
import { SITE_URL as BASE } from '@/i18n/urls';
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
  panamaTaxCalculator: routing.pathnames['/panama-tax-calculator'],
  panamaIncomeTaxCalculator: routing.pathnames['/panama-income-tax-calculator'],
  privacyPolicy: routing.pathnames['/privacy-policy'],
  legalTerms: routing.pathnames['/legal-terms'],
  partners: routing.pathnames['/partners'],
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
    { key: 'panamaTaxCalculator',       priority: 0.9, changeFrequency: 'monthly' },
    { key: 'panamaIncomeTaxCalculator', priority: 0.9, changeFrequency: 'monthly' },
    { key: 'privacyPolicy',             priority: 0.3, changeFrequency: 'yearly'  },
    { key: 'legalTerms',                priority: 0.3, changeFrequency: 'yearly'  },
    { key: 'partners',                  priority: 0.5, changeFrequency: 'monthly' },
  ];

  for (const { key, priority, changeFrequency } of staticPages) {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, `${BASE}${prefix(l)}${localizedPaths[key][l]}`])
    );
    for (const locale of LOCALES) {
      entries.push({
        url: languages[locale],
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
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

  // Casco Notary Services — standalone mini-site, EN + ES only
  const cascoNotaryPages = [
    { key: '/casco-notary-services', priority: 0.7 },
    { key: '/casco-notary-services/services', priority: 0.6 },
    { key: '/casco-notary-services/pricing', priority: 0.6 },
    { key: '/casco-notary-services/delivery', priority: 0.6 },
    { key: '/casco-notary-services/faq', priority: 0.6 },
  ];
  for (const { key, priority } of cascoNotaryPages) {
    const paths = routing.pathnames[key];
    const languages = {
      en: `${BASE}${paths.en}`,
      es: `${BASE}/es${paths.es}`,
      'x-default': `${BASE}${paths.en}`,
    };
    for (const url of [languages.en, languages.es]) {
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
        alternates: { languages },
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
