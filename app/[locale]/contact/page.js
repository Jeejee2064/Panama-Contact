import { getTranslations, setRequestLocale } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';
import { Phone, Mail, MapPin, Calendar, MessageCircle } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return (
    <div className="pt-24">
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-5xl font-bold text-white mb-4">{t('heading')}</h1>
          <p className="text-gray-400 text-lg">{t('subheading')}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* 3-channel contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <FadeIn>
              <a
                href="mailto:info@panama-contact.com"
                className="flex flex-col items-center text-center bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <Mail size={26} className="text-orange-500" />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">{t('email')}</p>
                <p className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm">info@panama-contact.com</p>
                <p className="text-xs text-gray-400 mt-2">{t('emailReply')}</p>
              </a>
            </FadeIn>

            <FadeIn delay={0.05}>
              <a
                href="https://wa.me/50764357515"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:border-green-200 hover:bg-green-50 transition-colors group"
              >
                <div className="w-14 h-14 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <MessageCircle size={26} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">WhatsApp</p>
                <p className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors text-sm">+507 6435-7515</p>
                <p className="text-xs text-gray-400 mt-2">{t('whatsappReply')}</p>
              </a>
            </FadeIn>

            <FadeIn delay={0.1}>
              <a
                href="https://calendly.com/panama-contact-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center bg-orange-500 rounded-2xl p-8 hover:bg-orange-600 transition-colors group"
              >
                <div className="w-14 h-14 bg-white/20 group-hover:bg-white/30 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <Calendar size={26} className="text-white" />
                </div>
                <p className="text-xs text-orange-100 uppercase tracking-widest font-semibold mb-1">{t('bookCall')}</p>
                <p className="font-semibold text-white text-sm">{t('bookCallCta')}</p>
                <p className="text-xs text-orange-100 mt-2">{t('bookCallBody')}</p>
              </a>
            </FadeIn>
          </div>

          {/* Address + info */}
          <FadeIn delay={0.15}>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 max-w-lg mx-auto">
              <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">{t('contactInfo')}</h3>
              <div className="flex flex-col gap-5">
                <a href="tel:+50764357515" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                    <Phone size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{t('phone')}</p>
                    <p className="text-gray-700 font-medium group-hover:text-orange-500 transition-colors">+507 6435-7515</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{t('address')}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Local 1 - Edificio Antigua Domingo<br />
                      Plaza Santa Ana<br />
                      Panama City, Panama
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}