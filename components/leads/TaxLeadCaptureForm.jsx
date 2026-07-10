'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CheckCircle, Send } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  consent: z.literal(true),
  website: z.string().max(0).optional(), // honeypot — must stay empty
});

/**
 * Minimal, low-friction lead form: first name + email + consent only.
 * Props: sourcePage ('A'|'B'), answers (report payload — see lib/panama-tax/report.ts).
 */
export default function TaxLeadCaptureForm({ sourcePage, answers }) {
  const t = useTranslations('TaxLeadForm');
  const locale = useLocale();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    setStatus('sending');
    try {
      const res = await fetch('/api/tax-calculator-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          email: data.email,
          consent: data.consent,
          website: data.website,
          sourcePage,
          locale,
          answers,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-green-100 bg-green-50 p-8">
        <CheckCircle size={40} className="text-green-500 mb-3" />
        <p className="text-green-700 font-medium">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 bg-gray-50"
    >
      <div>
        <h3 className="font-[Gravesend] text-[#324158] text-lg mb-1">{t('heading')}</h3>
        <p className="text-sm text-[#324158]/60">{t('body')}</p>
      </div>

      <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('firstNameLabel')}</label>
          <input
            {...register('firstName')}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow ${
              errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('emailLabel')}</label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          />
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input type="checkbox" {...register('consent')} className="w-4 h-4 mt-0.5 accent-orange-500" />
        <span>
          {t('consentPrefix')}
          <Link href="/privacy-policy" className="text-orange-600 underline hover:text-orange-700">
            {t('consentLinkText')}
          </Link>
          {t('consentSuffix')}
        </span>
      </label>
      {(errors.consent || errors.email || errors.firstName) && (
        <p className="text-xs text-red-500">{t('errorMessage')}</p>
      )}

      {status === 'error' && <p className="text-sm text-red-500">{t('errorMessage')}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-3 rounded-xl transition-all"
      >
        <Send size={16} />
        {status === 'sending' ? t('sendingButton') : t('submitButton')}
      </button>
    </form>
  );
}
