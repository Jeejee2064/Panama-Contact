'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/why-panama', label: t('whyPanama') },
    { href: '/contact', label: t('contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

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

          {/* 🍔 Burger */}
          <div className="flex items-center mt-6 pr-6 md:pr-12">
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