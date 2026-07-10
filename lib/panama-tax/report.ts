import type { TaxCalculatorResult } from './types';

function currency(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export interface TaxReportPayload {
  resultHeadline: string;
  resultBody: string;
  summaryItems: { label: string; value: string }[];
  calculatorResult: TaxCalculatorResult;
  recommendations: string[];
}

// Builds the generic PDF/email report envelope from a calculator result — shared
// by the standalone income tax calculator (Page B) and the quiz's Block 5 embed (Page A).
export function buildIncomeTaxReportPayload(result: TaxCalculatorResult): TaxReportPayload {
  return {
    resultHeadline: `Estimated Panama Income Tax: ${currency(result.tax)}`,
    resultBody: `Based on a gross income of ${currency(result.grossIncome)}, your effective tax rate is ${(
      result.effectiveRate * 100
    ).toFixed(1)}%.`,
    summaryItems: [
      { label: 'Gross income', value: currency(result.grossIncome) },
      { label: 'Taxable income', value: currency(result.taxableIncome) },
      { label: 'Total deductions applied', value: currency(result.deductions.total) },
    ],
    calculatorResult: result,
    recommendations: [
      'Review your eligible deductions with a licensed CPA to maximize savings.',
      'If you have Panama-sourced business income, consider Panama company formation to optimize your tax structure.',
      'Book a free consultation to get a personalized tax compliance plan.',
    ],
  };
}
