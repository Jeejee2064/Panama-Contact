'use client';
import SealMotif from './SealMotif';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

// Compact page-hero for each mini-site sub-page — gives every URL its own
// H1 (good for SEO) without repeating the full home hero treatment.
export default function SectionHero({ eyebrow, h1, intro }) {
  return (
    <section className="relative overflow-hidden bg-[#0F1B2A] py-16 md:py-20">
      <SealMotif className="pointer-events-none absolute -right-16 -top-16 w-[280px] h-[280px] text-[#C9A55C] opacity-[0.12]" />

      <StaggerContainer className="relative z-10 max-w-3xl mx-auto px-6 text-center" staggerChildren={0.1}>
        {eyebrow && (
          <StaggerItem>
            <p className="font-[Lagasignatica] text-[#C9A55C] text-lg md:text-xl mb-2">
              {eyebrow}
            </p>
          </StaggerItem>
        )}
        <StaggerItem>
          <h1 className="font-[Gravesend] uppercase text-white text-2xl sm:text-3xl md:text-4xl tracking-wide leading-tight">
            {h1}
          </h1>
        </StaggerItem>
        {intro && (
          <StaggerItem>
            <p className="font-serif text-white/60 text-sm md:text-base mt-4 leading-relaxed max-w-xl mx-auto">
              {intro}
            </p>
          </StaggerItem>
        )}
      </StaggerContainer>
    </section>
  );
}
