import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function Footer() {
  const t = useTranslations('Footer');

  const servicesCol1 = [
    { href: '/services/insurance',        label: 'Insurance' },
    { href: '/services/driver-s-license', label: "Driver's license" },
    { href: '/services/goods-import',     label: 'Goods import' },
    { href: '/services/business',         label: 'Business setup' },
    { href: '/services/bank-account',     label: 'Bank account' },
    { href: '/services/real-estate',      label: 'Real estate' },
  ];

  const servicesCol2 = [
    { href: '/services/income-tax',          label: 'Income tax' },
    { href: '/services/retiring',            label: 'Retiring' },
    { href: '/services/qualified-investor',  label: 'Qualified investor' },
    { href: '/services/digital-nomad',       label: 'Digital nomad' },
    { href: '/services/friendly-nations',    label: 'Friendly nations' },
  ];

  return (
    <footer className="bg-[#1e2b3a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-blanc.avif"
                alt="Panama Contact"
                width={120}
                height={56}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://wa.me/50764357515"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#FF4D1C] transition-colors"
              >
                {WA_ICON}
                +507 6435-7515
              </a>
              <a
                href="mailto:info@panama-contact.com"
                className="flex items-center gap-2.5 hover:text-[#FF4D1C] transition-colors"
              >
                <Mail size={14} className="text-[#FF4D1C] shrink-0" />
                info@panama-contact.com
              </a>
              <p className="flex items-start gap-2.5 text-gray-500 text-xs mt-1">
                <MapPin size={14} className="mt-0.5 text-gray-500 shrink-0" />
                <span>
                  Edificio Dekel – Oficina 4 – Nivel 200<br />
                  Plaza Santa Ana – Ciudad de Panamá
                </span>
              </p>
            </div>
          </div>

          {/* Services col 1 */}
          <div>
            <p className="text-white font-semibold text-xs mb-5 uppercase tracking-widest">
              {t('services')}
            </p>
            <ul className="flex flex-col gap-2.5">
              {servicesCol1.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm hover:text-[#FF4D1C] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services col 2 */}
          <div>
            <p className="invisible text-xs mb-5">&nbsp;</p>
            <ul className="flex flex-col gap-2.5">
              {servicesCol2.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm hover:text-[#FF4D1C] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links + CTA */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-white font-semibold text-xs mb-5 uppercase tracking-widest">
                {t('quickLinks')}
              </p>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/" className="text-sm hover:text-[#FF4D1C] transition-colors">{t('home')}</Link></li>
                <li><Link href="/services" className="text-sm hover:text-[#FF4D1C] transition-colors">{t('services')}</Link></li>
                <li><Link href="/why-panama" className="text-sm hover:text-[#FF4D1C] transition-colors">{t('whyPanama')}</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-[#FF4D1C] transition-colors">{t('contact')}</Link></li>
              </ul>
            </div>

            {/* CTA block */}
            <div className="bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 rounded-xl p-4">
              <p className="text-white text-sm font-semibold mb-3">{t('ctaHeading')}</p>
              <a
                href="https://calendly.com/panama-contact-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#FF4D1C] hover:bg-[#e6451a] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                {t('freeConsultation')} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Panamá Contact Services. All rights reserved.</span>
          <span className="text-gray-700">Panama City, Republic of Panama</span>
        </div>
      </div>
    </footer>
  );
}
