import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

// Bespoke minimal header shared by the Casco Notary mini-site's hub page and
// all its sub-pages (rendered once from the segment layout.jsx). The site's
// global Header is suppressed for these routes (see BARE_HEADER_PATHS in
// components/layout/Header.jsx) — only its floating language pill remains.
export default function CascoHeader({ backLabel }) {
  return (
    <div className="relative z-20 bg-[#0F1B2A] flex items-center justify-between px-6 md:px-10 py-5 md:py-6">
      <Link href="/casco-notary-services" className="flex flex-col leading-none group">
        <span className="font-[Gravesend] uppercase tracking-[0.2em] text-white text-sm md:text-base">
          Casco Notary
        </span>
        <span className="font-[Gravesend] uppercase tracking-[0.2em] text-[#C9A55C] text-sm md:text-base -mt-0.5">
          Services
        </span>
      </Link>

      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs md:text-sm tracking-wide transition-colors"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
        {backLabel}
      </Link>
    </div>
  );
}
