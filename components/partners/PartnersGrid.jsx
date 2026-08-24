import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import partners from '@/data/partners.json';

export default async function PartnersGrid({ locale }) {
  const t = await getTranslations({ locale, namespace: 'PartnersPage' });

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-3xl font-[Gravesend] text-[#324158] mb-4 uppercase">
          {t('heading')}
        </h1>
        <p className="text-[#324158]/70 leading-relaxed max-w-2xl mx-auto">
          {t('intro')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl overflow-hidden bg-white border border-[#324158]/10 hover:shadow-2xl transition-all flex flex-col"
          >
            <div className="relative h-32 flex items-center justify-center bg-[#324158]/5 p-8">
              <Image
                src={partner.logo}
                alt={t(`${partner.id}.name`)}
                width={180}
                height={64}
                className="object-contain max-h-16 w-auto group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-8 text-center flex flex-col flex-1">
              <h2 className="font-semibold font-[Gravesend] text-lg leading-snug mb-3 uppercase text-[#324158]">
                {t(`${partner.id}.name`)}
              </h2>
              <p className="text-sm text-[#324158]/70 leading-relaxed mb-6 flex-1">
                {t(`${partner.id}.description`)}
              </p>
              <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#FF491A] group-hover:text-[#e6451a] transition-colors">
                {t('cta')} <ExternalLink size={14} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
