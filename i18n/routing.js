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
    '/panama-tax-calculator': {
      en: '/panama-tax-calculator',
      fr: '/calculateur-impots-panama',
      es: '/calculadora-impuestos-panama',
      pt: '/calculadora-impostos-panama',
      de: '/steuerrechner-panama',
    },
    '/panama-income-tax-calculator': {
      en: '/panama-income-tax-calculator',
      fr: '/calculateur-impot-revenu-panama',
      es: '/calculadora-impuesto-renta-panama',
      pt: '/calculadora-imposto-renda-panama',
      de: '/einkommensteuerrechner-panama',
    },
    '/privacy-policy': {
      en: '/privacy-policy',
      fr: '/politique-de-confidentialite',
      es: '/politica-de-privacidad',
      pt: '/politica-de-privacidade',
      de: '/datenschutzerklaerung',
    },
  },
});