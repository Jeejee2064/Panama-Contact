'use client';
import Link from 'next/link';
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

          {/* 🌍 Language & 🍔 Burger - Positioned below the CTA and right-aligned with the text */}
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
      </div>
    </header>
  );
}