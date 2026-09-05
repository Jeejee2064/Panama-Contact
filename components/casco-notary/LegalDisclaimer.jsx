'use client';
import { ScrollText } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function LegalDisclaimer({ copy }) {
  return (
    <section className="bg-[#F7F3EC] py-16 md:py-20">
      <FadeIn className="max-w-3xl mx-auto px-6">
        <div className="rounded-2xl border border-[#0F1B2A]/10 bg-white p-7 md:p-9">
          <div className="flex items-center gap-2.5 mb-4">
            <ScrollText size={16} className="text-[#C9A55C]" />
            <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-xs md:text-sm tracking-widest">
              {copy.heading}
            </h2>
          </div>
          <p className="font-serif text-[#0F1B2A]/55 text-xs md:text-sm leading-relaxed mb-4">
            {copy.body1}
          </p>
          <p className="font-serif text-[#0F1B2A]/55 text-xs md:text-sm leading-relaxed">
            {copy.body2}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
