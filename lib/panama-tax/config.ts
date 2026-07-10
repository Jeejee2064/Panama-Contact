// Panama personal income tax (ISR) — source of truth for rates and deduction caps.
// Update this file when Panama's DGI publishes new brackets/caps; nothing else
// in the codebase should hardcode these numbers.

export const LAST_VERIFIED = '2026-07-10';

/**
 * ISR brackets — Panamanian-source income only.
 *   0 – 11,000            : 0%
 *   11,000.01 – 50,000     : 15% of the excess over 11,000
 *   > 50,000               : 5,850 + 25% of the excess over 50,000
 */
export function computeISR(taxable: number): number {
  if (taxable <= 11000) return 0;
  if (taxable <= 50000) return (taxable - 11000) * 0.15;
  return 5850 + (taxable - 50000) * 0.25;
}

export const DEDUCTION_CAPS = {
  marriedJointAllowance: 800,
  mortgageInterestCap: 15000, // primary residence in Panama only
  retirementCapAbsolute: 15000,
  retirementCapPctOfGross: 0.1, // retirement deduction = min(entered, 10% of gross, 15000)
  educationalExpensesCap: 3600, // per student; form doesn't ask for student count — TODO CONFIRM WITH CPA
  donationsCap: 50000,
  // No explicit cap (must be documented + incurred in Panama) — TODO CONFIRM WITH CPA
  uncappedCategories: ['medical', 'studentLoanInterest', 'healthInsurance', 'membershipFees'] as const,
};
