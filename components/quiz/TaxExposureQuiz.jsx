'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, Calendar, AlertTriangle, FileDown } from 'lucide-react';
import { STEPS, FIRST_STEP_ID, US_ALERT_STEP_ID, hasIncomeCalcTrigger } from '@/lib/tax-quiz/config';
import { resolveQuiz } from '@/lib/tax-quiz/score';
import { LAST_VERIFIED } from '@/lib/panama-tax/config';
import {
  trackQuizStart,
  trackQuizStepView,
  trackQuizStepComplete,
  trackQuizBackClick,
  trackQuizAbandon,
  trackQuizComplete,
  trackQuizResultView,
  trackQuizCalendlyClick,
  trackPdfFormOpen,
} from '@/lib/analytics';
import TaxLeadCaptureForm from '@/components/leads/TaxLeadCaptureForm';

function findStep(stepId) {
  return STEPS.find((s) => s.id === stepId);
}

// Indirected through a module-level helper so timing reads only ever happen
// inside event handlers/effects, never inline during render.
function now() {
  return Date.now();
}

export default function TaxExposureQuiz() {
  const t = useTranslations('TaxExposureQuizPage');
  const [answers, setAnswers] = useState([]);
  const [stepStack, setStepStack] = useState([FIRST_STEP_ID]);
  const [resolution, setResolution] = useState(null);
  const [showUsAlert, setShowUsAlert] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const currentStepId = stepStack[stepStack.length - 1];
  const currentStep = findStep(currentStepId);

  const quizStartedAt = useRef(null);
  const stepMountedAt = useRef(null);
  const abandonFired = useRef(false);
  const completed = useRef(false);
  const latestStepIndex = useRef(stepStack.length);
  const latestStepId = useRef(currentStepId);

  // quiz_start — once, on mount.
  useEffect(() => {
    quizStartedAt.current = now();
    trackQuizStart();
  }, []);

  // quiz_step_view — whenever a new question step is shown, and reset its timer.
  useEffect(() => {
    if (showUsAlert || resolution) return;
    stepMountedAt.current = now();
    latestStepIndex.current = stepStack.length;
    latestStepId.current = currentStepId;
    trackQuizStepView(stepStack.length, currentStepId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId]);

  // quiz_abandon — fires once, on tab hide/switch, unless the quiz was already
  // completed (bucket resolved or US-person short-circuit reached).
  useEffect(() => {
    completed.current = Boolean(resolution) || showUsAlert;
  }, [resolution, showUsAlert]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== 'hidden' || abandonFired.current || completed.current) return;
      abandonFired.current = true;
      trackQuizAbandon(latestStepIndex.current, latestStepId.current);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  function selectOption(option) {
    const timeOnStepMs = now() - stepMountedAt.current;
    trackQuizStepComplete(stepStack.length, currentStepId, timeOnStepMs, option.value);

    const nextAnswers = [...answers.filter((a) => a.stepId !== currentStepId), { stepId: currentStepId, value: option.value }];
    setAnswers(nextAnswers);

    if (option.next === US_ALERT_STEP_ID) {
      setShowUsAlert(true);
    } else if (option.next === null) {
      const resolved = resolveQuiz(nextAnswers);
      setResolution(resolved);
      trackQuizComplete(now() - quizStartedAt.current, stepStack.length);
      trackQuizResultView(resolved.bucket);
    } else {
      setStepStack([...stepStack, option.next]);
    }
  }

  function goBack() {
    if (stepStack.length > 1) {
      trackQuizBackClick(currentStepId);
      setStepStack(stepStack.slice(0, -1));
    }
  }

  if (showUsAlert) {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-[Gravesend] text-[#324158] mb-3">{t('usAlert.heading')}</h2>
          <p className="text-sm text-[#324158]/70 leading-relaxed">{t('usAlert.body')}</p>
        </div>
        <a
          href="https://calendly.com/panama-contact-info/30min"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackQuizCalendlyClick()}
          className="flex items-center justify-center gap-2 bg-[#FF491A] hover:bg-[#e63e15] text-white font-bold px-6 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-md"
        >
          <Calendar size={18} />
          {t('cta.bookConsultation')}
        </a>
      </div>
    );
  }

  if (resolution) {
    const bucketKey = resolution.bucket.toLowerCase();
    const checklist = t.raw(`results.${bucketKey}.checklist`) ?? [];
    const services = t.raw(`results.${bucketKey}.services`) ?? [];
    const showIncomeCalc = hasIncomeCalcTrigger(resolution.flags);

    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-3">
            {resolution.bucket}
          </span>
          <h2 className="text-2xl font-[Gravesend] text-[#324158] mb-4">{t(`results.${bucketKey}.title`)}</h2>

          {checklist.length > 0 && (
            <ul className="flex flex-col gap-2 mb-6">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#324158]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {services.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {t('recommendedServicesHeading')}
              </h3>
              <ul className="flex flex-col gap-2">
                {services.map((item) => (
                  <li key={item} className="text-sm text-[#324158]/70">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://calendly.com/panama-contact-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackQuizCalendlyClick()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF491A] hover:bg-[#e63e15] text-white font-bold px-6 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-md"
          >
            <Calendar size={18} />
            {t('cta.bookConsultation')}
          </a>
          <button
            type="button"
            onClick={() => {
              setShowLeadForm(true);
              trackPdfFormOpen();
            }}
            className="flex-1 flex items-center justify-center gap-2 border border-[#324158]/20 hover:border-orange-300 hover:bg-orange-50 text-[#324158] font-bold px-6 py-4 rounded-xl transition-colors"
          >
            <FileDown size={18} />
            {t('cta.downloadReport')}
          </button>
        </div>

        {showLeadForm && <TaxLeadCaptureForm sourcePage="A" calcInputs={{ answers }} />}

        {showIncomeCalc && (
          <div className="rounded-2xl border border-orange-100 p-6 bg-orange-50/50">
            <h3 className="font-[Gravesend] text-[#324158] text-lg mb-1">{t('block5.heading')}</h3>
            <p className="text-sm text-[#324158]/60 mb-5">{t('block5.body')}</p>
            <Link
              href="/panama-income-tax-calculator"
              className="inline-flex items-center gap-2 bg-white border border-orange-200 hover:border-orange-400 text-[#324158] font-bold px-5 py-3 rounded-xl transition-colors"
            >
              {t('block5.cta')} <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {resolution.warnings.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">{t('warningsHeading')}</p>
              {resolution.warnings.map((w) => (
                <p key={w} className="text-sm text-amber-700">{w}</p>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
          {t('disclaimer', { date: LAST_VERIFIED })}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {stepStack.length > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#324158]/50 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> {t('backButton')}
        </button>
      )}

      <h2 className="text-xl font-[Gravesend] text-[#324158] mb-6">
        {t(`steps.${currentStep.questionKey}.question`)}
      </h2>

      <div className="flex flex-col gap-3">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => selectOption(option)}
            className="flex items-center justify-between gap-3 text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
          >
            <span className="text-[#324158] font-medium">
              {t(`steps.${currentStep.questionKey}.options.${option.labelKey}`)}
            </span>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
