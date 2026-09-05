'use client';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

export default function PricingTable({ copy }) {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28 scroll-mt-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-4xl tracking-wide mb-4">
            {copy.heading}
          </h2>
          <p className="font-serif text-[#0F1B2A]/55 text-sm leading-relaxed max-w-xl mx-auto">
            {copy.note}
          </p>
        </div>

        <div className="rounded-2xl border border-[#C9A55C]/30 overflow-hidden">
          <StaggerContainer staggerChildren={0.03}>
            {copy.items.map((item, i) => (
              <StaggerItem key={item.label}>
                <div
                  className={`flex items-baseline justify-between gap-6 px-6 md:px-8 py-4 ${
                    i % 2 === 0 ? 'bg-[#F7F3EC]/60' : 'bg-white'
                  }`}
                >
                  <span className="font-serif text-[#0F1B2A]/80 text-sm md:text-[15px] leading-snug">
                    {item.label}
                  </span>
                  <span className="font-[Gravesend] text-[#0F1B2A] text-sm md:text-base whitespace-nowrap tabular-nums">
                    {item.price}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <p className="font-serif text-[#0F1B2A]/45 text-xs text-center mt-6 italic">
          {copy.deliveryNote}
        </p>
      </div>
    </section>
  );
}
