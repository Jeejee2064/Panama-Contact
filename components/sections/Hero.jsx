import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/animations/FadeIn';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('HomePage.hero');

  return (
    <section className="sticky top-0 h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center text-center">

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content — pt offsets the fixed header, spacing tightened for all screen heights */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-24 md:pt-28 w-full">

        {/* Logo */}
        <FadeIn>
          <img
            src="/logo-blanc.avif"
            alt="Panama Contact"
            className="w-32 md:w-44 mb-4 md:mb-6 opacity-90"
          />
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.15}>
          <h1 className="font-[Gravesend] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight max-w-4xl">
            {t('headline')}
            <br />
            {t('headlineAccent')}
          </h1>
        </FadeIn>

        {/* Script subtitle */}
        <FadeIn delay={0.25}>
          <p className="font-[Lagasignatica] text-white/80 text-lg md:text-2xl mt-3 md:mt-5">
            {t('subheadline')}
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.35}>
          <div className="mt-7 md:mt-10 flex flex-col items-center gap-3">

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Primary */}
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-[#FF4D1C] hover:bg-[#e6451a] text-white px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-[#FF4D1C]/50 hover:shadow-xl hover:shadow-[#FF4D1C]/60 hover:scale-105 transition-all duration-300"
              >
                {t('cta')}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              {/* Secondary — glass */}
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-white/20 hover:border-white/45 transition-all duration-300"
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            {/* Tertiary — text link */}
            <Link
              href="/why-panama"
              className="group inline-flex items-center gap-1.5 text-white/55 hover:text-white/90 text-sm transition-colors duration-300"
            >
              {t('ctaTertiary')}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}
