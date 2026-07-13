import { getTranslations } from 'next-intl/server';
import { calculateTax } from './panama-tax/calculate';
import { LAST_VERIFIED } from './panama-tax/config';
import { computeBracketBreakdown, type BracketRow } from './panama-tax/brackets';
import { buildIncomeTaxReportPayload, type TaxReportPayload } from './panama-tax/report';
import { resolveQuiz } from './tax-quiz/score';
import { buildQuizReportPayload, type QuizReportPayload } from './tax-quiz/report';

export interface RecomputedLeadReport {
  reportPayload: TaxReportPayload | QuizReportPayload;
  bracketBreakdown: BracketRow[] | null;
  resultBucket: string | null;
  sourcePage: 'A' | 'B';
  locale: string;
  disclaimer: string;
}

// Server-only: rebuilds the full report (and, for Page B, the bracket
// breakdown) from raw calc_inputs — used by the lead-capture route, the
// admin PDF regeneration route, and the admin lead detail page, so numbers
// are always recomputed from the same source of truth rather than trusted
// from whatever was originally submitted.
export async function recomputeLeadReport(calcInputs: any): Promise<RecomputedLeadReport> {
  const sourcePage: 'A' | 'B' = calcInputs?.sourcePage === 'B' ? 'B' : 'A';
  const locale = calcInputs?.locale || 'en';

  if (sourcePage === 'B') {
    const result = calculateTax(calcInputs);
    const t = await getTranslations({ locale, namespace: 'IncomeTaxCalculatorPage' });
    return {
      reportPayload: buildIncomeTaxReportPayload(result),
      bracketBreakdown: computeBracketBreakdown(result.taxableIncome),
      resultBucket: null,
      sourcePage,
      locale,
      disclaimer: t('disclaimer', { date: LAST_VERIFIED }),
    };
  }

  const answers = calcInputs?.answers ?? [];
  const resolution = resolveQuiz(answers);
  const t = await getTranslations({ locale, namespace: 'TaxExposureQuizPage' });
  return {
    reportPayload: buildQuizReportPayload(resolution, answers, t),
    bracketBreakdown: null,
    resultBucket: resolution.bucket,
    sourcePage,
    locale,
    disclaimer: t('disclaimer', { date: LAST_VERIFIED }),
  };
}
