'use client';
import { CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

// Distinct from ServicesGrid — this is the closing "you don't need to
// travel" recap, styled as a dark checklist panel rather than icon cards,
// so it reinforces the remote value proposition instead of just repeating it.
export default function RemoteServices({ copy }) {
  return (
    <section className="bg-[#0F1B2A] py-20 md:py-28 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-[Gravesend] uppercase text-white text-2xl md:text-4xl tracking-wide mb-5">
            {copy.heading}
          </h2>
          <p className="font-serif text-white/60 leading-relaxed">
            {copy.intro}
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
          staggerChildren={0.05}
        >
          {copy.items.map((item) => (
            <StaggerItem key={item} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#C9A55C] mt-0.5 shrink-0" strokeWidth={1.75} />
              <span className="font-serif text-white/80 text-sm leading-relaxed">{item}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="font-serif text-white/35 text-xs text-center mt-6 italic">
          {copy.note}
        </p>
      </div>
    </section>
  );
}
