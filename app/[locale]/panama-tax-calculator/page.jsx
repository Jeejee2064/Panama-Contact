import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import { localizeServiceSlug, localizeWhyPanamaSlug } from '@/data/slugs';
import FadeIn from '@/components/animations/FadeIn';
import FaqAccordion from '@/components/ui/FaqAccordion';
import TaxExposureQuiz from '@/components/quiz/TaxExposureQuiz';
import { ArrowRight } from 'lucide-react';

const PATHNAME = '/panama-tax-calculator';

// Ordered by relevance to a tax/residency-focused visitor.
const RELATED_SERVICE_SLUGS = [
  'income-tax', 'business', 'friendly-nations', 'qualified-investor',
  'retiring', 'real-estate', 'bank-account', 'digital-nomad',
  'insurance', 'goods-import', 'driver-s-license',
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function localizedUrl(locale) {
  const slug = routing.pathnames[PATHNAME][locale];
  return `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}${slug}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TaxExposureQuizPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: localizedUrl(locale),
      languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l)])),
    },
  };
}

export default async function PanamaTaxCalculatorPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'TaxExposureQuizPage' });
  const tServices = await getTranslations({ locale, namespace: 'services' });
  const faqItems = t.raw('faq') ?? [];
  const baseUrl = `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: t('hero.heading'), item: localizedUrl(locale) },
    ],
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('hero.heading'),
    url: localizedUrl(locale),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null;

  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Compact title — the tool itself is the priority, not a big hero band */}
      <section className="pt-8 pb-2 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-[Gravesend] text-[#324158] mb-2">
            {t('hero.heading')}
          </h1>
          <p className="text-[#324158]/60 text-sm md:text-base">{t('hero.subheading')}</p>
        </div>
      </section>

      {/* Interactive quiz — front and center, no scrolling required */}
      <section className="pt-8 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <TaxExposureQuiz />
          </FadeIn>
        </div>
      </section>

      {/* SSR SEO copy (static, indexable) — moved below the tool */}
      <section className="py-14 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-[Gravesend] text-[#324158] mb-4">{t('intro.heading')}</h2>
          <p className="text-[#324158]/70 leading-relaxed mb-8">{t('intro.body')}</p>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.territorialHeading')}</h3>
          <p className="text-[#324158]/70 leading-relaxed mb-8">{t('intro.territorialBody')}</p>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.triggersHeading')}</h3>
          <ul className="flex flex-col gap-2 mb-8">
            {t.raw('intro.triggers').map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#324158]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.whyHeading')}</h3>
          <p className="text-[#324158]/70 leading-relaxed">{t('intro.whyBody')}</p>
        </div>
      </section>

      {/* Cross-link to Page B (calculator) */}
      <section className="py-12 px-4 bg-orange-50">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-[Gravesend] text-[#324158] mb-2">{t('crossLink.heading')}</h3>
          <p className="text-[#324158]/70 mb-5">{t('crossLink.body')}</p>
          <Link
            href="/panama-income-tax-calculator"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            {t('crossLink.cta')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Internal links to related services */}
      <section className="py-14 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-[Gravesend] text-[#324158] mb-6">{t('relatedServicesHeading')}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {RELATED_SERVICE_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/services/${localizeServiceSlug(slug, locale)}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#324158]/10 hover:border-orange-300 hover:bg-orange-50 transition-colors p-4 text-sm font-medium text-[#324158] group"
              >
                {tServices(`${slug}.title`)}
                <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href={`/why-panama/${localizeWhyPanamaSlug('tax-pressure', locale)}`} className="text-[#324158]/60 hover:text-orange-500 transition-colors underline">
              {t('territorialTaxSystemLink')}
            </Link>
            <Link href="/contact" className="text-[#324158]/60 hover:text-orange-500 transition-colors underline">
              {t('contactUsLink')}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-[Gravesend] text-[#324158] mb-10 uppercase">{t('faqHeading')}</h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      )}
    </div>
  );
}
