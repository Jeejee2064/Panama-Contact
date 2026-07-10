import { computeISR, DEDUCTION_CAPS } from './config';
import type { TaxCalculatorInput, TaxCalculatorResult, DeductionBreakdown } from './types';

function positive(value: number | undefined): number {
  return Math.max(0, value || 0);
}

const EMPTY_DEDUCTIONS: DeductionBreakdown = {
  mortgageInterest: 0,
  retirement: 0,
  educational: 0,
  donations: 0,
  medical: 0,
  studentLoanInterest: 0,
  healthInsurance: 0,
  membershipFees: 0,
  marriedAllowance: 0,
  total: 0,
};

export function computeDeductions(input: TaxCalculatorInput): DeductionBreakdown {
  const gross = positive(input.grossIncome);
  const d = input.deductions ?? {};

  const mortgageInterest = Math.min(positive(d.mortgageInterest), DEDUCTION_CAPS.mortgageInterestCap);
  const retirement = Math.min(
    positive(d.retirement),
    gross * DEDUCTION_CAPS.retirementCapPctOfGross,
    DEDUCTION_CAPS.retirementCapAbsolute
  );
  const educational = Math.min(positive(d.educational), DEDUCTION_CAPS.educationalExpensesCap);
  const donations = Math.min(positive(d.donations), DEDUCTION_CAPS.donationsCap);
  const medical = positive(d.medical);
  const studentLoanInterest = positive(d.studentLoanInterest);
  const healthInsurance = positive(d.healthInsurance);
  const membershipFees = positive(d.membershipFees);
  const marriedAllowance = input.marriedFilingJointly ? DEDUCTION_CAPS.marriedJointAllowance : 0;

  const total =
    mortgageInterest +
    retirement +
    educational +
    donations +
    medical +
    studentLoanInterest +
    healthInsurance +
    membershipFees +
    marriedAllowance;

  return {
    mortgageInterest,
    retirement,
    educational,
    donations,
    medical,
    studentLoanInterest,
    healthInsurance,
    membershipFees,
    marriedAllowance,
    total,
  };
}

export function calculateTax(input: TaxCalculatorInput): TaxCalculatorResult {
  const gross = positive(input.grossIncome);
  const deductions = input.includeDeductions ? computeDeductions(input) : EMPTY_DEDUCTIONS;

  const taxableIncome = Math.max(0, gross - deductions.total);
  const tax = computeISR(taxableIncome);
  const effectiveRate = gross > 0 ? tax / gross : 0;
  const netAnnual = gross - tax;
  const netMonthly = netAnnual / 12;

  const taxWithoutDeductions = computeISR(gross);
  const taxWithDeductions = tax;
  const savings = taxWithoutDeductions - taxWithDeductions;

  return {
    grossIncome: gross,
    deductions,
    taxableIncome,
    tax,
    effectiveRate,
    netAnnual,
    netMonthly,
    comparison: { taxWithoutDeductions, taxWithDeductions, savings },
  };
}
