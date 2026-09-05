import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localizedAlternatesSubset, localizedUrl, SITE_URL } from '@/i18n/urls';
import Hero from '@/components/casco-notary/Hero';
import TrustStrip from '@/components/casco-notary/TrustStrip';
import ServicesGrid from '@/components/casco-notary/ServicesGrid';
import HowItWorks from '@/components/casco-notary/HowItWorks';
import Delivery from '@/components/casco-notary/Delivery';
import Location from '@/components/casco-notary/Location';
import Translations from '@/components/casco-notary/Translations';
import PanamaContactCrossSell from '@/components/casco-notary/PanamaContactCrossSell';
import PricingTable from '@/components/casco-notary/PricingTable';
import RemoteServices from '@/components/casco-notary/RemoteServices';
import LegalDisclaimer from '@/components/casco-notary/LegalDisclaimer';
import CascoFaq from '@/components/casco-notary/CascoFaq';
import FinalCta from '@/components/casco-notary/FinalCta';
import CascoFooter from '@/components/casco-notary/CascoFooter';

// Standalone EN/ES-only landing page — see i18n/routing.js and
// the plan at .claude/plans for why this route intentionally skips
// fr/pt/de rather than following the site's usual 5-locale pattern.
const PATHNAME = '/casco-notary-services';
const SUPPORTED_LOCALES = ['en', 'es'];
const WHATSAPP_NUMBER = '50764357515';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Casco Notary Services — Panama Contact' }],
    },
    alternates: localizedAlternatesSubset(PATHNAME, locale, SUPPORTED_LOCALES),
  };
}

export default async function CascoNotaryServicesPage({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage' });

  const copy = {
    eyebrowSuffix: t('eyebrowSuffix'),
    h1: t('h1'),
    subhead: t('subhead'),
    ctaPrimary: t('ctaPrimary'),
    ctaSecondary: t('ctaSecondary'),
    backToSite: t('backToSite'),
    whatsappMessage: t('whatsappMessage'),
    trust: t.raw('trust'),
    services: t.raw('services'),
    process: t.raw('process'),
    delivery: t.raw('delivery'),
    location: t.raw('location'),
    translations: t.raw('translations'),
    crossSell: t.raw('crossSell'),
    pricing: t.raw('pricing'),
    remote: t.raw('remote'),
    disclaimer: t.raw('disclaimer'),
    faq: t.raw('faq'),
    finalCta: t.raw('finalCta'),
    footer: t.raw('footer'),
  };

  // Pre-filled greeting so the big WhatsApp CTA doesn't drop clients into an
  // empty chat — they land ready to send their document straight away.
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.whatsappMessage)}`;

  const baseUrl = `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}`;
  const pageUrl = localizedUrl(PATHNAME, locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Panama Contact', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: copy.h1, item: pageUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Notary and document coordination services',
    name: copy.h1,
    provider: {
      '@type': 'Organization',
      name: 'Panama Contact Services, S.A.',
      url: SITE_URL,
    },
    areaServed: { '@type': 'City', name: 'Panama City' },
    url: pageUrl,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero copy={copy} backLabel={copy.backToSite} whatsappHref={whatsappHref} />
      <TrustStrip copy={copy.trust} />
      <ServicesGrid copy={copy.services} />
      <HowItWorks copy={copy.process} />
      <Delivery copy={copy.delivery} />
      <Location copy={copy.location} />
      <Translations copy={copy.translations} />
      <PanamaContactCrossSell copy={copy.crossSell} />
      <PricingTable copy={copy.pricing} />
      <RemoteServices copy={copy.remote} />
      <LegalDisclaimer copy={copy.disclaimer} />
      <CascoFaq copy={copy.faq} />
      <FinalCta copy={copy.finalCta} whatsappHref={whatsappHref} />
      <CascoFooter copy={copy.footer} />
    </div>
  );
}
