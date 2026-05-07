import { useTranslations } from 'next-intl';
import FadeIn from '@/components/animations/FadeIn';
import { Sparkles, MapPin, Globe, ShieldCheck } from 'lucide-react';

const icons = [Sparkles, MapPin, Globe, ShieldCheck];

export default function Features() {
  const t = useTranslations('HomePage.features');

  const items = [
    { key: 'tailored', icon: icons[0] },
    { key: 'local', icon: icons[1] },
    { key: 'international', icon: icons[2] },
    { key: 'transparent', icon: icons[3] },
  ];

  return (
    <section className="py-28 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">

        {/* 🔝 Header */}
        <div className="max-w-4xl mb-20">
          
          <FadeIn>
            <p className="text-sm uppercase tracking-widest font-semibold mb-4 text-[#FF491A]">
              {t('sectionLabel')}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-[Gravesend] text-4xl md:text-5xl leading-tight mb-6 text-[#324158]">
              {t('headline')}
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg leading-relaxed text-[#324158]/80">
              {t('description')}
            </p>
          </FadeIn>

        </div>

        {/* 🧩 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map(({ key, icon: Icon }, i) => (
            <FadeIn key={key} delay={i * 0.1}>
              
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <Icon size={32} className="text-[#324158]" />
                </div>

                {/* Title */}
                <h3 className="font-[Gravesend] text-lg tracking-wide uppercase mb-4 text-[#324158]">
                  {t(`${key}.title`)}
                </h3>

                {/* Body */}
                <p className="text-sm leading-relaxed text-[#324158]/70">
                  {t(`${key}.body`)}
                </p>

              </div>

            </FadeIn>
          ))}

        </div>
      </div>
    </section>
  );
}