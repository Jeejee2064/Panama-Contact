'use client';
import { Briefcase, MessageCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

// B2B pitch for businesses based in Casco Viejo — recurring courier/notarial/
// translation/banking errands at a corporate rate, separate from the
// individual-client pricing on /pricing.
export default function CorporateRates({ copy, whatsappHref }) {
  return (
    <section className="bg-[#F7F3EC] py-20 md:py-24 border-t border-[#0F1B2A]/5">
      <FadeIn className="max-w-2xl mx-auto px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-white border border-[#C9A55C]/40 flex items-center justify-center text-[#C9A55C] mx-auto mb-6">
          <Briefcase size={19} strokeWidth={1.75} />
        </div>
        <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-3xl tracking-wide mb-5">
          {copy.heading}
        </h2>
        <p className="font-serif text-[#0F1B2A]/60 leading-relaxed mb-8">
          {copy.body}
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#0F1B2A] hover:bg-[#182740] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <MessageCircle size={17} />
          {copy.cta}
        </a>
      </FadeIn>
    </section>
  );
}
