import { STEPS } from './config';
import type { QuizAnswer, Bucket } from './types';
import { BUCKETS } from './types';

export const MULTIPLE_INCOME_WARNING =
  'Your situation involves multiple income streams. A personalized tax review is recommended.';

export interface BucketResolution {
  bucket: Bucket;
  score: number;
  flags: string[];
  warnings: string[];
}

function findOption(stepId: string, value: string) {
  const step = STEPS.find((s) => s.id === stepId);
  return step?.options.find((o) => o.value === value);
}

export function collectFlags(answers: QuizAnswer[]): string[] {
  const flags = new Set<string>();
  for (const answer of answers) {
    findOption(answer.stepId, answer.value)?.flags?.forEach((f) => flags.add(f));
  }
  return [...flags];
}

export function computeScore(answers: QuizAnswer[]): number {
  let total = 0;
  for (const answer of answers) {
    total += findOption(answer.stepId, answer.value)?.score ?? 0;
  }
  return total;
}

function bucketFromScore(score: number): Bucket {
  if (score <= 20) return 'LOW';
  if (score <= 50) return 'LIMITED';
  if (score <= 90) return 'POTENTIAL';
  return 'COMPLEX';
}

function atLeast(bucket: Bucket, min: Bucket): Bucket {
  return BUCKETS.indexOf(bucket) < BUCKETS.indexOf(min) ? min : bucket;
}

/**
 * Resolves the final bucket from a raw score + collected flags.
 * Absolute override rules are applied *after* the score-derived bucket,
 * in an order chosen so a "you might owe more" signal always wins over a
 * "you're exempt" signal if (invalidly) both were to fire at once:
 *   1. 100% foreign-source + no Panama company + no Panama rental → force LOW
 *   2. operating-company AND panama-company-income → raise to at least POTENTIAL
 * The multiple-income warning is appended regardless of the resolved bucket.
 */
export function resolveBucket(score: number, flags: string[]): BucketResolution {
  let bucket = bucketFromScore(score);

  const forcedLow =
    flags.includes('foreign-only') &&
    !flags.includes('operating-company') &&
    !flags.includes('panama-rental-income');
  if (forcedLow) bucket = 'LOW';

  const forcedMinPotential = flags.includes('operating-company') && flags.includes('panama-company-income');
  if (forcedMinPotential) bucket = atLeast(bucket, 'POTENTIAL');

  const warnings: string[] = [];
  if (flags.includes('multiple-income')) warnings.push(MULTIPLE_INCOME_WARNING);

  return { bucket, score, flags, warnings };
}

export function resolveQuiz(answers: QuizAnswer[]): BucketResolution {
  const flags = collectFlags(answers);
  const score = computeScore(answers);
  return resolveBucket(score, flags);
}
