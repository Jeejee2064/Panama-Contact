// Bracket-by-bracket breakdown of the ISR calculation — same 3 brackets as
// computeISR() in config.ts, just itemized instead of collapsed into a
// single total. Only includes brackets actually reached.

export interface BracketRow {
  min: number;
  max: number | null; // null = no upper bound (top bracket)
  rate: number;
  taxableInBracket: number;
  taxForBracket: number;
}

export function computeBracketBreakdown(taxable: number): BracketRow[] {
  const rows: BracketRow[] = [];

  const firstBracketAmount = Math.min(taxable, 11000);
  rows.push({ min: 0, max: 11000, rate: 0, taxableInBracket: firstBracketAmount, taxForBracket: 0 });

  if (taxable > 11000) {
    const secondBracketAmount = Math.min(taxable, 50000) - 11000;
    rows.push({
      min: 11000,
      max: 50000,
      rate: 0.15,
      taxableInBracket: secondBracketAmount,
      taxForBracket: secondBracketAmount * 0.15,
    });
  }

  if (taxable > 50000) {
    const thirdBracketAmount = taxable - 50000;
    rows.push({
      min: 50000,
      max: null,
      rate: 0.25,
      taxableInBracket: thirdBracketAmount,
      taxForBracket: thirdBracketAmount * 0.25,
    });
  }

  return rows;
}
