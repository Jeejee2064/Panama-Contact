import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localizedAlternatesSubset, localizedUrl, SITE_URL } from '@/i18n/urls';
import Hero from '@/components/casco-notary/Hero';
import TrustStrip from '@/components/casco-notary/TrustStrip';
import ServicesTeaser from '@/components/casco-notary/ServicesTeaser';
import PanamaContactCrossSell from '@/components/casco-notary/PanamaContactCrossSell';
import CorporateRates from '@/components/casco-notary/CorporateRates';
import FinalCta from '@/components/casco-notary/FinalCta';

// Mini-site hub page — see /services, /pricing, /delivery, /faq for the
// full sub-pages this used to be one long scroll of.
const PATHNAME = '/casco-notary-services';
const SUPPORTED_LOCALES = ['en', 'es'];
const WHATSAPP_NUMBER = '50764357515';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage.home.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Casco Notary Services — Panama Contact' }],
    },
    alternates: localizedAlternatesSubset(PATHNAME, locale, SUPPORTED_LOCALES),
  };
}

export default async function CascoNotaryHomePage({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage' });
  const home = t.raw('home');
  const serviceItems = t.raw('services.items');
  const whatsappMessage = t('chrome.whatsappMessage');
  const finalCta = t.raw('chrome.finalCta');

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const corporateWhatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(home.corporate.whatsappMessage)}`;

  const baseUrl = `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}`;
  const pageUrl = localizedUrl(PATHNAME, locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Panama Contact', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: home.h1, item: pageUrl },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Notary and document coordination services',
    name: home.h1,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero copy={home} whatsappHref={whatsappHref} />
      <TrustStrip copy={home.trust} />
      <ServicesTeaser copy={home.servicesTeaser} items={serviceItems} />
      <PanamaContactCrossSell copy={home.crossSell} />
      <CorporateRates copy={home.corporate} whatsappHref={corporateWhatsappHref} />
      <FinalCta copy={finalCta} whatsappHref={whatsappHref} />
    </div>
  );
}
