export interface QuizOption {
  value: string;
  labelKey: string; // resolved via t(`steps.${stepId}.options.${value}`)
  flags?: string[];
  score: number;
  next: string | null; // next step id, or null to resolve the quiz
}

export interface QuizStep {
  id: string;
  questionKey: string; // resolved via t(`steps.${id}.question`)
  options: QuizOption[];
}

export interface QuizAnswer {
  stepId: string;
  value: string;
}

export const BUCKETS = ['LOW', 'LIMITED', 'POTENTIAL', 'COMPLEX'] as const;
export type Bucket = (typeof BUCKETS)[number];

export interface ResultTierContent {
  // TODO: awaiting client content doc for the 4 result tiers (title/checklist/services/CTA).
  titleKey: string;
  checklistKey: string; // messages array key
  recommendedServicesKey: string; // messages array key
  ctaKey: string;
}
