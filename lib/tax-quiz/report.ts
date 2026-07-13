import { STEPS } from './config';
import type { QuizAnswer } from './types';
import type { BucketResolution } from './score';

// Minimal shape both `useTranslations()` (client) and `getTranslations()`
// (server) results satisfy — lets this function run identically in the quiz
// component and in the lead API route's server-side recompute.
interface Translator {
  (key: string): string;
  raw(key: string): unknown;
}

export interface QuizReportPayload {
  resultHeadline: string;
  resultBody: string;
  summaryItems: { label: string; value: string }[];
  calculatorResult: undefined;
  recommendations: string[];
}

export function buildQuizReportPayload(
  resolution: BucketResolution,
  answers: QuizAnswer[],
  t: Translator
): QuizReportPayload {
  const bucketKey = resolution.bucket.toLowerCase();
  const services = (t.raw(`results.${bucketKey}.services`) as string[] | undefined) ?? [];

  const summaryItems = answers.map((a) => {
    const step = STEPS.find((s) => s.id === a.stepId);
    const option = step?.options.find((o) => o.value === a.value);
    return {
      label: step ? t(`steps.${step.questionKey}.question`) : a.stepId,
      value: option && step ? t(`steps.${step.questionKey}.options.${option.labelKey}`) : a.value,
    };
  });

  return {
    resultHeadline: t(`results.${bucketKey}.title`),
    resultBody: resolution.warnings.join(' '),
    summaryItems,
    calculatorResult: undefined,
    recommendations: services,
  };
}
