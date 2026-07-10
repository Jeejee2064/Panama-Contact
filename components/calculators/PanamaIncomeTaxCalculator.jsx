'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Calendar, FileDown, Info } from 'lucide-react';
import { calculateTax } from '@/lib/panama-tax/calculate';
import { buildIncomeTaxReportPayload } from '@/lib/panama-tax/report';
import { TAX_DISCLAIMER } from '@/lib/panama-tax/disclaimer';
import TaxLeadCaptureForm from '@/components/leads/TaxLeadCaptureForm';

const schema = z.object({
  grossIncome: z.coerce.number().min(0),
  includeDeductions: z.boolean(),
  marriedFilingJointly: z.boolean(),
  mortgageInterest: z.coerce.number().min(0).optional(),
  retirement: z.coerce.number().min(0).optional(),
  donations: z.coerce.number().min(0).optional(),
  educational: z.coerce.number().min(0).optional(),
  medical: z.coerce.number().min(0).optional(),
  studentLoanInterest: z.coerce.number().min(0).optional(),
  healthInsurance: z.coerce.number().min(0).optional(),
  membershipFees: z.coerce.number().min(0).optional(),
});

const inputClass =
  'w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow border-gray-200 bg-white hover:border-gray-300';

function currency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function PanamaIncomeTaxCalculator({ embedded = false, initialGross, hideHeading = false }) {
  const t = useTranslations('IncomeTaxCalculatorPage');
  const [result, setResult] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      grossIncome: initialGross ?? undefined,
      includeDeductions: false,
      marriedFilingJointly: false,
    },
  });

  const includeDeductions = watch('includeDeductions');

  function onSubmit(data) {
    const computed = calculateTax({
      grossIncome: data.grossIncome,
      includeDeductions: data.includeDeductions,
      marriedFilingJointly: data.marriedFilingJointly,
      deductions: {
        mortgageInterest: data.mortgageInterest,
        retirement: data.retirement,
        donations: data.donations,
        educational: data.educational,
        medical: data.medical,
        studentLoanInterest: data.studentLoanInterest,
        healthInsurance: data.healthInsurance,
        membershipFees: data.membershipFees,
      },
    });
    setResult(computed);
    setShowLeadForm(false);
  }

  return (
    <div className={embedded ? '' : 'max-w-3xl mx-auto'}>
      {!hideHeading && (
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            <Info size={12} /> {t('ratesVerifiedLabel')}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('form.grossIncomeLabel')}
          </label>
          <input
            {...register('grossIncome')}
            type="number"
            min="0"
            step="1"
            className={inputClass}
            placeholder={t('form.grossIncomePlaceholder')}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('includeDeductions')} className="w-4 h-4 accent-orange-500" />
          {t('form.includeDeductionsToggle')}
        </label>

        {includeDeductions && (
          <div className="flex flex-col gap-5 border border-gray-100 rounded-2xl p-5 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {t('form.standardDeductionsHeading')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.mortgageInterestLabel')}</label>
                <input {...register('mortgageInterest')} type="number" min="0" className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.retirementLabel')}</label>
                <input {...register('retirement')} type="number" min="0" className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.donationsLabel')}</label>
                <input {...register('donations')} type="number" min="0" className={inputClass} placeholder="0" />
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-orange-600 select-none">
                {t('form.advancedDeductionsToggle')}
              </summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.educationalLabel')}</label>
                  <input {...register('educational')} type="number" min="0" className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.medicalLabel')}</label>
                  <input {...register('medical')} type="number" min="0" className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.studentLoanInterestLabel')}</label>
                  <input {...register('studentLoanInterest')} type="number" min="0" className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.healthInsuranceLabel')}</label>
                  <input {...register('healthInsurance')} type="number" min="0" className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('form.membershipFeesLabel')}</label>
                  <input {...register('membershipFees')} type="number" min="0" className={inputClass} placeholder="0" />
                </div>
              </div>
            </details>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" {...register('marriedFilingJointly')} className="w-4 h-4 accent-orange-500" />
              {t('form.marriedFilingJointly')}
            </label>
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-orange-200"
        >
          {t('form.calculateButton')}
        </button>
      </form>

      {result && (
        <div className="mt-10 flex flex-col gap-8">
          <div>
            <h3 className="text-lg font-[Gravesend] text-[#324158] mb-4 uppercase">{t('results.heading')}</h3>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-4">
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.taxableIncome')}</dt>
                <dd className="text-xl font-semibold text-gray-900">{currency(result.taxableIncome)}</dd>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <dt className="text-xs text-orange-500 uppercase tracking-wide mb-1">{t('results.tax')}</dt>
                <dd className="text-xl font-semibold text-orange-600">{currency(result.tax)}</dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.effectiveRate')}</dt>
                <dd className="text-xl font-semibold text-gray-900">{percent(result.effectiveRate)}</dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.netMonthly')}</dt>
                <dd className="text-xl font-semibold text-gray-900">{currency(result.netMonthly)}</dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2">
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.netAnnual')}</dt>
                <dd className="text-xl font-semibold text-gray-900">{currency(result.netAnnual)}</dd>
              </div>
            </dl>
          </div>

          {result.deductions.total > 0 && (
            <div>
              <h3 className="text-lg font-[Gravesend] text-[#324158] mb-4 uppercase">{t('results.comparisonHeading')}</h3>
              <dl className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.withoutDeductions')}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{currency(result.comparison.taxWithoutDeductions)}</dd>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('results.withDeductions')}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{currency(result.comparison.taxWithDeductions)}</dd>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <dt className="text-xs text-green-600 uppercase tracking-wide mb-1">{t('results.savings')}</dt>
                  <dd className="text-lg font-semibold text-green-700">{currency(result.comparison.savings)}</dd>
                </div>
              </dl>
            </div>
          )}

          <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">{TAX_DISCLAIMER}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://calendly.com/panama-contact-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF491A] hover:bg-[#e63e15] text-white font-bold px-6 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-md"
            >
              <Calendar size={18} />
              {t('cta.bookConsultation')}
            </a>
            <button
              type="button"
              onClick={() => setShowLeadForm(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-[#324158]/20 hover:border-orange-300 hover:bg-orange-50 text-[#324158] font-bold px-6 py-4 rounded-xl transition-colors"
            >
              <FileDown size={18} />
              {t('cta.downloadReport')}
            </button>
          </div>

          {showLeadForm && (
            <TaxLeadCaptureForm
              sourcePage="B"
              answers={buildIncomeTaxReportPayload(result)}
            />
          )}
        </div>
      )}
    </div>
  );
}
