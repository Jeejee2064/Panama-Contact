import { describe, it, expect } from 'vitest';
import { computeBracketBreakdown } from './brackets';
import { computeISR } from './config';

function sumTax(rows: ReturnType<typeof computeBracketBreakdown>): number {
  return rows.reduce((sum, r) => sum + r.taxForBracket, 0);
}

describe('computeBracketBreakdown', () => {
  it('returns a single 0% row for income at/under the first bracket', () => {
    for (const taxable of [10999, 11000]) {
      const rows = computeBracketBreakdown(taxable);
      expect(rows).toHaveLength(1);
      expect(rows[0].rate).toBe(0);
      expect(sumTax(rows)).toBeCloseTo(computeISR(taxable), 5);
    }
  });

  it('returns 2 rows once the second bracket is reached', () => {
    for (const taxable of [11001, 50000]) {
      const rows = computeBracketBreakdown(taxable);
      expect(rows).toHaveLength(2);
      expect(rows[1].rate).toBe(0.15);
      expect(sumTax(rows)).toBeCloseTo(computeISR(taxable), 5);
    }
  });

  it('returns 3 rows once the third bracket is reached', () => {
    for (const taxable of [50001, 60000]) {
      const rows = computeBracketBreakdown(taxable);
      expect(rows).toHaveLength(3);
      expect(rows[2].rate).toBe(0.25);
      expect(rows[2].max).toBeNull();
      expect(sumTax(rows)).toBeCloseTo(computeISR(taxable), 5);
    }
  });

  it('never produces a negative bracket amount for zero/negative-adjacent input', () => {
    const rows = computeBracketBreakdown(0);
    expect(rows).toHaveLength(1);
    expect(rows[0].taxableInBracket).toBe(0);
    expect(sumTax(rows)).toBe(0);
  });
});
