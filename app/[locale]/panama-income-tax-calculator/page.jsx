import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import FadeIn from '@/components/animations/FadeIn';
import FaqAccordion from '@/components/ui/FaqAccordion';
import PanamaIncomeTaxCalculator from '@/components/calculators/PanamaIncomeTaxCalculator';
import { ArrowRight } from 'lucide-react';

const PATHNAME = '/panama-income-tax-calculator';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function localizedUrl(locale) {
  const slug = routing.pathnames[PATHNAME][locale];
  return `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}${slug}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'IncomeTaxCalculatorPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: localizedUrl(locale),
      languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l)])),
    },
  };
}

export default async function PanamaIncomeTaxCalculatorPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'IncomeTaxCalculatorPage' });
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
    <div className="pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Compact title — the tool itself is the priority, not a big hero band */}
      <section className="pt-8 pb-2 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-[Gravesend] text-[#324158] mb-2 text-balance">
            {t('hero.heading')}
          </h1>
          <p className="text-[#324158]/60 text-sm md:text-base text-left">{t('hero.subheading')}</p>
        </div>
      </section>

      {/* Interactive calculator — front and center, no scrolling required */}
      <section className="pt-8 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <PanamaIncomeTaxCalculator />
          </FadeIn>
        </div>
      </section>

      {/* Cross-link to Page A (quiz) — before the long SEO explainer */}
      <section className="py-12 px-4 bg-orange-50">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-[Gravesend] text-[#324158] mb-2">{t('crossLink.heading')}</h3>
          <p className="text-[#324158]/70 mb-5">{t('crossLink.body')}</p>
          <Link
            href="/panama-tax-calculator"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            {t('crossLink.cta')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SSR SEO copy (static, indexable) */}
      <section className="py-14 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-[Gravesend] text-[#324158] mb-4">{t('intro.heading')}</h2>
          <p className="text-[#324158]/70 leading-relaxed mb-8">{t('intro.body')}</p>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.bracketsHeading')}</h3>
          <p className="text-[#324158]/70 leading-relaxed mb-4">{t('intro.bracketsIntro')}</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-8 bg-white">
            {t.raw('intro.brackets').map((b) => (
              <div key={b.range} className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-100 last:border-b-0 text-sm">
                <span className="font-medium text-[#324158]">{b.range}</span>
                <span className="text-[#324158]/70 text-right">{b.rate}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.deductionsHeading')}</h3>
          <p className="text-[#324158]/70 leading-relaxed mb-4">{t('intro.deductionsIntro')}</p>
          <ul className="flex flex-col gap-2 mb-8">
            {t.raw('intro.deductions').map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-[#324158]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                {d}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-[Gravesend] text-[#324158] mb-3">{t('intro.exclusionsHeading')}</h3>
          <p className="text-[#324158]/70 leading-relaxed">{t('intro.exclusionsBody')}</p>
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
