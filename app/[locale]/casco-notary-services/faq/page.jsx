import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localizedAlternatesSubset, localizedUrl, SITE_URL } from '@/i18n/urls';
import SectionHero from '@/components/casco-notary/SectionHero';
import CascoFaq from '@/components/casco-notary/CascoFaq';
import FinalCta from '@/components/casco-notary/FinalCta';

const PATHNAME = '/casco-notary-services/faq';
const SUPPORTED_LOCALES = ['en', 'es'];
const WHATSAPP_NUMBER = '50764357515';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage.faq.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Casco Notary Services — Panama Contact' }],
    },
    alternates: localizedAlternatesSubset(PATHNAME, locale, SUPPORTED_LOCALES),
  };
}

export default async function CascoNotaryFaqSubpage({ params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CascoNotaryPage' });
  const faq = t.raw('faq');
  const whatsappMessage = t('chrome.whatsappMessage');
  const finalCta = t.raw('chrome.finalCta');
  const nav = t.raw('chrome.nav');

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const baseUrl = `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}`;
  const hubUrl = localizedUrl('/casco-notary-services', locale);
  const pageUrl = localizedUrl(PATHNAME, locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Panama Contact', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Casco Notary Services', item: hubUrl },
      { '@type': 'ListItem', position: 3, name: nav.faq, item: pageUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SectionHero eyebrow={nav.faq} h1={faq.heading} />
      <CascoFaq copy={faq} showHeading={false} />
      <FinalCta copy={finalCta} whatsappHref={whatsappHref} />
    </div>
  );
}
