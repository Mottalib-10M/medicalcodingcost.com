import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import { compareTwo, examFee, expectedAttempts, voucherChoice, renewal, totalCost, ahimaMembership, practiceGap, secondMonday, inBlackout, aapcTimeline, apprentice, rescheduleFee, passRate, IPEDS, ipedsTotal, IPEDS_SORTED, isoOf, pace } from '../src/lib/engine/coding';
import { getSpec, SPEC_IDS } from '../src/lib/mini-specs';

describe('fees', () => {
  it('reads AAPC and AHIMA prices from params', () => {
    expect(examFee('cpc', { member: true })).toBe(425);
    expect(examFee('cpc', { member: true, twoAttempt: true })).toBe(499);
    expect(examFee('cpc', { member: true, student: true })).toBe(400);
    expect(examFee('ccs', { member: true })).toBe(299);
    expect(examFee('ccs', { member: false })).toBe(399);
    expect(examFee('cca', { member: false })).toBe(299);
  });
  it('turns a pass rate into expected sittings', () => {
    expect(expectedAttempts(0.5)).toBe(2);
    expect(expectedAttempts(0)).toBe(100);
    expect(passRate('ccs')!.rate).toBe(0.84);
    expect(passRate('cpc')).toBeNull();
  });
  it('voucher break-even matches the prices', () => {
    const v = voucherChoice(0.7);
    expect(v.breakEven).toBeCloseTo(1 - 74 / 425, 6);
    expect(v.better).toBe('two');
    expect(voucherChoice(0.95).better).toBe('one');
  });
});

describe('totals and renewal', () => {
  it('CPC over two years = voucher + two years of dues', () => {
    expect(totalCost({ id: 'cpc', member: true, prep: 0, books: 0, years: 2 }).total).toBe(425 + 229 + 229);
  });
  it('CCS non-member over two years: one sitting by default, expected sittings only when asked', () => {
    expect(totalCost({ id: 'ccs', member: false, prep: 0, books: 0, years: 2 }).total).toBe(399 + 218);
    const t = totalCost({ id: 'ccs', member: false, sittings: expectedAttempts(0.84), prep: 0, books: 0, years: 2 });
    expect(t.total).toBeCloseTo(399 / 0.84 + 218, 6);
  });
  it('AHIMA renewal: fee per full cycle, extras added', () => {
    expect(renewal('ccs', { member: false, years: 4 }).total).toBe(436);
    expect(renewal('ccs', { member: true, years: 2, extraCreds: 1 }).total).toBe(2 * 149 + 120);
    expect(renewal('cpc', { member: true, years: 3 }).ceus).toBe(36);
  });
  it('membership comparison is consistent', () => {
    const r = ahimaMembership('ccs', 2);
    expect(r.diff).toBeCloseTo(r.nonMember - r.member, 6);
  });
  it('practice gap and pace', () => {
    expect(practiceGap(70, 100).pass).toBe(true);
    expect(practiceGap(62, 100).gap).toBe(8);
    expect(pace("cpc").per).toBeCloseTo(2.4, 6);
  });
});

describe('dates and rules', () => {
  it('second Monday of January', () => {
    expect(isoOf(secondMonday(2027))).toBe('2027-01-11');
    expect(isoOf(secondMonday(2026))).toBe('2026-01-12');
  });
  it('AAPC blackout from December 30 to the second Monday', () => {
    expect(inBlackout(new Date(Date.UTC(2026, 11, 30)))).toBe(true);
    expect(inBlackout(new Date(Date.UTC(2027, 0, 8)))).toBe(true);
    expect(inBlackout(new Date(Date.UTC(2027, 0, 11, 12)))).toBe(false);
    expect(inBlackout(new Date(Date.UTC(2026, 11, 29)))).toBe(false);
  });
  it('an exam that falls in the blackout moves to January', () => {
    const t = aapcTimeline(2026, 7, 6, true);
    expect(t.exam).toBe('2027-01-11');
    expect(t.shifted).toBe(true);
  });
  it('apprentice removal with and without the course', () => {
    expect(apprentice(6, true)).toEqual({ need: 12, left: 6 });
    expect(apprentice(30, false).left).toBe(0);
  });
  it('rescheduling fees', () => {
    expect(rescheduleFee(1, 12).fee).toBe(0);
    expect(rescheduleFee(1, 5).fee).toBe(25);
    expect(rescheduleFee(1, 1).allowed).toBe(false);
    expect(rescheduleFee(2, 3).fee).toBe(0);
    expect(rescheduleFee(2, 1).allowed).toBe(false);
    expect(rescheduleFee(3, 20).fee).toBe(0);
    expect(rescheduleFee(3, 7).fee).toBe(30);
  });
});

describe('IPEDS and calculators', () => {
  it('state rows add up to the national total', () => {
    const sum = P.ipeds.rows.reduce((s, r) => s + ipedsTotal(r), 0);
    expect(sum).toBeLessThanOrEqual(IPEDS.total);
    expect(IPEDS_SORTED.length).toBe(P.ipeds.rows.length);
  });
  it('every calculator runs on its defaults', () => {
    for (const id of SPEC_IDS) {
      const s = getSpec(id);
      const v: Record<string, number> = {};
      for (const i of s.inputs) v[i.id] = i.def;
      const r = s.run(v, new Set());
      expect(r.head[1], id).toBeTruthy();
      expect(JSON.stringify(r), id).not.toMatch(/NaN|undefined/);
    }
  });
});

// Naive testers, 2026-11-14: the home comparator counted the CPC with one sitting and the CCS with the retakes its pass
// rate implies, so "Cheaper of the two: CCS" was not a like-for-like verdict. Both sides now share the same sittings.
describe('comparisons count both credentials the same way', () => {
  it('one sitting each, then one retake each', () => {
    const one = compareTwo('cpc', 'ccs', { years: 2, sittings: 1, ahimaMember: false });
    expect(one.a.total).toBe(425 + 229 + 229);
    expect(one.b.total).toBe(399 + 218);
    expect(one.a.sittings).toBe(one.b.sittings);
    const two = compareTwo('cpc', 'ccs', { years: 2, sittings: 2, ahimaMember: false });
    expect(two.a.total).toBe(499 + 229 + 229);
    expect(two.b.total).toBe(2 * 399 + 218);
    expect(two.a.sittings).toBe(2);
    expect(two.b.sittings).toBe(2);
    expect(two.cheaper).toBe('cpc');
    expect(two.diff).toBe(2 * 399 + 218 - (499 + 458));
  });
  it('no AHIMA exam gets fractional retakes in a comparison, whatever the pair', () => {
    for (const a of ['cpc', 'cca', 'ccs', 'ccsp'] as const) for (const b of ['cpc', 'cca', 'ccs', 'ccsp'] as const) for (const n of [1, 2]) {
      const r = compareTwo(a, b, { years: 3, sittings: n, ahimaMember: false });
      expect(r.a.sittings, `${a}/${b}/${n}`).toBe(n);
      expect(r.b.sittings, `${a}/${b}/${n}`).toBe(n);
    }
  });
  it('home and CCS-P calculators show each total first, then the difference, then the shared assumption', () => {
    for (const [kind, v] of [['compare', { a: 0, b: 6, y: 2, n: 1, m: 0 }], ['ccsp-cpc', { y: 4, n: 1, m: 0 }]] as const) {
      const out = getSpec(kind).run({ ...v });
      expect(out.head[1], kind).toMatch(/^\$[\d,]+ · \$[\d,]+$/);
      expect(out.rows[2][0], kind).toMatch(/^Difference/);
      expect(out.rows[3], kind).toEqual(['Counted the same way for both', '1 sitting each, no course, no books']);
    }
    const home = getSpec('compare').run({ a: 0, b: 6, y: 2, n: 1, m: 0 });
    expect(home.head[1]).toBe('$883 · $617');
    expect(home.rows[2]).toEqual(['Difference: the CCS costs less by', '$266']);
  });
});
