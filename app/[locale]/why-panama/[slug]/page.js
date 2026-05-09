import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import whyPanamaData from '@/data/why-panama.json';
import { Link } from '@/i18n/navigation';
import { whyPanamaSlugMap, resolveWhyPanamaSlug, localizeWhyPanamaSlug } from '@/data/slugs';
import { locales } from '@/i18n/config';
import FadeIn from '@/components/animations/FadeIn';
import CTA from '@/components/sections/CTA';

/* ── Static params: all locale × localized-slug combos ──────── */
export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const [, translations] of Object.entries(whyPanamaSlugMap)) {
      params.push({ locale, slug: translations[locale] });
    }
  }
  return params;
}

/* ── Metadata ────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const canonicalSlug = resolveWhyPanamaSlug(slug, locale);

  const t = await getTranslations({ locale, namespace: 'WhyPanamaPage' });
  const item = whyPanamaData.find((d) => d.slug === canonicalSlug);
  if (!item) return {};

  const cardTitle = t(`cards.${canonicalSlug}.title`);
  const cardMeta = t.raw(`cards.${canonicalSlug}.meta`);
  const canonical = `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}/why-panama/${slug}`;
  return {
    title: cardMeta?.title ?? `${cardTitle} in Panama — Complete Guide | Panama Contact`,
    description: cardMeta?.description ?? t(`cards.${canonicalSlug}.shortDescription`),
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Panama Contact Services' }],
    },
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `https://panama-contact.com${l === 'en' ? '' : `/${l}`}/why-panama/${localizeWhyPanamaSlug(canonicalSlug, l)}`,
        ])
      ),
    },
  };
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function WhyPanamaDetail({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // "qualite-de-vie" (FR) → "life-quality"
  const canonicalSlug = resolveWhyPanamaSlug(slug, locale);

  // Structural data from JSON (image, orderScore, etc.)
  const item = whyPanamaData.find((d) => d.slug === canonicalSlug);
  if (!item) notFound();

  // Translated content from messages/[locale].json
  const t = await getTranslations({ locale, namespace: 'WhyPanamaPage' });

  const title            = t(`cards.${canonicalSlug}.title`);
  const subtitle         = t(`cards.${canonicalSlug}.subtitle`);
  const shortDescription = t(`cards.${canonicalSlug}.shortDescription`);
  const sections         = t.raw(`cards.${canonicalSlug}.sections`);

  // Related items — other why-panama cards, localized slugs
  const related = whyPanamaData
    .filter((d) => d.slug !== canonicalSlug)
    .sort((a, b) => a.orderScore - b.orderScore)
    .slice(0, 3);

  const baseUrl = `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Why Panama', item: `${baseUrl}/why-panama` },
      { '@type': 'ListItem', position: 3, name: title, item: `${baseUrl}/why-panama/${slug}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[380px] md:h-[460px] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.image})` }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0f1b2a]/65" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-12 w-full">
          <Link
            href="/why-panama"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {t('backToOverview')}
          </Link>

          <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            {subtitle}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-[Gravesend] text-white leading-tight mb-4 max-w-3xl uppercase">
            {title}
          </h1>

          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
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
                    <h2 className="text-2xl font-[Gravesend] text-[#0f1b2a] mb-4 pb-2 border-b border-[#0f1b2a]/10 uppercase">
                      {section.heading}
                    </h2>
                  )}
                  <div
                    className="prose prose-[#324158] max-w-none
                      prose-p:text-[#324158]/60 prose-p:leading-relaxed
                      prose-li:text-[#324158]/60
                      prose-strong:text-[#324158]
                      prose-ul:space-y-2"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </div>
              </FadeIn>
            ))}

            <Link
              href="/why-panama"
              className="inline-flex items-center gap-2 text-[#324158]/50 hover:text-[#324158]/90 text-sm mt-4 transition-colors"
            >
              <ArrowLeft size={16} /> {t('backToOverview')}
            </Link>
          </article>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* CTA card */}
              <FadeIn>
                <div className="bg-[#FF491A] rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">{t('sidebarCtaTitle')}</h3>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">
                    {t('sidebarCtaBody')}
                  </p>
                  <a
                    href="https://calendly.com/panama-contact-info/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-[#FF491A] font-bold px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
                  >
                    <Calendar size={16} />
                    {t('ctaButton')}
                  </a>
                </div>
              </FadeIn>

              {/* Contact */}
              <FadeIn delay={0.1}>
                <div className="rounded-2xl p-6 border border-[#324158]/10">
                  <h3 className="font-semibold text-[#324158] mb-3">{t('sidebarContactTitle')}</h3>
                  <a
                    href="mailto:info@panama-contact.com"
                    className="text-[#FF491A] text-sm hover:underline block mb-1"
                  >
                    info@panama-contact.com
                  </a>
                  <a
                    href="https://wa.me/50764357515"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#324158]/60 text-sm hover:text-[#FF491A] transition-colors"
                  >
                    +507 6435-7515
                  </a>
                </div>
              </FadeIn>

              {/* Related items */}
              {related.length > 0 && (
                <FadeIn delay={0.15}>
                  <div className="rounded-2xl p-6 border border-[#324158]/10">
                    <h3 className="font-semibold text-[#324158] mb-4">{t('sidebarExploreMore')}</h3>
                    <div className="flex flex-col gap-3">
                      {related.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/why-panama/${localizeWhyPanamaSlug(s.slug, locale)}`}
                          className="text-sm text-[#324158]/60 hover:text-[#FF491A] transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF491A]/30 group-hover:bg-[#FF491A] transition-colors shrink-0" />
                          {t(`cards.${s.slug}.title`)}
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

      <CTA />
    </div>
  );
}