import { useTranslations } from 'next-intl';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';

export default function WhyUs() {
  const t = useTranslations('HomePage.whyUs');

  const items = [
    { key: 'experienced', num: '1' },
    { key: 'longTerm', num: '2' },
    { key: 'global', num: '3' },
    { key: 'multilingual', num: '4' },
    { key: 'deadlines', num: '5' },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 gap-y-14">

          {/* ── Row 1 ── */}

          {/* Text block — col-span-2 */}
          <FadeIn className="md:col-span-2">
            <div>
              <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                {t('sectionLabel')}
              </p>
              <h2 className="font-[Gravesend] text-4xl md:text-[2.75rem] lg:text-5xl text-[#324158] uppercase leading-[0.95] mb-6">
                {t('heading')}
              </h2>
              <p className="text-[#324158]/60 text-[15px] leading-[1.7] max-w-md">
                {t('subheading')}
              </p>
            </div>
          </FadeIn>

          {/* Item 1 */}
          <FadeIn delay={0.05}>
            <div className="relative">
              <span className="font-[Gravesend] mb-4  text-[5rem] md:text-[5.5rem] text-[#324158]/[0.6] leading-none block -mb-2 select-none">
                1
              </span>
              <h3 className="font-[Gravesend] text-[11px] uppercase tracking-[0.14em] text-[#324158] font-bold mb-3">
                {t(`items.experienced.title`)}
              </h3>
              <p className="text-[13px] text-[#324158]/55 leading-[1.7]">
                {t(`items.experienced.body`)}
              </p>
            </div>
          </FadeIn>

          {/* Item 2 */}
          <FadeIn delay={0.1}>
            <div className="relative">
              <span className="font-[Gravesend] mb-4  text-[5rem] md:text-[5.5rem] text-[#324158]/[0.6] leading-none block -mb-2 select-none">
                2
              </span>
              <h3 className="font-[Gravesend] text-[11px] uppercase tracking-[0.14em] text-[#324158] font-bold mb-3">
                {t(`items.longTerm.title`)}
              </h3>
              <p className="text-[13px] text-[#324158]/55 leading-[1.7]">
                {t(`items.longTerm.body`)}
              </p>
            </div>
          </FadeIn>

          {/* ── Row 2 ── */}

          {/* Item 3 */}
          <FadeIn delay={0.15}>
            <div className="relative">
              <span className="font-[Gravesend] mb-4  text-[5rem] md:text-[5.5rem] text-[#324158]/[0.6] leading-none block -mb-2 select-none">
                3
              </span>
              <h3 className="font-[Gravesend] text-[11px] uppercase tracking-[0.14em] text-[#324158] font-bold mb-3">
                {t(`items.global.title`)}
              </h3>
              <p className="text-[13px] text-[#324158]/55 leading-[1.7]">
                {t(`items.global.body`)}
              </p>
            </div>
          </FadeIn>

          {/* Item 4 */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <span className="font-[Gravesend] mb-4  text-[5rem] md:text-[5.5rem] text-[#324158]/[0.6] leading-none block -mb-2 select-none">
                4
              </span>
              <h3 className="font-[Gravesend] text-[11px] uppercase tracking-[0.14em] text-[#324158] font-bold mb-3">
                {t(`items.multilingual.title`)}
              </h3>
              <p className="text-[13px] text-[#324158]/55 leading-[1.7]">
                {t(`items.multilingual.body`)}
              </p>
            </div>
          </FadeIn>

          {/* Item 5 */}
          <FadeIn delay={0.25}>
            <div className="relative">
              <span className="font-[Gravesend] mb-4 text-[5rem] md:text-[5.5rem] text-[#324158]/[0.6] leading-none block -mb-2 select-none">
                5
              </span>
              <h3 className="font-[Gravesend] text-[11px] uppercase tracking-[0.14em] text-[#324158] font-bold mb-3">
                {t(`items.deadlines.title`)}
              </h3>
              <p className="text-[13px] text-[#324158]/55 leading-[1.7]">
                {t(`items.deadlines.body`)}
              </p>
            </div>
          </FadeIn>

          {/* Picture */}
          <FadeIn delay={0.3}>
            <div className="relative h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden">
              <Image
                src="/Businessman.avif"
                alt="Business professional"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}