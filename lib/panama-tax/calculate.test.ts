import { describe, it, expect } from 'vitest';
import { computeDeductions, calculateTax } from './calculate';
import { computeISR, DEDUCTION_CAPS } from './config';

describe('computeDeductions', () => {
  it('caps retirement at 10% of gross when that is the binding constraint', () => {
    // 10% of 60,000 = 6,000, well under the 15,000 absolute cap.
    const d = computeDeductions({
      grossIncome: 60000,
      includeDeductions: true,
      marriedFilingJointly: false,
      deductions: { retirement: 20000 },
    });
    expect(d.retirement).toBe(6000);
  });

  it('caps retirement at the 15,000 absolute cap when 10% of gross is larger', () => {
    // 10% of 300,000 = 30,000, so the flat 15,000 cap binds instead.
    const d = computeDeductions({
      grossIncome: 300000,
      includeDeductions: true,
      marriedFilingJointly: false,
      deductions: { retirement: 20000 },
    });
    expect(d.retirement).toBe(15000);
  });

  it('caps mortgage interest at 15,000', () => {
    const d = computeDeductions({
      grossIncome: 100000,
      includeDeductions: true,
      marriedFilingJointly: false,
      deductions: { mortgageInterest: 25000 },
    });
    expect(d.mortgageInterest).toBe(DEDUCTION_CAPS.mortgageInterestCap);
  });

  it('caps donations at 50,000', () => {
    const d = computeDeductions({
      grossIncome: 200000,
      includeDeductions: true,
      marriedFilingJointly: false,
      deductions: { donations: 75000 },
    });
    expect(d.donations).toBe(DEDUCTION_CAPS.donationsCap);
  });

  it('adds the married filing jointly allowance only when checked', () => {
    const married = computeDeductions({
      grossIncome: 50000,
      includeDeductions: true,
      marriedFilingJointly: true,
    });
    const single = computeDeductions({
      grossIncome: 50000,
      includeDeductions: true,
      marriedFilingJointly: false,
    });
    expect(married.marriedAllowance).toBe(DEDUCTION_CAPS.marriedJointAllowance);
    expect(single.marriedAllowance).toBe(0);
  });

  it('leaves medical/studentLoanInterest/healthInsurance/membershipFees uncapped', () => {
    const d = computeDeductions({
      grossIncome: 50000,
      includeDeductions: true,
      marriedFilingJointly: false,
      deductions: {
        medical: 12000,
        studentLoanInterest: 8000,
        healthInsurance: 6000,
        membershipFees: 4000,
      },
    });
    expect(d.medical).toBe(12000);
    expect(d.studentLoanInterest).toBe(8000);
    expect(d.healthInsurance).toBe(6000);
    expect(d.membershipFees).toBe(4000);
  });
});

describe('calculateTax', () => {
  it('computes the savings comparison correctly', () => {
    const result = calculateTax({
      grossIncome: 60000,
      includeDeductions: true,
      marriedFilingJointly: true,
      deductions: { mortgageInterest: 15000, retirement: 5000 },
    });

    expect(result.comparison.taxWithoutDeductions).toBeCloseTo(computeISR(60000), 5);
    expect(result.comparison.taxWithDeductions).toBeCloseTo(result.tax, 5);
    expect(result.comparison.savings).toBeCloseTo(
      result.comparison.taxWithoutDeductions - result.comparison.taxWithDeductions,
      5
    );
    expect(result.comparison.savings).toBeGreaterThan(0);
  });

  it('ignores deductions entirely when includeDeductions is false', () => {
    const result = calculateTax({
      grossIncome: 60000,
      includeDeductions: false,
      marriedFilingJointly: true,
      deductions: { mortgageInterest: 15000 },
    });
    expect(result.deductions.total).toBe(0);
    expect(result.taxableIncome).toBe(60000);
    expect(result.tax).toBeCloseTo(computeISR(60000), 5);
  });

  it('computes net annual/monthly and effective rate on gross', () => {
    const result = calculateTax({
      grossIncome: 60000,
      includeDeductions: false,
      marriedFilingJointly: false,
    });
    expect(result.netAnnual).toBeCloseTo(60000 - result.tax, 5);
    expect(result.netMonthly).toBeCloseTo(result.netAnnual / 12, 5);
    expect(result.effectiveRate).toBeCloseTo(result.tax / 60000, 5);
  });

  it('never produces a negative taxable income', () => {
    const result = calculateTax({
      grossIncome: 5000,
      includeDeductions: true,
      marriedFilingJointly: true,
      deductions: { mortgageInterest: 15000, retirement: 5000, donations: 50000 },
    });
    expect(result.taxableIncome).toBe(0);
    expect(result.tax).toBe(0);
  });
});
