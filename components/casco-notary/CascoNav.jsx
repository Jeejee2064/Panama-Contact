'use client';
import { Link, usePathname } from '@/i18n/navigation';

const TABS = [
  { key: 'home', href: '/casco-notary-services' },
  { key: 'services', href: '/casco-notary-services/services' },
  { key: 'pricing', href: '/casco-notary-services/pricing' },
  { key: 'delivery', href: '/casco-notary-services/delivery' },
  { key: 'faq', href: '/casco-notary-services/faq' },
];

// Sticky sub-nav shared by the hub page and all its sub-pages — the "site
// within a site" wayfinding the mega-scroll page was missing.
export default function CascoNav({ labels }) {
  const pathname = usePathname(); // internal pathname key, e.g. /casco-notary-services/pricing

  return (
    <nav className="sticky top-0 z-30 bg-[#0B141F]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`relative shrink-0 px-4 py-3.5 text-xs md:text-sm font-[Gravesend] uppercase tracking-wide transition-colors ${
                isActive ? 'text-[#C9A55C]' : 'text-white/50 hover:text-white'
              }`}
            >
              {labels[tab.key]}
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C9A55C]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
