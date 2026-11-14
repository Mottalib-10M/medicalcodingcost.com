/**
 * Engine of Medical Coding Cost: pure functions over params-2026.json (fees, formats, renewal rules and pass rates
 * read on AAPC and AHIMA pages on 2026-11-13). No page and no calculator holds a second formula.
 */
import P from '../../data/params-2026.json';

export type CredId = 'cpc' | 'coc' | 'cic' | 'crc' | 'cpb' | 'cca' | 'ccs' | 'ccsp';
export type Body = 'AAPC' | 'AHIMA';
export interface Cred { id: CredId; code: string; name: string; body: Body; setting: string; minutes: number | null; items: number | null; scored: number | null }

const A = P.aapc;
const H = P.ahima;
const HX = H.exams;

export const CREDS: Cred[] = [
  { id: 'cpc', code: 'CPC', name: 'Certified Professional Coder', body: 'AAPC', setting: 'physician offices and outpatient services', minutes: A.cpc.minutes, items: A.cpc.questions, scored: A.cpc.questions },
  { id: 'coc', code: 'COC', name: 'Certified Outpatient Coder', body: 'AAPC', setting: 'hospital outpatient departments and facilities', minutes: null, items: null, scored: null },
  { id: 'cic', code: 'CIC', name: 'Certified Inpatient Coder', body: 'AAPC', setting: 'hospital inpatient stays', minutes: 240, items: null, scored: null },
  { id: 'crc', code: 'CRC', name: 'Certified Risk Adjustment Coder', body: 'AAPC', setting: 'risk adjustment for health plans', minutes: null, items: null, scored: null },
  { id: 'cpb', code: 'CPB', name: 'Certified Professional Biller', body: 'AAPC', setting: 'billing and claims, not code assignment', minutes: 240, items: null, scored: null },
  { id: 'cca', code: 'CCA', name: 'Certified Coding Associate', body: 'AHIMA', setting: 'early-career coders', minutes: HX.cca.minutes, items: HX.cca.items, scored: HX.cca.scored },
  { id: 'ccs', code: 'CCS', name: 'Certified Coding Specialist', body: 'AHIMA', setting: 'inpatient and outpatient records', minutes: HX.ccs.minutes, items: HX.ccs.items, scored: HX.ccs.scored },
  { id: 'ccsp', code: 'CCS-P', name: 'Certified Coding Specialist, Physician-based', body: 'AHIMA', setting: 'physician practices and clinics', minutes: HX.ccsp.minutes, items: HX.ccsp.items, scored: HX.ccsp.scored },
];
export const credById = (id: CredId) => CREDS.find((c) => c.id === id)!;
export const CRED_IDS = CREDS.map((c) => c.id);
const isAhima = (id: CredId): id is 'cca' | 'ccs' | 'ccsp' => id === 'cca' || id === 'ccs' || id === 'ccsp';

/** Latest first-time pass rate AHIMA publishes for the exam, with its year and the number of first-time testers. */
export function passRate(id: CredId): { year: number; testers: number; rate: number } | null {
  if (!isAhima(id)) return null;
  const r = HX[id].rates[HX[id].rates.length - 1];
  return { year: r[0], testers: r[1], rate: r[2] };
}
/** All published years of an AHIMA exam (RHIT included for the comparison table). */
export function passRates(id: 'cca' | 'ccs' | 'ccsp' | 'rhit') { return HX[id].rates.map(([year, testers, rate]) => ({ year, testers, rate })); }

/** Price of one attempt. AAPC: voucher price; `student` uses AAPC's student pricing. AHIMA: member or non-member fee. */
export function examFee(id: CredId, o: { member: boolean; student?: boolean; twoAttempt?: boolean }): number {
  if (isAhima(id)) return o.member ? HX[id].member : HX[id].nonMember;
  const v = o.student ? A.voucher.student : A.voucher.core;
  return o.twoAttempt ? v.two : v.one;
}

/** Expected number of sittings until a pass, when each sitting passes with probability p (geometric law, capped at 1). */
export const expectedAttempts = (p: number) => 1 / Math.min(1, Math.max(0.01, p));

/**
 * AAPC voucher choice for a candidate who will sit at most twice: a 1-attempt voucher, then a second one only after a
 * fail, against a 2-attempt voucher bought up front. `p` = the candidate's own chance of passing the first sitting.
 */
export function voucherChoice(p: number, student = false) {
  const v = student ? A.voucher.student : A.voucher.core;
  const pp = Math.min(1, Math.max(0, p));
  const expectedSingles = v.one + (1 - pp) * v.one;
  const breakEven = 1 - (v.two - v.one) / v.one;
  return { one: v.one, two: v.two, expectedSingles, breakEven, better: expectedSingles > v.two ? ('two' as const) : ('one' as const), saving: Math.abs(expectedSingles - v.two) };
}

/** Renewal: dues and fees over `years` for one credential. AAPC: membership each year. AHIMA: recertification fee each 2-year cycle, plus dues if member. */
export function renewal(id: CredId, o: { member: boolean; years: number; extraCreds?: number }) {
  const years = Math.max(0, Math.round(o.years));
  const cycles = Math.floor(years / H.recert.cycleYears);
  if (!isAhima(id)) {
    return { dues: years * A.membership.renewal, recert: 0, total: years * A.membership.renewal, ceus: cycles * A.ceu.perCycle, cycles };
  }
  const extra = Math.max(0, Math.round(o.extraCreds ?? 0));
  const perCycle = o.member ? H.recert.member + extra * H.recert.memberExtra : H.recert.nonMember + extra * H.recert.nonMemberExtra;
  const dues = o.member ? years * H.membership.professional : 0;
  return { dues, recert: cycles * perCycle, total: dues + cycles * perCycle, ceus: cycles * H.recert.ceus[id], cycles };
}

export interface TotalIn { id: CredId; member: boolean; student?: boolean; twoAttempt?: boolean; sittings?: number; prep: number; books: number; years: number }
export interface TotalOut { exam: number; joinDues: number; renewal: number; prep: number; books: number; total: number; sittings: number; lines: Array<[string, number]> }

/**
 * Total cost of one credential from the exam to `years` after it. AAPC: membership is required to hold the credential,
 * so the first year of dues is counted (student or individual), then the renewal rate for the following years.
 * AHIMA: membership is optional; a member pays the member exam fee and dues every year.
 * `sittings`: expected number of exam sittings (AHIMA: from the pass rate if not given).
 */
export function totalCost(i: TotalIn): TotalOut {
  const years = Math.max(1, Math.round(i.years));
  const ahima = isAhima(i.id);
  // One sitting unless the caller says otherwise, for AAPC and AHIMA alike: a comparison must count both the same way
  // (naive testers, 2026-11-14: the CPC was counted once and the AHIMA exams with their expected retakes).
  let sittings = i.sittings ?? 1;
  let exam: number;
  if (ahima) exam = examFee(i.id, { member: i.member }) * sittings;
  else {
    sittings = Math.max(1, sittings);
    if (i.twoAttempt) exam = examFee(i.id, { member: true, student: i.student, twoAttempt: true }) + Math.max(0, Math.ceil(sittings) - 2) * examFee(i.id, { member: true, student: i.student });
    else exam = examFee(i.id, { member: true, student: i.student }) * Math.ceil(sittings);
  }
  let joinDues: number; let ren: number;
  if (ahima) { joinDues = 0; ren = renewal(i.id, { member: i.member, years }).total; }
  else { joinDues = i.student ? A.membership.student : A.membership.individual; ren = (years - 1) * A.membership.renewal; }
  const total = exam + joinDues + ren + Math.max(0, i.prep) + Math.max(0, i.books);
  const lines: Array<[string, number]> = [
    [ahima ? (sittings > 1.001 ? (Number.isInteger(sittings) ? (sittings === 2 ? 'Exam fees, exam taken twice' : `Exam fees, exam taken ${sittings} times`) : 'Exam fees, retakes included on average') : 'Exam fee, exam taken once') : (i.twoAttempt ? '2-attempt exam voucher' : 'Exam voucher' + (Math.ceil(sittings) > 1 ? 's' : ', 1 attempt')), exam],
  ];
  if (!ahima) lines.push([i.student ? 'AAPC student membership, first year' : 'AAPC membership, first year', joinDues]);
  if (ren > 0) lines.push([ahima ? (i.member ? 'AHIMA dues and recertification' : 'AHIMA recertification fees') : `AAPC renewals, ${years - 1} more year${years - 1 === 1 ? '' : 's'}`, ren]);
  if (i.prep > 0) lines.push(['Course or review you buy', i.prep]);
  if (i.books > 0) lines.push(['Code books', i.books]);
  return { exam, joinDues, renewal: ren, prep: Math.max(0, i.prep), books: Math.max(0, i.books), total, sittings, lines };
}

/**
 * The one default assumption of the whole site (naive testers, 2026-11-14, 2nd round: the CCS showed $617 on the home
 * page, $693 on the CCS page and $475 on the CCA page because each calculator picked its own years and sittings).
 * Every total of a credential shown by default, on any page, is `standardCost(id)`: 2 years, the exam taken once
 * (AAPC: the 1-attempt voucher), no course, no books, AHIMA exam taken as a non-member.
 */
export const DEFAULTS = { years: 2, sittings: 1, ahimaMember: false } as const;
/** The assumption in words, written next to every total: "2 years, exam taken once, no course". */
export function assumption(years: number = DEFAULTS.years, sittings: number = DEFAULTS.sittings, course = false) {
  const y = Math.max(1, Math.round(years));
  return `${y} year${y === 1 ? '' : 's'}, exam taken ${sittings >= 2 ? 'twice (one retake)' : 'once'}, ${course ? 'course and books included' : 'no course'}`;
}
/**
 * Total of one credential under the site's assumptions. 1 sitting = the exam taken once (AAPC: 1-attempt voucher);
 * 2 sittings = one retake (AAPC: the 2-attempt voucher, AAPC's own price for a retake; AHIMA: a second fee).
 * AAPC membership is required by AAPC, so always counted; AHIMA membership only when `ahimaMember`.
 */
export function standardCost(id: CredId, o: { years?: number; sittings?: number; ahimaMember?: boolean; student?: boolean } = {}) {
  const sittings = Math.max(1, Math.min(2, Math.round(o.sittings ?? DEFAULTS.sittings)));
  const years = o.years ?? DEFAULTS.years;
  const ahimaMember = o.ahimaMember ?? DEFAULTS.ahimaMember;
  return totalCost({ id, member: isAhima(id) ? ahimaMember : true, student: o.student, sittings, twoAttempt: !isAhima(id) && sittings === 2, prep: 0, books: 0, years });
}
/** A total split into its parts, in short words: "voucher $425 + AAPC dues $229 + 1 renewal $229". */
export function parts(t: TotalOut): Array<[string, number]> {
  return t.lines.map(([l, x]) => [
    /voucher/i.test(l) ? (/2-attempt/.test(l) ? '2-attempt voucher' : 'voucher')
      : /membership, first year/.test(l) ? 'AAPC dues, year 1'
        : /AAPC renewals/.test(l) ? `AAPC dues, ${l.replace(/^AAPC renewals, /, '')}`
          : /Exam fee/.test(l) ? (t.sittings > 1 ? 'two exam fees' : 'exam fee')
            : /recertification/.test(l) ? (/dues/.test(l) ? 'AHIMA dues and recertification' : 'recertification fee')
              : l.toLowerCase(),
    x,
  ]);
}

/**
 * Two credentials under the same assumptions: the same years, the same number of sittings (1 = pass the first time,
 * 2 = one retake), no course and no books. A second AAPC sitting is bought as the 2-attempt voucher, AAPC's own price
 * for a retake; a second AHIMA sitting is a second fee. AAPC membership is required by AAPC, so it is always counted;
 * AHIMA membership only when `ahimaMember`.
 */
export function compareTwo(a: CredId, b: CredId, o: { years: number; sittings: number; ahimaMember: boolean }) {
  const sittings = Math.max(1, Math.min(2, Math.round(o.sittings)));
  const ta = standardCost(a, { ...o, sittings }), tb = standardCost(b, { ...o, sittings });
  const diff = Math.abs(ta.total - tb.total);
  const cheaper: CredId | null = ta.total === tb.total ? null : ta.total < tb.total ? a : b;
  return { a: ta, b: tb, diff, cheaper, sittings };
}

/** AHIMA member against non-member over `years`, for one exam taken `sittings` times (once by default, as everywhere). */
export function ahimaMembership(id: 'cca' | 'ccs' | 'ccsp', years: number, sittings: number = DEFAULTS.sittings) {
  const s = sittings;
  const mem = totalCost({ id, member: true, sittings: s, prep: 0, books: 0, years });
  const non = totalCost({ id, member: false, sittings: s, prep: 0, books: 0, years });
  return { member: mem.total, nonMember: non.total, diff: non.total - mem.total, sittings: s };
}

/** AAPC code book bundle: member price against non-member price, set against the dues. */
export function bookSaving() {
  const b = A.books.proFeeBundle;
  return { member: b.member, nonMember: b.nonMember, saving: Math.round((b.nonMember - b.member) * 100) / 100 };
}

/** Minutes per question and the right answers needed (CPC: 70 of 100). AHIMA reports a scaled score (300), not a count. */
export function pace(id: CredId, reserveMin = 0) {
  const c = credById(id);
  const items = c.items ?? A.cpc.questions;
  const minutes = c.minutes ?? A.cpc.minutes;
  const per = Math.max(0, minutes - Math.max(0, reserveMin)) / items;
  const passCorrect = id === 'cpc' ? A.cpc.passCorrect : null;
  return { items, minutes, per, passCorrect, maxWrong: passCorrect != null ? items - passCorrect : null, itemsKnown: c.items != null };
}

/** A practice score set against the CPC line: 70% of 100. */
export function practiceGap(correct: number, outOf: number) {
  const n = Math.max(1, Math.round(outOf));
  const c = Math.min(n, Math.max(0, Math.round(correct)));
  const share = c / n;
  const onCpc = Math.round(share * A.cpc.questions);
  return { share, onCpc, gap: A.cpc.passCorrect - onCpc, pass: share >= A.cpc.passShare };
}

// ---------- dates ----------
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d, 12));
export const isoOf = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(d: Date, n: number) { const x = new Date(d.getTime()); x.setUTCDate(x.getUTCDate() + n); return x; }
export function addMonths(d: Date, n: number) { const x = new Date(d.getTime()); const day = x.getUTCDate(); x.setUTCDate(1); x.setUTCMonth(x.getUTCMonth() + n); const last = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate(); x.setUTCDate(Math.min(day, last)); return x; }
export function addBusinessDays(d: Date, n: number) { let x = new Date(d.getTime()); let k = 0; while (k < n) { x = addDays(x, 1); const w = x.getUTCDay(); if (w !== 0 && w !== 6) k++; } return x; }
/** Second Monday of January of `y`: the day AAPC exams resume after the year-end blackout. */
export function secondMonday(y: number) { const d = utc(y, 1, 1); const first = (8 - d.getUTCDay()) % 7; return addDays(d, first + 7); }
/** True when the date falls in AAPC's blackout, from December 30 to the day before the second Monday of January. */
export function inBlackout(d: Date) {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
  if (m === 12 && day >= A.blackout.startDay) return true;
  if (m === 1) return d.getTime() < secondMonday(y).getTime();
  return false;
}
/**
 * AAPC timeline: training starts on the 1st of `month`/`year`, lasts `studyMonths`; the exam is booked at least three
 * weeks ahead, never in the blackout; results come 7 to 10 business days later.
 */
export function aapcTimeline(year: number, month: number, studyMonths: number, bookedOnDay0 = true) {
  const start = utc(year, month, 1);
  const ready = addMonths(start, Math.max(0, Math.round(studyMonths)));
  let exam = bookedOnDay0 ? ready : addDays(ready, A.registerWeeksBefore * 7);
  let shifted = false;
  if (inBlackout(exam)) { exam = secondMonday(exam.getUTCMonth() === 11 ? exam.getUTCFullYear() + 1 : exam.getUTCFullYear()); shifted = true; }
  const bookBy = addDays(exam, -A.registerWeeksBefore * 7);
  const resFrom = addBusinessDays(exam, A.resultsBusinessDays[0]);
  const resTo = addBusinessDays(exam, A.resultsBusinessDays[1]);
  return { start: isoOf(start), exam: isoOf(exam), bookBy: isoOf(bookBy), resFrom: isoOf(resFrom), resTo: isoOf(resTo), shifted };
}

/** CPC-A: months of coding experience still needed before the apprentice designation can be removed. */
export function apprentice(monthsDone: number, course80h: boolean) {
  const need = (A.apprentice.years - (course80h ? A.apprentice.waivesYears : 0)) * 12;
  const left = Math.max(0, need - Math.max(0, Math.round(monthsDone)));
  return { need, left };
}

/** Fee for moving an exam appointment `daysBefore` days ahead. `mode`: 1 AAPC testing center, 2 AAPC remote, 3 AHIMA (Pearson VUE). */
export function rescheduleFee(mode: number, daysBefore: number): { fee: number | null; allowed: boolean; rule: string } {
  const d = Math.max(0, daysBefore);
  const R = A.reschedule; const PV = H.pearson;
  if (mode === 2) {
    if (d * 24 > R.remoteFreeHours) return { fee: 0, allowed: true, rule: `more than ${R.remoteFreeHours} hours ahead: no fee` };
    return { fee: null, allowed: false, rule: `${R.remoteFreeHours} hours or less: missing the exam counts as a no-show and the attempt is lost` };
  }
  if (mode === 3) {
    if (d > PV.feeFromDays) return { fee: 0, allowed: true, rule: `${PV.freeBusinessDays} business days or more ahead: no charge` };
    if (d >= 1) return { fee: PV.fee, allowed: true, rule: `between ${PV.feeFromDays} days and ${PV.feeToHours} hours ahead: Pearson VUE fee` };
    return { fee: null, allowed: false, rule: `under ${PV.feeToHours} hours: no change; a no-show forfeits the fee` };
  }
  if (d >= R.centerFreeDays) return { fee: 0, allowed: true, rule: `${R.centerFreeDays} days or more ahead: no fee` };
  if (d >= R.centerFeeToDays) return { fee: R.centerFee, allowed: true, rule: `${R.centerFeeFromDays} to ${R.centerFeeToDays} days ahead: fee paid to Meazure Learning` };
  return { fee: null, allowed: false, rule: `under ${R.centerFeeToDays} days: no change or cancellation` };
}

// ---------- IPEDS ----------
export type IpedsRow = (typeof P.ipeds.rows)[number];
export const IPEDS = P.ipeds;
export const ipedsTotal = (r: IpedsRow) => r.short + r.cert + r.assoc + r.other;
export const IPEDS_SORTED = [...P.ipeds.rows].sort((a, b) => ipedsTotal(b) - ipedsTotal(a) || a.name.localeCompare(b.name));
export const ipedsRank = (st: string) => IPEDS_SORTED.findIndex((r) => r.st === st) + 1;
export const ipedsByState = (st: string) => P.ipeds.rows.find((r) => r.st === st) ?? null;
