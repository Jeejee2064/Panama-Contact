import { useTranslations } from 'next-intl';
import FadeIn from '@/components/animations/FadeIn';

export default function LegalNotice() {
  const t = useTranslations('HomePage.legalNotice');

  return (
    <section className="py-16 md:py-20 bg-[#f7f7f8] border-t border-[#324158]/5">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <p className="text-[#FF491A] text-[11px] font-bold uppercase tracking-[0.2em] mb-5 text-center">
            {t('sectionLabel')}
          </p>
          <div className="flex flex-col gap-4">
            <p className="text-[#324158]/55 text-[13px] leading-[1.7] text-center">
              {t('body1')}
            </p>
            <p className="text-[#324158]/55 text-[13px] leading-[1.7] text-center">
              {t('body2')}
            </p>
            <p className="text-[#324158]/55 text-[13px] leading-[1.7] text-center">
              {t('body3')}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
