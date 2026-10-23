import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCnsContent } from '@/lib/cns/content';
import { localizedAlternatesSubset, localizedUrl, SITE_URL } from '@/i18n/urls';
import SectionHero from '@/components/casco-notary/SectionHero';
import HowItWorks from '@/components/casco-notary/HowItWorks';
import Delivery from '@/components/casco-notary/Delivery';
import Location from '@/components/casco-notary/Location';
import FinalCta from '@/components/casco-notary/FinalCta';

const PATHNAME = '/casco-notary-services/delivery';
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
    title: c.delivery.meta.title,
    description: c.delivery.meta.description,
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Casco Notary Services — Panama Contact' }],
    },
    alternates: localizedAlternatesSubset(PATHNAME, locale, SUPPORTED_LOCALES),
  };
}

export default async function CascoNotaryDeliverySubpage({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);

  const c = await getCnsContent(locale);
  const delivery = c.delivery;
  const finalCta = c.chrome.finalCta;
  const nav = c.chrome.nav;

  const whatsappHref = `https://wa.me/${c.chrome.whatsappNumber}?text=${encodeURIComponent(c.chrome.whatsappMessage)}`;

  const baseUrl = `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}`;
  const hubUrl = localizedUrl('/casco-notary-services', locale);
  const pageUrl = localizedUrl(PATHNAME, locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Panama Contact', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Casco Notary Services', item: hubUrl },
      { '@type': 'ListItem', position: 3, name: nav.delivery, item: pageUrl },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SectionHero eyebrow={nav.delivery} h1={delivery.heading} intro={delivery.intro} />
      <HowItWorks copy={delivery.process} />
      <Delivery copy={delivery} showHeading={false} />
      <Location copy={delivery.location} />
      <FinalCta copy={finalCta} whatsappHref={whatsappHref} />
    </div>
  );
}
