'use client';
import { MapPin, Navigation } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

// The sitewide LocalBusiness JSON-LD (app/[locale]/layout.js) carries
// lat/long 8.9936, -79.5197 for this same address — that point is ~5km
// from San Felipe / Casco Viejo, nowhere near the real office. Cross-checked
// against OpenStreetMap: independent lookups for "Avenida B" and "Calle 10
// Este" in San Felipe both land within ~40m of 8.9532, -79.5368, so that's
// the coordinate used here (with a text label via Google's "lat,lng(label)"
// query syntax, so the pin still shows a name, not just a marker).
const LAT = 8.9532;
const LNG = -79.5368;
const OFFICE_LABEL = 'Casco Notary Services';
const MAPS_QUERY = `${LAT},${LNG}(${OFFICE_LABEL})`;
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=17&output=embed`;
const MAPS_DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

export default function Location({ copy }) {
  return (
    <section className="bg-white py-20 md:py-24 border-b border-[#0F1B2A]/5">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <FadeIn>
          <h2 className="font-[Gravesend] uppercase text-[#0F1B2A] text-2xl md:text-3xl tracking-wide mb-4">
            {copy.heading}
          </h2>
          <p className="font-serif text-[#0F1B2A]/60 leading-relaxed mb-6">
            {copy.intro}
          </p>
          <p className="flex items-start gap-2.5 font-serif text-[#0F1B2A]/70 text-sm leading-relaxed mb-6">
            <MapPin size={16} className="text-[#C9A55C] mt-0.5 shrink-0" />
            {copy.address}
          </p>
          <a
            href={MAPS_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#0F1B2A] border border-[#C9A55C]/40 hover:border-[#C9A55C] hover:bg-[#F7F3EC] px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Navigation size={14} />
            {copy.directions}
          </a>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl overflow-hidden border border-[#0F1B2A]/10 aspect-[4/3]">
            <iframe
              src={MAPS_EMBED_SRC}
              title="Casco Notary Services — office location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
