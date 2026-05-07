import { useTranslations } from 'next-intl';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';
import { Calendar } from 'lucide-react';

export default function CTA() {
  const t = useTranslations('HomePage.cta');

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/why-panama.avif"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0f1b2a]/70" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          {/* Script font — Lagasignatica */}
          <h2 className="font-[Lagasignatica] text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
            {t('heading')}
          </h2>

          {/* Bold uppercase — Gravesend */}
          <p className="font-[Gravesend] text-xl md:text-3xl lg:text-4xl text-white uppercase tracking-[0.08em] mb-10 md:mb-12 leading-tight max-w-3xl mx-auto">
            {t('subheading')}
          </p>

          <a
            href="https://calendly.com/panama-contact-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#FF491A] hover:bg-[#e63e15] text-white px-10 py-5 rounded-lg transition-all hover:scale-105 shadow-xl font-[Gravesend] text-sm uppercase tracking-[0.15em]"
          >
            <Calendar size={20} strokeWidth={2.5} />
            {t('cta')}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}