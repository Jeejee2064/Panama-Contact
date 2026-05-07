import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  HeartPulse,
  TrendingUp,
  Briefcase,
  Landmark,
  Wallet,
  ChevronDown,
  Globe,
  Shield,
} from 'lucide-react';
import whyPanamaData from '@/data/why-panama.json';
import { Link } from '@/i18n/navigation';
import { localizeWhyPanamaSlug } from '@/data/slugs';
import FadeIn from '@/components/animations/FadeIn';

const iconMap = {
  'life-quality':       Heart,
  'healthcare':         HeartPulse,
  'economic-stability': TrendingUp,
  'welcoming-country':  Briefcase,
  'financial-hub':      Landmark,
  'tax-pressure':       Wallet,
};

/* ── Stat strip data ─────────────────────────────────────────── */
const STATS = [
  { value: '120+', label: 'Years on the US Dollar' },
  { value: '80+',  label: 'International Banks' },
  { value: '#1',   label: 'Logistics Hub in LatAm' },
  { value: '180+', label: 'Bird Species in the Canal Zone' },
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WhyPanamaPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function WhyPanamaPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'WhyPanamaPage' });
  const sortedData = [...whyPanamaData].sort((a, b) => a.orderScore - b.orderScore);

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <Image
          src="/why-panama.avif"
          alt="Panama skyline and canal"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Gradient: heavy at bottom for text legibility, lighter at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b2a] via-[#0f1b2a]/50 to-[#0f1b2a]/10" />

    

        <div className="relative w-full max-w-7xl mx-auto px-6 pb-12">
          <FadeIn>
      
            <h1 className="font-[Gravesend] mt-24 text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.92] mb-6 max-w-4xl">
              {t('heading')}
            </h1>
            <p className="text-white/65 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
              {t('subheading')}
            </p>

   
          </FadeIn>
        </div>
      </section>

      {/* ── Stat strip ───────────────────────────────────────────── */}
      <div className="bg-[#FF491A]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/20">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center px-4">
              <span className="font-[Gravesend] text-3xl md:text-4xl text-white leading-none mb-1">{value}</span>
              <span className="text-white/75 text-[11px] uppercase tracking-widest font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Intro ────────────────────────────────────────────────── */}
      <section id="discover" className="py-24 md:py-32 px-6 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <FadeIn>
            <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Panama</p>
            <h2 className="font-[Gravesend] text-4xl md:text-5xl text-[#0f1b2a] uppercase mb-8 leading-tight">
              {t('introHeading')}
            </h2>
            <div className="space-y-5 text-[#324158]/70 text-base md:text-[17px] leading-[1.85]">
              <p>{t('introBody1')}</p>
              <p>{t('introBody2')}</p>
              <p>{t('introBody3')}</p>
            </div>
          </FadeIn>

          {/* Second image panel */}
          <FadeIn delay={0.15}>
            <div className="relative h-[480px] md:h-[560px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/why-panama-2.avif"
                alt="Panama nature and diversity"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Decorative accent */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#FF491A] shrink-0" />
                  <p className="text-white text-sm font-semibold leading-snug">
                    One of the safest and most stable economies in Latin America
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Advantages heading ───────────────────────────────────── */}
      <div id="advantages" className="bg-gray-50 scroll-mt-20 pt-20 md:pt-28 px-6">
        <div className="max-w-7xl mx-auto mb-14">
          <FadeIn>
            <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Why Choose Panama</p>
            <h2 className="font-[Gravesend] text-4xl md:text-5xl text-[#0f1b2a] uppercase leading-tight max-w-2xl">
              Six Reasons Panama Stands Apart
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* ── Cards Grid ───────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedData.map((item, i) => {
              const title       = t(`cards.${item.slug}.title`);
              const subtitle    = t(`cards.${item.slug}.subtitle`);
              const description = t(`cards.${item.slug}.shortDescription`);
              const localizedSlug = localizeWhyPanamaSlug(item.slug, locale);
              const Icon = iconMap[item.slug] || Briefcase;

              return (
                <FadeIn key={item.slug} delay={i * 0.08}>
                  <Link
                    href={`/why-panama/${localizedSlug}`}
                    className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#FF491A]/8 hover:border-[#FF491A]/25 transition-all duration-500"
                  >
                    {/* Icon header */}
                    <div className="h-44 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50">
                      {/* Order number watermark */}
                      <span className="absolute bottom-3 right-5 text-gray-200/80 text-8xl font-[Gravesend] leading-none select-none">
                        {String(item.orderScore).padStart(2, '0')}
                      </span>
                      {/* Icon box */}
                      <div className="relative z-10 w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF491A] group-hover:shadow-lg group-hover:shadow-[#FF491A]/30 transition-all duration-500">
                        <Icon
                          size={38}
                          className="text-[#FF491A] group-hover:text-white transition-colors duration-500"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6 md:p-7">
                      <p className="text-[#FF491A] text-[10px] font-bold uppercase tracking-[0.18em] mb-2">
                        {subtitle}
                      </p>
                      <h3 className="font-[Gravesend] text-xl text-[#0f1b2a] uppercase mb-3 group-hover:text-[#FF491A] transition-colors duration-300 leading-tight">
                        {title}
                      </h3>
                      <p className="text-sm text-[#324158]/60 leading-relaxed line-clamp-3 mb-5 flex-1">
                        {description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[#FF491A] text-sm font-bold group-hover:gap-3 transition-all duration-300">
                        {t('readMore')} <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Full-width quote break ───────────────────────────────── */}
      <section className="bg-[#0f1b2a] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="font-[Lagasignatica] text-2xl md:text-3xl text-[#FF491A] mb-4 italic">
              "A hidden gem at the crossroads of the world."
            </p>
            <p className="text-white/40 text-sm uppercase tracking-widest font-semibold">
              Panama — Where Two Oceans Meet
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <Image
          src="/why-panama-2.avif"
          alt="Panama landscape"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0f1b2a]/75" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-[Lagasignatica] text-2xl md:text-3xl text-white/80 mb-3 italic">
              {t('ctaLabel')}
            </p>
            <h2 className="font-[Gravesend] text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-[0.05em] mb-12 leading-tight">
              {t('ctaHeading')}
            </h2>
            <a
              href="https://calendly.com/panama-contact-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#FF491A] hover:bg-[#e63e15] text-white px-10 py-5 rounded-lg transition-all hover:scale-105 shadow-2xl shadow-[#FF491A]/40 font-[Gravesend] text-sm uppercase tracking-[0.15em]"
            >
              {t('ctaButton')} <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}