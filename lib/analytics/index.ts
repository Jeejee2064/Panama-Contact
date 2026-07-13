// Centralized analytics API — components import only from here, never call
// posthog.capture() directly. Keeps event names/shapes in one place and
// keeps sensitive raw values (income amount, email, phone) out of PostHog
// entirely: numeric income is always bucketed before it leaves this file.
import { initPostHog, registerTool, capture, identifyLead } from './posthog';

export { identifyLead };

export function initAnalytics(tool: 'quiz' | 'calculator'): void {
  initPostHog();
  registerTool(tool);
}

export type IncomeBracket = 'under_11k' | '11k_50k' | '50k_150k' | 'over_150k';

export function bucketIncome(grossIncome: number): IncomeBracket {
  if (grossIncome < 11000) return 'under_11k';
  if (grossIncome < 50000) return '11k_50k';
  if (grossIncome < 150000) return '50k_150k';
  return 'over_150k';
}

// ---------- Calculator ----------

export function trackCalculatorView(): void {
  capture('calculator_view');
}

export function trackCalculateClick(grossIncome: number): void {
  capture('calculate_click', { income_bracket: bucketIncome(grossIncome) });
}

export function trackResultView(grossIncome: number, effectiveRate: number): void {
  capture('result_view', { income_bracket: bucketIncome(grossIncome), effective_rate: effectiveRate });
}

export function trackTerritorialityBlockView(): void {
  capture('territoriality_block_view');
}

export function trackCalendlyClick(position: 'primary' | 'territoriality_block'): void {
  capture('calendly_click', { position });
}

export function trackPdfFormOpen(): void {
  capture('pdf_form_open');
}

export function trackPdfFormSubmit(phoneProvided: boolean): void {
  capture('pdf_form_submit', { phone_provided: phoneProvided });
}

// ---------- Quiz ----------

export function trackQuizStart(): void {
  capture('quiz_start');
}

export function trackQuizStepView(step: number, questionId: string): void {
  capture('quiz_step_view', { step, question_id: questionId });
}

export function trackQuizStepComplete(
  step: number,
  questionId: string,
  timeOnStepMs: number,
  answerValue: string
): void {
  capture('quiz_step_complete', {
    step,
    question_id: questionId,
    time_on_step_ms: timeOnStepMs,
    answer_value: answerValue,
  });
}

export function trackQuizBackClick(fromStep: string): void {
  capture('quiz_back_click', { from_step: fromStep });
}

export function trackQuizAbandon(lastStep: number, lastQuestionId: string): void {
  capture('quiz_abandon', { last_step: lastStep, last_question_id: lastQuestionId });
}

export function trackQuizComplete(totalTimeMs: number, stepsCount: number): void {
  capture('quiz_complete', { total_time_ms: totalTimeMs, steps_count: stepsCount });
}

export function trackQuizResultView(resultBucket: string): void {
  capture('quiz_result_view', { result_bucket: resultBucket });
}

export function trackQuizCalendlyClick(): void {
  capture('quiz_calendly_click');
}

export function trackQuizLeadSubmit(phoneProvided: boolean): void {
  capture('quiz_lead_submit', { phone_provided: phoneProvided });
}
