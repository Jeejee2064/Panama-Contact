'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

// Bespoke accordion for the navy/brass palette — components/ui/FaqAccordion.jsx
// hardcodes the site's orange/#324158 colors and isn't parametrized.
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-[Gravesend] text-[#0F1B2A] text-sm md:text-base uppercase tracking-wide group-hover:text-[#C9A55C] transition-colors">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 text-[#C9A55C] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-5 font-serif text-[#0F1B2A]/55 text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function CascoFaq({ copy }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-4xl tracking-wide text-center mb-12">
          {copy.heading}
        </h2>
        <FadeIn className="divide-y divide-[#0F1B2A]/10 border-t border-[#0F1B2A]/10">
          {copy.items.map((item, i) => (
            <FaqItem
              key={item.question}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
