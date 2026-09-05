'use client';
import { Link } from '@/i18n/navigation';
import { FileCheck2, IdCard, FileSignature, ScrollText, ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const ICONS = [FileCheck2, IdCard, FileSignature, ScrollText];

// Condensed preview of the full ServicesGrid — the home page teases 4 of the
// 10 services and sends everything else (plus pricing) to its own page.
export default function ServicesTeaser({ copy, items }) {
  const preview = items.slice(0, 4);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-4xl tracking-wide mb-4">
            {copy.heading}
          </h2>
          <p className="font-serif text-[#0F1B2A]/60 leading-relaxed">
            {copy.intro}
          </p>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
          staggerChildren={0.07}
        >
          {preview.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-[#0F1B2A]/10 p-6">
                  <div className="w-10 h-10 rounded-full bg-[#0F1B2A] text-[#C9A55C] flex items-center justify-center mb-4">
                    <Icon size={17} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-[Gravesend] text-[#0F1B2A] text-sm uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="font-serif text-[#0F1B2A]/55 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/casco-notary-services/services"
            className="group inline-flex items-center gap-2 bg-[#0F1B2A] hover:bg-[#182740] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            {copy.seeAllLabel}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/casco-notary-services/pricing"
            className="inline-flex items-center gap-1.5 text-[#0F1B2A]/70 hover:text-[#0F1B2A] text-sm font-medium transition-colors"
          >
            {copy.pricingLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
