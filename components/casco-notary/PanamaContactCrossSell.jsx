'use client';
import { Link } from '@/i18n/navigation';
import { Check, ExternalLink } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

export default function PanamaContactCrossSell({ copy }) {
  return (
    <section className="bg-[#F7F3EC] py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <p className="font-[Lagasignatica] text-[#C9A55C] text-lg md:text-xl mb-3">
            Panama Contact
          </p>
          <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-3xl tracking-wide mb-5">
            {copy.heading}
          </h2>
          <p className="font-serif text-[#0F1B2A]/60 leading-relaxed mb-10">
            {copy.body}
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left mb-10"
          staggerChildren={0.05}
        >
          {copy.items.map((item) => (
            <StaggerItem key={item} className="flex items-start gap-2.5">
              <Check size={15} className="text-[#C9A55C] mt-1 shrink-0" strokeWidth={2.5} />
              <span className="font-serif text-[#0F1B2A]/70 text-sm leading-relaxed">{item}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#0F1B2A] hover:bg-[#182740] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            {copy.linkServices}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#0F1B2A]/70 hover:text-[#0F1B2A] text-sm font-medium transition-colors"
          >
            {copy.linkHome}
            <ExternalLink size={13} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
