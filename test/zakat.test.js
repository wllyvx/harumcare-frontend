import { describe, it, expect } from 'vitest';
import { calcIncomeZakat, calcTradeZakat, calcMetalZakat, nisabValueForGold, nisabValueForSilver } from '../src/utils/zakat.js';

describe('zakat utilities', () => {
  it('calculates income zakat correctly', () => {
    expect(calcIncomeZakat(1000000, 0)).toBeCloseTo(25000);
    expect(calcIncomeZakat(0, 400000)).toBeCloseTo(10000);
  });

  it('calculates trade zakat and floors negative to zero', () => {
    expect(calcTradeZakat(1000000, 200000, 0, 500000, 0)).toBeCloseTo(17500); // net = 700k
    expect(calcTradeZakat(0, 0, 0, 1000, 0)).toBeCloseTo(0);
  });

  it('calculates metal zakat converting grams to idr', () => {
    // 10 gr net, price 1.150.000 -> zakat grams = 0.25 gr -> idr = 0.25 * 1.150.000
    expect(calcMetalZakat(10, 1150000)).toBeCloseTo(287500);
  });

  it('returns correct nisab values', () => {
    expect(nisabValueForGold(1150000)).toBe(85 * 1150000);
    expect(nisabValueForSilver(12000)).toBe(595 * 12000);
  });
});
