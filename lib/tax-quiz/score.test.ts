import { describe, it, expect } from 'vitest';
import { resolveBucket, MULTIPLE_INCOME_WARNING } from './score';

describe('resolveBucket — score boundaries', () => {
  it('resolves LOW at the top of its range and LIMITED just above', () => {
    expect(resolveBucket(20, []).bucket).toBe('LOW');
    expect(resolveBucket(21, []).bucket).toBe('LIMITED');
  });

  it('resolves LIMITED at the top of its range and POTENTIAL just above', () => {
    expect(resolveBucket(50, []).bucket).toBe('LIMITED');
    expect(resolveBucket(51, []).bucket).toBe('POTENTIAL');
  });

  it('resolves POTENTIAL at the top of its range and COMPLEX just above', () => {
    expect(resolveBucket(90, []).bucket).toBe('POTENTIAL');
    expect(resolveBucket(91, []).bucket).toBe('COMPLEX');
  });
});

describe('resolveBucket — absolute override rules', () => {
  it('forces LOW when 100% foreign-source with no Panama company and no Panama rental, regardless of score', () => {
    const result = resolveBucket(80, ['foreign-only']);
    expect(result.bucket).toBe('LOW');
  });

  it('does not force LOW if foreign-only but an operating company is also present', () => {
    const result = resolveBucket(80, ['foreign-only', 'operating-company']);
    expect(result.bucket).not.toBe('LOW');
  });

  it('does not force LOW if foreign-only but Panama rental income is also present', () => {
    const result = resolveBucket(80, ['foreign-only', 'panama-rental-income']);
    expect(result.bucket).not.toBe('LOW');
  });

  it('forces a minimum of POTENTIAL when operating-company and panama-company-income are both present', () => {
    // Score alone would resolve to LOW (5), but the override must raise it.
    const result = resolveBucket(5, ['operating-company', 'panama-company-income']);
    expect(result.bucket).toBe('POTENTIAL');
  });

  it('does not downgrade an already-higher bucket when the operating-company override applies', () => {
    // Score alone resolves to COMPLEX (95) — the "at least POTENTIAL" override must not downgrade it.
    const result = resolveBucket(95, ['operating-company', 'panama-company-income']);
    expect(result.bucket).toBe('COMPLEX');
  });

  it('does not trigger the operating-company override with only one of the two required flags', () => {
    const withOnlyOperating = resolveBucket(5, ['operating-company']);
    const withOnlyCompanyIncome = resolveBucket(5, ['panama-company-income']);
    expect(withOnlyOperating.bucket).toBe('LOW');
    expect(withOnlyCompanyIncome.bucket).toBe('LOW');
  });
});

describe('resolveBucket — multiple-income warning', () => {
  it('appends the verbatim warning when the multiple-income flag is present', () => {
    const result = resolveBucket(10, ['multiple-income']);
    expect(result.warnings).toContain(MULTIPLE_INCOME_WARNING);
  });

  it('appends the warning regardless of which bucket it resolves to', () => {
    const low = resolveBucket(5, ['multiple-income']);
    const complex = resolveBucket(95, ['multiple-income']);
    expect(low.warnings).toContain(MULTIPLE_INCOME_WARNING);
    expect(complex.warnings).toContain(MULTIPLE_INCOME_WARNING);
  });

  it('omits the warning when the flag is absent', () => {
    const result = resolveBucket(10, []);
    expect(result.warnings).toHaveLength(0);
  });
});
