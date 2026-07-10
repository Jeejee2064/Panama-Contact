'use client';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';

// These 2 tool pages have no dark hero backdrop for the transparent nav to sit on,
// and don't need the full site menu — a minimal, always-legible header instead.
const MINIMAL_HEADER_PATHS = {
  '/panama-tax-calculator': 'TaxExposureQuizPage.hero.heading',
  '/panama-income-tax-calculator': 'IncomeTaxCalculatorPage.hero.heading',
};

function MinimalHeader({ titleKey }) {
  const t = useTranslations();
  const tNav = useTranslations('Nav');
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e2b3a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo-blanc.avif" alt="Panama Contact" className="h-9 object-contain" />
        </Link>
        <p className="hidden sm:block text-white/80 text-sm font-medium truncate">{t(titleKey)}</p>
        <div className="flex items-center gap-4 shrink-0">
          <LanguageSwitcher />
          <a
            href="https://calendly.com/panama-contact-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#FF4D1C] hover:bg-[#e6451a] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-lg transition-colors"
          >
            <Calendar size={14} />
            <span className="hidden sm:inline">{tNav('freeConsultation')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const minimalTitleKey = MINIMAL_HEADER_PATHS[pathname];

  const links = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/why-panama', label: t('whyPanama') },
    { href: '/contact', label: t('contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  if (minimalTitleKey) return <MinimalHeader titleKey={minimalTitleKey} />;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* 🔝 Container to manage the split content */}
      <div className="flex items-start justify-between">
        
        {/* 🧭 Logo (Remains on the left with its padding) */}
        <Link href="/" className="pt-6 pl-6 md:pl-12">
          <img
            src="/logo-blanc.avif"
            alt="Panama Contact"
            className="h-12 md:h-16 object-contain"
          />
        </Link>

        {/* 👉 Right side structure: CTA Tab + Below Elements */}
        <div className="flex flex-col items-end flex-grow">
          
          {/* 🎯 CTA Tab - hidden on mobile, visible md+ */}
          <Link
            href="https://calendly.com/panama-contact-info/30min"
            target="_blank"
            className="hidden md:block bg-[#FF4D1C] text-white text-sm font-bold px-10 py-3 rounded-bl-full hover:bg-[#e6451a] transition-all duration-300 shadow-lg"
          >
            {t('freeConsultation')}
          </Link>

          {/* 🌍 Language & 🍔 Burger */}
          <div className="flex items-center gap-6 mt-6 pr-6 md:pr-12">
            <div className="text-white">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

        </div>
      </div>

      {/* 📱 Fullscreen menu */}
      <div
        className={`fixed inset-0 w-full h-screen bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 text-white transition-all duration-500 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 text-white hover:text-[#FF4D1C] transition-colors"
          aria-label="Close menu"
        >
          <X size={32} />
        </button>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-3xl font-bold tracking-widest hover:text-[#FF4D1C] transition"
          >
            {link.label.toUpperCase()}
          </Link>
        ))}

        <a
          href="https://calendly.com/panama-contact-info/30min"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="mt-4 bg-[#FF4D1C] hover:bg-[#e6451a] text-white font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-widest"
        >
          {t('freeConsultation')}
        </a>

        <div className="mt-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}