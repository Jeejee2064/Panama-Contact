'use client';
import { Send, Truck, Handshake, Eye, PackageCheck } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

// Send a photo for a quote → hand over the physical originals (pickup or
// drop-off) → we coordinate with the notary → we follow up → we deliver.
// The hand-over step matters: notarial acts need the physical document,
// not just the WhatsApp photo used for the initial quotation.
const ICONS = [Send, Truck, Handshake, Eye, PackageCheck];

export default function HowItWorks({ copy }) {
  return (
    <section className="bg-[#F7F3EC] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-4xl tracking-wide text-center mb-14 md:mb-16">
          {copy.heading}
        </h2>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6"
          staggerChildren={0.1}
        >
          {copy.steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={step.title} className="relative flex flex-col items-center text-center">
                {i < copy.steps.length - 1 && (
                  <span className="hidden lg:block absolute top-7 left-[60%] w-full h-px bg-[#C9A55C]/30" />
                )}
                <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-[#C9A55C]/50 flex items-center justify-center text-[#C9A55C] mb-5">
                  <Icon size={20} strokeWidth={1.75} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0F1B2A] text-[#C9A55C] text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-[Gravesend] text-[#0F1B2A] text-sm uppercase tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="font-serif text-[#0F1B2A]/55 text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
