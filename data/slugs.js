// Canonical slug (EN key) → localized URL slug per locale
// Canonical keys are used as translation file keys — never change them.
// Only the locale-specific URL values below affect the actual URLs.

export const serviceSlugMap = {
  'friendly-nations': {
    en: 'friendly-nations-visa-panama-residency',
    fr: 'visa-pays-amis-panama-residence-permanente',
    es: 'visa-paises-amigos-panama-residencia',
    pt: 'visto-paises-amigos-panama-residencia',
    de: 'friendly-nations-visum-panama-aufenthaltserlaubnis',
  },
  'digital-nomad': {
    en: 'digital-nomad-visa-panama',
    fr: 'visa-nomade-numerique-panama',
    es: 'visa-nomada-digital-panama',
    pt: 'visto-nomade-digital-panama',
    de: 'digital-nomad-visum-panama',
  },
  'qualified-investor': {
    en: 'qualified-investor-residency-panama',
    fr: 'residence-investisseur-qualifie-panama',
    es: 'residencia-inversor-calificado-panama',
    pt: 'residencia-investidor-qualificado-panama',
    de: 'qualifizierter-investor-aufenthaltserlaubnis-panama',
  },
  retiring: {
    en: 'retire-in-panama-pensionado-visa',
    fr: 'retraite-au-panama-visa-pensionado',
    es: 'jubilarse-en-panama-visa-pensionado',
    pt: 'aposentar-no-panama-visto-pensionado',
    de: 'rentnervisum-panama',
  },
  'income-tax': {
    en: 'panama-income-tax-declaration-foreigners',
    fr: 'declaration-impots-revenus-panama-expatries',
    es: 'declaracion-renta-panama-extranjeros',
    pt: 'declaracao-imposto-renda-panama-expatriados',
    de: 'einkommensteuererklarung-panama-expats',
  },
  'real-estate': {
    en: 'buy-property-panama-foreigners',
    fr: 'acheter-immobilier-panama-etrangers',
    es: 'comprar-propiedad-panama-extranjeros',
    pt: 'comprar-imoveis-panama-estrangeiros',
    de: 'immobilien-kaufen-panama-auslaender',
  },
  'bank-account': {
    en: 'open-bank-account-panama-foreigner',
    fr: 'ouvrir-compte-bancaire-panama-non-resident',
    es: 'abrir-cuenta-bancaria-panama-extranjero',
    pt: 'abrir-conta-bancaria-panama-estrangeiro',
    de: 'bankkonto-panama-auslaender-eroeffnen',
  },
  business: {
    en: 'company-formation-panama-foreigners',
    fr: 'creation-entreprise-panama-etrangers',
    es: 'crear-empresa-panama-extranjeros',
    pt: 'abrir-empresa-panama-estrangeiros',
    de: 'unternehmen-gruenden-panama-auslaender',
  },
  'goods-import': {
    en: 'import-goods-to-panama',
    fr: 'importation-marchandises-panama',
    es: 'importar-mercancias-panama',
    pt: 'importar-mercadorias-para-panama',
    de: 'warenimport-panama',
  },
  'driver-s-license': {
    en: 'drivers-license-panama-foreigners',
    fr: 'permis-conduire-panama-etrangers',
    es: 'licencia-conducir-panama-extranjeros',
    pt: 'carteira-motorista-panama-estrangeiros',
    de: 'fuehrerschein-panama-auslaender',
  },
  insurance: {
    en: 'health-insurance-expats-panama',
    fr: 'assurance-sante-expatries-panama',
    es: 'seguro-salud-expatriados-panama',
    pt: 'seguro-saude-expatriados-panama',
    de: 'krankenversicherung-expats-panama',
  },
};

export const whyPanamaSlugMap = {
  'life-quality': {
    en: 'cost-of-living-quality-life-panama',
    fr: 'cout-vie-qualite-de-vie-panama',
    es: 'costo-vida-calidad-vida-panama',
    pt: 'custo-vida-qualidade-vida-panama',
    de: 'lebensqualitaet-kosten-panama',
  },
  healthcare: {
    en: 'healthcare-panama-expats',
    fr: 'sante-cout-expatries-panama',
    es: 'salud-costo-expatriados-panama',
    pt: 'saude-custo-expatriados-panama',
    de: 'gesundheitskosten-expats-panama',
  },
  'economic-stability': {
    en: 'economic-stability-panama',
    fr: 'stabilite-economique-croissance-panama',
    es: 'estabilidad-economica-crecimiento-panama',
    pt: 'estabilidade-economica-crescimento-panama',
    de: 'wirtschaftliche-stabilitaet-panama',
  },
  'welcoming-country': {
    en: 'investment-opportunities-panama',
    fr: 'opportunites-investissement-panama',
    es: 'oportunidades-inversion-panama',
    pt: 'oportunidades-investimento-panama',
    de: 'investitionsmoeglichkeiten-panama',
  },
  'financial-hub': {
    en: 'panama-banking-financial-hub',
    fr: 'panama-centre-bancaire-financier',
    es: 'panama-hub-financiero-bancario',
    pt: 'panama-hub-financeiro-bancario',
    de: 'finanzplatz-banken-panama',
  },
  'tax-pressure': {
    en: 'panama-territorial-tax-expats',
    fr: 'fiscalite-territoriale-panama-expatries',
    es: 'sistema-fiscal-territorial-panama',
    pt: 'sistema-fiscal-territorial-panama',
    de: 'territoriales-steuersystem-panama',
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
