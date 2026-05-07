import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from './ContactForm';
import FadeIn from '@/components/animations/FadeIn';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <ContactForm translations={{
              name: t('name'),
              email: t('email'),
              message: t('message'),
              send: t('send'),
              sending: t('sending'),
              success: t('success'),
              error: t('error'),
            }} />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-8">
              <div className="bg-orange-500 rounded-2xl p-8 text-white">
                <p className="text-orange-100 text-sm font-semibold uppercase tracking-wider mb-2">{t('or')}</p>
                <h2 className="text-2xl font-bold mb-3">{t('bookCall')}</h2>
                <p className="text-orange-100 text-sm mb-6 leading-relaxed">{t('bookCallBody')}</p>
                <a
                  href="https://calendly.com/panama-contact-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors"
                >
                  <Calendar size={18} />
                  {t('bookCall')}
                </a>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-6">{t('contactInfo')}</h3>
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
                  <a href="mailto:info@panama-contact.com" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                      <Mail size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{t('email')}</p>
                      <p className="text-gray-700 font-medium group-hover:text-orange-500 transition-colors">info@panama-contact.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{t('address')}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Edificio Dekel - Oficina 4 - Nivel 200<br />
                        Plaza Santa Ana<br />
                        Ciudad de Panamá, Panamá
                      </p>
                    </div>
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