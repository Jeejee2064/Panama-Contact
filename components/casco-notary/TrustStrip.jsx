'use client';
import { ShieldCheck, Clock, MapPin, Truck } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const ICONS = [ShieldCheck, Clock, MapPin, Truck];

export default function TrustStrip({ copy }) {
  return (
    <section className="bg-[#F7F3EC] py-14 md:py-16 border-b border-[#0F1B2A]/5">
      <StaggerContainer className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {copy.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <StaggerItem key={item.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-full border border-[#C9A55C]/50 flex items-center justify-center text-[#C9A55C]">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <p className="font-[Gravesend] text-[#0F1B2A] text-xs md:text-sm uppercase tracking-wide">
                {item.title}
              </p>
              <p className="font-serif text-[#0F1B2A]/55 text-xs md:text-[13px] leading-relaxed">
                {item.description}
              </p>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
