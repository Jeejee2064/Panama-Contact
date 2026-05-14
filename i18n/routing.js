import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',

  // Pathnames localisés
  pathnames: {
    '/': '/',
    '/contact': {
      en: '/contact',
      fr: '/contact',
      es: '/contacto',
      pt: '/contato',
      de: '/kontakt',
    },
    '/services': {
      en: '/services',
      fr: '/services',
      es: '/servicios',
      pt: '/servicos',
      de: '/dienstleistungen',
    },
    '/services/[slug]': {
      en: '/services/[slug]',
      fr: '/services/[slug]',
      es: '/servicios/[slug]',
      pt: '/servicos/[slug]',
      de: '/dienstleistungen/[slug]',
    },
    '/why-panama': {
      en: '/why-move-to-panama',
      fr: '/pourquoi-s-installer-au-panama',
      es: '/por-que-panama',
      pt: '/por-que-panama',
      de: '/warum-panama',
    },
    '/why-panama/[slug]': {
      en: '/why-panama/[slug]',
      fr: '/pourquoi-panama/[slug]',
      es: '/por-que-panama/[slug]',
      pt: '/por-que-panama/[slug]',
      de: '/warum-panama/[slug]',
    },
  },
});