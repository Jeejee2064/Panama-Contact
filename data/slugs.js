// Canonical slug (EN key) → localized URL slug per locale
// Canonical keys are used as translation file keys — never change them.
// Only the locale-specific URL values below affect the actual URLs.

export const serviceSlugMap = {
  'friendly-nations': {
    en: 'friendly-nations-visa-panama',
    fr: 'visa-nations-amies-panama',
    es: 'visa-naciones-amigas-panama',
    pt: 'visto-nacoes-amigas-panama',
  },
  'digital-nomad': {
    en: 'digital-nomad-visa-panama',
    fr: 'visa-nomade-numerique-panama',
    es: 'visa-nomada-digital-panama',
    pt: 'visto-nomade-digital-panama',
  },
  'qualified-investor': {
    en: 'qualified-investor-visa-panama',
    fr: 'visa-investisseur-qualifie-panama',
    es: 'visa-inversor-calificado-panama',
    pt: 'visto-investidor-qualificado-panama',
  },
  retiring: {
    en: 'retire-in-panama-pensionado-visa',
    fr: 'retraite-au-panama-visa-pensionado',
    es: 'jubilarse-en-panama-visa-pensionado',
    pt: 'aposentar-no-panama-visto-pensionado',
  },
  'income-tax': {
    en: 'income-tax-panama',
    fr: 'impots-revenu-panama',
    es: 'impuestos-renta-panama',
    pt: 'imposto-de-renda-panama',
  },
  'real-estate': {
    en: 'buy-property-in-panama',
    fr: 'acheter-immobilier-au-panama',
    es: 'comprar-propiedad-en-panama',
    pt: 'comprar-imoveis-no-panama',
  },
  'bank-account': {
    en: 'open-bank-account-panama',
    fr: 'ouvrir-compte-bancaire-panama',
    es: 'abrir-cuenta-bancaria-panama',
    pt: 'abrir-conta-bancaria-no-panama',
  },
  business: {
    en: 'start-business-in-panama',
    fr: 'creer-entreprise-au-panama',
    es: 'crear-empresa-en-panama',
    pt: 'abrir-empresa-no-panama',
  },
  'goods-import': {
    en: 'import-goods-to-panama',
    fr: 'importation-marchandises-panama',
    es: 'importar-mercancias-panama',
    pt: 'importar-mercadorias-para-panama',
  },
  'driver-s-license': {
    en: 'drivers-license-panama',
    fr: 'permis-conduire-panama',
    es: 'licencia-conducir-panama',
    pt: 'carteira-motorista-panama',
  },
  insurance: {
    en: 'expat-insurance-panama',
    fr: 'assurances-expatries-panama',
    es: 'seguros-expatriados-panama',
    pt: 'seguros-expatriados-panama',
  },
};

export const whyPanamaSlugMap = {
  'life-quality': {
    en: 'quality-of-life-panama',
    fr: 'qualite-de-vie-au-panama',
    es: 'calidad-de-vida-en-panama',
    pt: 'qualidade-de-vida-no-panama',
  },
  healthcare: {
    en: 'healthcare-system-panama',
    fr: 'systeme-sante-panama',
    es: 'sistema-salud-panama',
    pt: 'sistema-saude-panama',
  },
  'economic-stability': {
    en: 'economic-stability-panama',
    fr: 'stabilite-economique-panama',
    es: 'estabilidad-economica-panama',
    pt: 'estabilidade-economica-panama',
  },
  'welcoming-country': {
    en: 'expat-community-panama',
    fr: 'expatries-au-panama',
    es: 'expatriados-en-panama',
    pt: 'expatriados-no-panama',
  },
  'financial-hub': {
    en: 'financial-hub-latin-america',
    fr: 'hub-financier-amerique-latine',
    es: 'hub-financiero-latinoamerica',
    pt: 'hub-financeiro-america-latina',
  },
  'tax-pressure': {
    en: 'low-taxes-living-in-panama',
    fr: 'faible-imposition-au-panama',
    es: 'baja-carga-fiscal-panama',
    pt: 'baixa-tributacao-no-panama',
  },
};

// Localized slug → canonical slug
export function resolveServiceSlug(localizedSlug, locale) {
  for (const [canonical, translations] of Object.entries(serviceSlugMap)) {
    if (translations[locale] === localizedSlug) return canonical;
  }
  return localizedSlug;
}

export function resolveWhyPanamaSlug(localizedSlug, locale) {
  for (const [canonical, translations] of Object.entries(whyPanamaSlugMap)) {
    if (translations[locale] === localizedSlug) return canonical;
  }
  return localizedSlug;
}

// Canonical → localized slug
export function localizeServiceSlug(canonicalSlug, locale) {
  return serviceSlugMap[canonicalSlug]?.[locale] ?? canonicalSlug;
}

export function localizeWhyPanamaSlug(canonicalSlug, locale) {
  return whyPanamaSlugMap[canonicalSlug]?.[locale] ?? canonicalSlug;
}
