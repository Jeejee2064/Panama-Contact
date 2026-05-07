"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FaqAccordion
 * Props:
 *   items — array of { question: string, answer: string }
 */
export default function FaqAccordion({ items = [] }) {
  const [open, setOpen] = useState(null);

  if (!items.length) return null;

  return (
    <div className="divide-y divide-[#324158]/10 border-t border-[#324158]/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left group"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[#324158] text-base leading-snug group-hover:text-orange-500 transition-colors">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 mt-0.5 text-orange-500 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="pb-5 text-[#324158]/60 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}