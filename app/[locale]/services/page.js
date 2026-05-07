import { getTranslations, setRequestLocale } from 'next-intl/server';
import servicesData from '@/data/services.json';
import ServicesGrid from './ServicesGrid';
import CTA from '@/components/sections/CTA';
import FaqAccordion from '@/components/ui/FaqAccordion';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ServicesPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

/* ── Top-level FAQ items shown on the /services listing page ── */
const TOP_FAQ_SLUGS = [
  { slug: 'friendly-nations', index: 0 }, // "How can a foreigner obtain residency in Panama?"
  { slug: 'friendly-nations', index: 2 }, // "How much does residency cost?"
  { slug: 'bank-account',     index: 0 }, // "How can a foreigner open a bank account?"
  { slug: 'bank-account',     index: 2 }, // "How long does a bank account take?"
  { slug: 'business',         index: 0 }, // "How can a foreigner create a company?"
  { slug: 'business',         index: 2 }, // "How much does it cost?"
  { slug: 'real-estate',      index: 0 }, // "Can a foreigner buy property?"
  { slug: 'real-estate',      index: 3 }, // "Can buying property lead to residency?"
];

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t        = await getTranslations({ locale, namespace: 'ServicesPage' });
  const tSvc     = await getTranslations({ locale, namespace: 'services' });
  const services = servicesData.services ?? servicesData;

  /* Build FAQ items by pulling from individual service faq arrays */
  const faqItems = TOP_FAQ_SLUGS.map(({ slug, index }) => {
    const faq = tSvc.raw(`${slug}.faq`);
    return faq?.[index] ?? null;
  }).filter(Boolean);

  const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') ?? '';
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(item.answer) },
    })),
  } : null;

  return (
    <div>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[300px] flex flex-col justify-end overflow-hidden pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/services.avif')" }}
        />
        <div className="absolute inset-0 bg-gray-900/65" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <h1 className="text-5xl font-[Gravesend] sm:text-6xl font-extrabold text-white uppercase tracking-tight mb-5">
            {t('heading')}
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl leading-relaxed">
            {t('subheading')}
          </p>
        </div>
      </section>

      {/* ── Services Grid (with filter tabs) ─────────────────────── */}
      <ServicesGrid services={services} />

      {/* ── Global FAQ ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              FAQ
            </p>
            <h2 className="font-[Gravesend] text-3xl md:text-4xl text-[#324158] uppercase leading-tight mb-3">
              {t('faq.heading')}
            </h2>
            <p className="text-[#324158]/55 text-base leading-relaxed">
              {t('faq.subheading')}
            </p>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <CTA />
    </div>
  );
}