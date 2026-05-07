import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import servicesData from '@/data/services.json';
import { serviceSlugMap, resolveServiceSlug, localizeServiceSlug } from '@/data/slugs';
import { locales } from '@/i18n/config';
import Badge from '@/components/ui/Badge';
import FadeIn from '@/components/animations/FadeIn';
import FaqAccordion from '@/components/ui/FaqAccordion';
import { ArrowLeft, Calendar } from 'lucide-react';
import CTA from '@/components/sections/CTA';

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const [, translations] of Object.entries(serviceSlugMap)) {
      params.push({ locale, slug: translations[locale] });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const canonicalSlug = resolveServiceSlug(slug, locale);

  const t = await getTranslations({ locale, namespace: 'services' });
  const item = t.raw(canonicalSlug);
  if (!item) return {};

  const canonical = `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}/services/${slug}`;
  return {
    title: `${item.title} in Panama — Expert Guide & Services | Panama Contact`,
    description: item.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `https://panama-contact.com${l === 'en' ? '' : `/${l}`}/services/${localizeServiceSlug(canonicalSlug, l)}`,
        ])
      ),
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const canonicalSlug = resolveServiceSlug(slug, locale);

  const service = servicesData.services
    ? servicesData.services.find((s) => s.slug === canonicalSlug)
    : servicesData.find((s) => s.slug === canonicalSlug);
  if (!service) notFound();

  const tServices = await getTranslations({ locale, namespace: 'services' });
  const tDetail   = await getTranslations({ locale, namespace: 'ServiceDetail' });

  const title            = tServices(`${canonicalSlug}.title`);
  const shortDescription = tServices(`${canonicalSlug}.description`);
  const sections         = tServices.raw(`${canonicalSlug}.sections`);
  const faqItems         = tServices.raw(`${canonicalSlug}.faq`) ?? [];

  const allServices = servicesData.services ?? servicesData;
  const related = allServices
    .filter((s) => s.tag === service.tag && s.slug !== canonicalSlug)
    .sort((a, b) => a.orderScore - b.orderScore)
    .slice(0, 3);

  const baseUrl = `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}`;
  const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') ?? '';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
      { '@type': 'ListItem', position: 3, name: title, item: `${baseUrl}/services/${slug}` },
    ],
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[380px] md:h-[460px] flex flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        <div className="absolute inset-0 bg-[#324158]/65" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-12 w-full">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {tDetail('backToServices')}
          </Link>

          <div className="mb-4">
            <Badge tag={service.tag} />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-[Gravesend] text-white leading-tight mb-4 max-w-3xl uppercase">
            {title}
          </h1>

          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            {shortDescription}
          </p>
        </div>
      </section>

      {/* ── Content + Sidebar ──────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">

          {/* Main article */}
          <article>
            {sections.map((section, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="mb-10">
                  {section.heading && (
                    <h2 className="text-2xl font-[Gravesend] text-[#324158] mb-4 pb-2 border-b border-[#324158]/10">
                      {section.heading}
                    </h2>
                  )}
                  <div
                    className="prose prose-[#324158] max-w-none prose-li:text-[#324158]/60 prose-p:text-[#324158]/60 prose-p:leading-relaxed prose-strong:text-[#324158]"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </div>
              </FadeIn>
            ))}

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#324158]/70 hover:text-[#324158]/90 text-sm mt-2 mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> {tDetail('backToServices')}
            </Link>
          </article>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* CTA card */}
              <FadeIn>
                <div className="bg-orange-500 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">{tDetail('ctaTitle')}</h3>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">{tDetail('ctaBody')}</p>
                  <a
                    href="https://calendly.com/panama-contact-info/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-orange-500 font-bold px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
                  >
                    <Calendar size={16} />
                    {tDetail('ctaButton')}
                  </a>
                </div>
              </FadeIn>

              {/* Contact */}
              <FadeIn delay={0.1}>
                <div className="rounded-2xl p-6 border border-[#324158]/10">
                  <h3 className="font-semibold text-[#324158] mb-3">{tDetail('contactTitle')}</h3>
                  <a href="mailto:info@panama-contact.com" className="text-orange-500 text-sm hover:underline block mb-1">
                    info@panama-contact.com
                  </a>
                  <a href="https://wa.me/50764357515" target="_blank" rel="noopener noreferrer" className="text-[#324158]/60 text-sm hover:text-orange-500 transition-colors">
                    +507 6435-7515
                  </a>
                </div>
              </FadeIn>

              {/* Related services */}
              {related.length > 0 && (
                <FadeIn delay={0.15}>
                  <div className="rounded-2xl p-6 border border-[#324158]/10">
                    <h3 className="font-semibold text-[#324158] mb-4">{tDetail('relatedTitle')}</h3>
                    <div className="flex flex-col gap-3">
                      {related.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${localizeServiceSlug(s.slug, locale)}`}
                          className="text-sm text-[#324158]/60 hover:text-orange-500 transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-200 group-hover:bg-orange-500 transition-colors shrink-0" />
                          {tServices(`${s.slug}.title`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

            </div>
          </aside>

        </div>
      </section>

      {/* ── Per-service FAQ ────────────────────────────────────── */}
      {faqItems.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-[Gravesend] text-[#324158] mb-10 uppercase">
              {tDetail('faqTitle')}
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <CTA />

    </div>
  );
}