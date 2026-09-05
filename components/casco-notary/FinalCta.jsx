'use client';
import { MessageCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import SealMotif from './SealMotif';

export default function FinalCta({ copy, whatsappHref }) {
  return (
    <section className="relative bg-[#0F1B2A] py-24 md:py-32 overflow-hidden text-center">
      <SealMotif className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] text-[#C9A55C] opacity-[0.08]" />

      <FadeIn className="relative z-10 max-w-2xl mx-auto px-6">
        <h2 className="font-[Gravesend] uppercase text-white text-2xl md:text-4xl tracking-wide mb-5">
          {copy.heading}
        </h2>
        <p className="font-serif text-white/60 leading-relaxed mb-10">
          {copy.body}
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20b958] text-[#0F1B2A] px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-sm md:text-base tracking-wide shadow-xl shadow-[#25D366]/20 hover:scale-105 transition-all duration-300"
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          {copy.cta}
        </a>
      </FadeIn>
    </section>
  );
}
