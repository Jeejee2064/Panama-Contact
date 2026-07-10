export interface DeductionInputs {
  mortgageInterest?: number;
  retirement?: number;
  educational?: number;
  donations?: number;
  medical?: number;
  studentLoanInterest?: number;
  healthInsurance?: number;
  membershipFees?: number;
}

export interface TaxCalculatorInput {
  grossIncome: number;
  includeDeductions: boolean;
  marriedFilingJointly: boolean;
  deductions?: DeductionInputs;
}

export interface DeductionBreakdown {
  mortgageInterest: number;
  retirement: number;
  educational: number;
  donations: number;
  medical: number;
  studentLoanInterest: number;
  healthInsurance: number;
  membershipFees: number;
  marriedAllowance: number;
  total: number;
}

export interface TaxCalculatorResult {
  grossIncome: number;
  deductions: DeductionBreakdown;
  taxableIncome: number;
  tax: number;
  effectiveRate: number;
  netAnnual: number;
  netMonthly: number;
  comparison: {
    taxWithoutDeductions: number;
    taxWithDeductions: number;
    savings: number;
  };
}
