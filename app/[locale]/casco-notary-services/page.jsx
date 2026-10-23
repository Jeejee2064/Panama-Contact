import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCnsContent } from '@/lib/cns/content';
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

// Content comes from the CMS (/admin/cns); re-check the database every 5 min
// as a safety net on top of the on-save revalidation.
export const revalidate = 300;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};

  const c = await getCnsContent(locale);

  return {
    title: c.home.meta.title,
    description: c.home.meta.description,
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

  const c = await getCnsContent(locale);
  const home = c.home;
  const serviceItems = c.services.items;
  const finalCta = c.chrome.finalCta;

  const whatsappHref = `https://wa.me/${c.chrome.whatsappNumber}?text=${encodeURIComponent(c.chrome.whatsappMessage)}`;
  const corporateWhatsappHref = `https://wa.me/${c.chrome.whatsappNumber}?text=${encodeURIComponent(home.corporate.whatsappMessage)}`;

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
