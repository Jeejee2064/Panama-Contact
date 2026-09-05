'use client';
import { Languages } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function Translations({ copy }) {
  return (
    <section className="bg-white py-20 md:py-24 border-b border-[#0F1B2A]/5">
      <FadeIn className="max-w-3xl mx-auto px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F7F3EC] border border-[#C9A55C]/40 flex items-center justify-center text-[#C9A55C] mx-auto mb-6">
          <Languages size={19} strokeWidth={1.75} />
        </div>
        <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-3xl tracking-wide mb-5">
          {copy.heading}
        </h2>
        <p className="font-serif text-[#0F1B2A]/60 leading-relaxed">
          {copy.body}
        </p>
      </FadeIn>
    </section>
  );
}
