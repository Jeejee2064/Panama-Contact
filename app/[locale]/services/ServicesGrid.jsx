'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import { localizeServiceSlug } from '@/data/slugs';
import { useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ServicesGrid({ services }) {
  const [filter, setFilter] = useState('all');
  const t = useTranslations('ServicesPage');
  const tServices = useTranslations('services');
  const locale = useLocale();

  const tabs = [
    { key: 'all',       label: t('filterAll') },
    { key: 'VISA',      label: t('filterVisa') },
    { key: 'SETUP',     label: t('filterSetup') },
    { key: 'LIFESTYLE', label: t('filterLifestyle') }
  ];

  const filtered = [...services]
    .filter((s) => filter === 'all' || s.tag === filter)
    .sort((a, b) => a.orderScore - b.orderScore);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === tab.key
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((service) => {
            // Read title + description from translation files
            const title = tServices(`${service.slug}.title`);
            const description = tServices(`${service.slug}.description`);
            // Localize the slug for the href
            const localSlug = localizeServiceSlug(service.slug, locale);

            return (
              <motion.div
                key={service.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href={`/services/${localSlug}`}
                  className="group block h-full rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <Image src={service.image} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gray-900/5 group-hover:bg-orange-500/5 transition-colors" />
                    <div className="absolute top-3 left-3">
                      <Badge tag={service.tag} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                      {t('readMore')} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}