'use client';
import { PlaneTakeoff, Clock, Ban } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function Delivery({ copy }) {
  return (
    <section className="bg-[#0F1B2A] py-20 md:py-28 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <FadeIn>
          <h2 className="font-[Gravesend] uppercase text-white text-2xl md:text-4xl tracking-wide mb-5 leading-tight">
            {copy.heading}
          </h2>
          <p className="font-serif text-white/60 leading-relaxed mb-8">
            {copy.intro}
          </p>

          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <Clock size={17} className="text-[#C9A55C] mt-0.5 shrink-0" />
              <span className="font-serif text-white/80 text-sm leading-relaxed">{copy.standard}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={17} className="text-[#C9A55C] mt-0.5 shrink-0" />
              <span className="font-serif text-white/80 text-sm leading-relaxed">{copy.urgent}</span>
            </li>
            <li className="flex items-start gap-3">
              <PlaneTakeoff size={17} className="text-[#C9A55C] mt-0.5 shrink-0" />
              <span className="font-serif text-white/80 text-sm leading-relaxed">{copy.airport}</span>
            </li>
            <li className="flex items-start gap-3">
              <Ban size={17} className="text-white/40 mt-0.5 shrink-0" />
              <span className="font-serif text-white/40 text-sm leading-relaxed">{copy.restriction}</span>
            </li>
          </ul>
        </FadeIn>

        {/* Abstract route graphic — Casco Viejo → Tocumen, no map screenshot */}
        <FadeIn delay={0.15}>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-10 md:p-14">
            <svg viewBox="0 0 320 140" className="w-full h-auto" aria-hidden="true">
              <path
                d="M20 110 C 90 20, 200 20, 300 60"
                stroke="#C9A55C"
                strokeWidth="1.25"
                strokeDasharray="4 6"
                fill="none"
                opacity="0.6"
              />
              <circle cx="20" cy="110" r="5" fill="#C9A55C" />
              <circle cx="300" cy="60" r="5" fill="#C9A55C" />
              <circle cx="20" cy="110" r="10" stroke="#C9A55C" strokeWidth="0.75" fill="none" opacity="0.5" />
              <circle cx="300" cy="60" r="10" stroke="#C9A55C" strokeWidth="0.75" fill="none" opacity="0.5" />
            </svg>
            <div className="flex items-center justify-between mt-2 text-xs font-[Gravesend] uppercase tracking-wide text-white/60">
              <span>Casco Viejo</span>
              <span className="text-[#C9A55C]">Tocumen</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
