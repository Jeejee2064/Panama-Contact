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
    },
    '/services': {
      en: '/services',
      fr: '/services',
      es: '/servicios',
      pt: '/servicos',
    },
    '/services/[slug]': {
      en: '/services/[slug]',
      fr: '/services/[slug]',
      es: '/servicios/[slug]',
      pt: '/servicos/[slug]',
    },
    '/why-panama': {
      en: '/why-move-to-panama',
      fr: '/pourquoi-s-installer-au-panama',
      es: '/por-que-panama',
      pt: '/por-que-panama',
    },
    '/why-panama/[slug]': {
      en: '/why-panama/[slug]',
      fr: '/pourquoi-panama/[slug]',
      es: '/por-que-panama/[slug]',
      pt: '/por-que-panama/[slug]',
    },
  },
});