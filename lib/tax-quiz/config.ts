import type { QuizStep, ResultTierContent, Bucket } from './types';

// NOTE: the exact question/option copy and step count (client spec references
// "Steps 1→10") were not available when this was built — this is a
// functionally complete, non-linear 5-step scaffold demonstrating branching
// (residency → multiple-income skips the 3 qualification steps entirely,
// satisfying the "step 1 can jump to step 5" requirement) and every flag the
// scoring engine needs. Swap/extend STEPS with the client's real steps without
// touching lib/tax-quiz/score.ts or the UI — the engine is fully data-driven.
export const STEPS: QuizStep[] = [
  {
    id: 'residency',
    questionKey: 'residency',
    options: [
      { value: 'resident', labelKey: 'resident', score: 5, next: 'income-source' },
      {
        value: 'not-yet-no-panama-income',
        labelKey: 'notYetNoPanamaIncome',
        flags: ['foreign-only'],
        score: 0,
        // Skips straight past income-source/panama-company/rental — a real
        // non-linear jump, not just a straight line through every step.
        next: 'multiple-income',
      },
    ],
  },
  {
    id: 'income-source',
    questionKey: 'incomeSource',
    options: [
      { value: 'only-foreign', labelKey: 'onlyForeign', flags: ['foreign-only'], score: 0, next: 'panama-company' },
      { value: 'mostly-foreign', labelKey: 'mostlyForeign', flags: ['mixed-income'], score: 20, next: 'panama-company' },
      { value: 'mostly-panama', labelKey: 'mostlyPanama', flags: ['panama-income'], score: 40, next: 'panama-company' },
      { value: 'only-panama', labelKey: 'onlyPanama', flags: ['panama-income'], score: 50, next: 'panama-company' },
    ],
  },
  {
    id: 'panama-company',
    questionKey: 'panamaCompany',
    options: [
      { value: 'none', labelKey: 'none', score: 0, next: 'rental' },
      {
        value: 'panama-source-income',
        labelKey: 'panamaSourceIncome',
        flags: ['operating-company', 'panama-company-income'],
        score: 30,
        next: 'rental',
      },
      {
        value: 'foreign-source-income',
        labelKey: 'foreignSourceIncome',
        flags: ['operating-company'],
        score: 15,
        next: 'rental',
      },
    ],
  },
  {
    id: 'rental',
    questionKey: 'rental',
    options: [
      { value: 'no', labelKey: 'no', score: 0, next: 'multiple-income' },
      { value: 'yes', labelKey: 'yes', flags: ['panama-rental-income'], score: 15, next: 'multiple-income' },
    ],
  },
  {
    id: 'multiple-income',
    questionKey: 'multipleIncome',
    options: [
      { value: 'one', labelKey: 'one', score: 0, next: null },
      { value: 'two', labelKey: 'two', score: 10, next: null },
      { value: 'three-or-more', labelKey: 'threeOrMore', flags: ['multiple-income'], score: 20, next: null },
    ],
  },
];

export const FIRST_STEP_ID = STEPS[0].id;

export const BUCKET_THRESHOLDS: Record<Bucket, [number, number]> = {
  LOW: [0, 20],
  LIMITED: [21, 50],
  POTENTIAL: [51, 90],
  COMPLEX: [91, Infinity],
};

// TODO: awaiting client content doc for the 4 result tiers — shape only.
export const RESULT_TIERS: Record<Bucket, ResultTierContent> = {
  LOW: { titleKey: 'low.title', checklistKey: 'low.checklist', recommendedServicesKey: 'low.services', ctaKey: 'low.cta' },
  LIMITED: { titleKey: 'limited.title', checklistKey: 'limited.checklist', recommendedServicesKey: 'limited.services', ctaKey: 'limited.cta' },
  POTENTIAL: { titleKey: 'potential.title', checklistKey: 'potential.checklist', recommendedServicesKey: 'potential.services', ctaKey: 'potential.cta' },
  COMPLEX: { titleKey: 'complex.title', checklistKey: 'complex.checklist', recommendedServicesKey: 'complex.services', ctaKey: 'complex.cta' },
};

// Block 5 reveal condition: Panama-sourced income signals.
export function hasIncomeCalcTrigger(flags: string[]): boolean {
  return (
    flags.includes('panama-income') ||
    flags.includes('panama-rental-income') ||
    flags.includes('panama-company-income')
  );
}
