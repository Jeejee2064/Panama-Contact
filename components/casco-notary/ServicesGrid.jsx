'use client';
import {
  FileCheck2, IdCard, FileSignature, ScrollText, Landmark,
  Building2, Stamp, Languages, Briefcase, PackageCheck,
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const ICONS = [
  FileCheck2, IdCard, FileSignature, ScrollText, Landmark,
  Building2, Stamp, Languages, Briefcase, PackageCheck,
];

export default function ServicesGrid({ copy }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
          <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-4xl tracking-wide mb-4">
            {copy.heading}
          </h2>
          <p className="font-serif text-[#0F1B2A]/60 leading-relaxed">
            {copy.intro}
          </p>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerChildren={0.06}
        >
          {copy.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={item.title}>
                <div className="group h-full rounded-2xl border border-[#0F1B2A]/10 p-6 hover:border-[#C9A55C]/60 hover:shadow-[0_8px_30px_rgba(15,27,42,0.08)] transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#0F1B2A] text-[#C9A55C] flex items-center justify-center mb-4 group-hover:bg-[#C9A55C] group-hover:text-[#0F1B2A] transition-colors duration-300">
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

        {copy.footnote && (
          <p className="font-serif text-[#0F1B2A]/45 text-xs md:text-sm text-center italic mt-10">
            {copy.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
