'use client';

import { useTranslations, useLocale } from 'next-intl';
import { services } from '@/data/services';
import { localizeServiceSlug } from '@/data/slugs';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default function ServicesPreview() {
  const t = useTranslations('HomePage.services');
  const tServices = useTranslations('services');
  const locale = useLocale();

  // take first 3 (or sort if needed)
  const preview = services.slice(0, 3);

  return (
    <section className="relative py-28 text-white">

      {/* 🔥 Background */}
      <div className="absolute inset-0">
        <Image
          src="/services/retiring.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#324158]/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* 🔝 Header */}
        <div className="mb-16">
          <p className="text-sm uppercase  tracking-widest font-semibold mb-4 text-[#FF491A]">
            {t('sectionLabel')}
          </p>

          <h2 className="font-[Gravesend] text-5xl md:text-6xl text-white">
            {t('heading')}
          </h2>
        </div>

        {/* 🧱 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {preview.map((service) => {
            const title = tServices(`${service.slug}.title`);
            const description = tServices(`${service.slug}.description`);
            const localSlug = localizeServiceSlug(service.slug, locale);

            return (
              <Link
                key={service.slug}
                href={`/services/${localSlug}`}
                className="group rounded-3xl overflow-hidden bg-white text-[#324158] hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="relative h-56">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Tag */}
                  <div className="absolute top-4 left-4 bg-[#FF491A] text-white text-xs font-semibold px-3 py-1 rounded-md">
                    {service.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <h3 className="font-semibold font-[Gravesend] text-lg leading-snug mb-4 uppercase">
                    {title}
                  </h3>

                  <p className="text-sm text-[#324158]/70 leading-relaxed line-clamp-4">
                    {description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 🔘 CTA */}
        <div className="flex justify-center mt-14">
          <Link
            href="/services"
            className="bg-[#FF491A] hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-md transition-all"
          >
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}