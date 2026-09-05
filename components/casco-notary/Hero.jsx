'use client';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import SealMotif from './SealMotif';
import CascoHeader from './CascoHeader';

export default function Hero({ copy, backLabel, whatsappHref }) {
  return (
    <section className="relative overflow-hidden bg-[#0F1B2A] pb-20 md:pb-28">
      {/* Line-art backdrop — no photo, editorial/graphic hero per design brief */}
      <SealMotif className="pointer-events-none absolute -right-24 -top-24 w-[420px] h-[420px] text-[#C9A55C] opacity-[0.18] md:w-[560px] md:h-[560px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A55C]/40 to-transparent" />

      <CascoHeader backLabel={backLabel} />

      <StaggerContainer className="relative z-10 max-w-4xl mx-auto px-6 pt-16 md:pt-24 text-center" staggerChildren={0.12}>
        <StaggerItem>
          <p className="font-[Lagasignatica] text-[#C9A55C] text-xl md:text-2xl mb-3">
            {copy.eyebrowSuffix}
          </p>
        </StaggerItem>

        <StaggerItem>
          <h1 className="font-[Gravesend] uppercase text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide">
            {copy.h1}
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="font-serif text-white/70 text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {copy.subhead}
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20b958] text-[#0F1B2A] px-7 py-4 rounded-xl font-bold text-sm md:text-base tracking-wide shadow-xl shadow-[#25D366]/20 hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              {copy.ctaPrimary}
            </a>

            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 border border-[#C9A55C]/40 text-[#C9A55C] hover:border-[#C9A55C] hover:bg-[#C9A55C]/10 px-7 py-4 rounded-xl font-semibold text-sm md:text-base tracking-wide transition-all duration-300"
            >
              {copy.ctaSecondary}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
