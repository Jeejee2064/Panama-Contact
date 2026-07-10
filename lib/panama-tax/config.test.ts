import { describe, it, expect } from 'vitest';
import { computeISR } from './config';

describe('computeISR', () => {
  it('is 0 at the top of the first bracket', () => {
    expect(computeISR(10999)).toBe(0);
    expect(computeISR(11000)).toBe(0);
  });

  it('taxes 15% of the excess just above 11,000', () => {
    expect(computeISR(11001)).toBeCloseTo(0.15, 5);
  });

  it('is exactly 5,850 at the top of the second bracket', () => {
    expect(computeISR(50000)).toBeCloseTo(5850, 5);
  });

  it('taxes 25% of the excess just above 50,000', () => {
    expect(computeISR(50001)).toBeCloseTo(5850.25, 5);
  });

  it('computes the third bracket correctly further out', () => {
    expect(computeISR(60000)).toBeCloseTo(5850 + 10000 * 0.25, 5);
  });
});
