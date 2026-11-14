/**
 * Calculators of the pages (RECETTE §9.3): one subject = one calculation through `engine/coding.ts`, never a
 * second formula in a page. Each page carries its own calculator; a calculator is not repeated on another page.
 */
import type { MiniSpec } from './mini-types';
import P from '../data/params-2026.json';
import { money, formatNumberL, pct, dateL } from './format-l';
import {
  CREDS, credById, passRate, passRates, examFee, totalCost, voucherChoice, renewal, ahimaMembership, bookSaving, pace,
  practiceGap, compareTwo, aapcTimeline, apprentice, rescheduleFee, expectedAttempts, IPEDS, IPEDS_SORTED, ipedsTotal, ipedsRank, type CredId,
} from './engine/coding';

const n0 = (v: number, d = 0) => formatNumberL(v, 'en', d);
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const plural = (k: number, w: string) => `${n0(k)} ${w}${k === 1 ? '' : 's'}`;
const A = P.aapc;
const H = P.ahima;
/** Short setting for the option labels: the chosen label must fit two lines on a 320 px phone (check-layout). */
const SHORT: Record<string, string> = { cpc: 'physician offices', coc: 'hospital outpatient', cic: 'hospital inpatient', crc: 'risk adjustment', cpb: 'billing', cca: 'entry level', ccs: 'inpatient, outpatient', ccsp: 'physician practices' };
const CRED_OPT = CREDS.map((c, i) => ({ value: String(i), label: `${c.code} (${c.body}), ${SHORT[c.id]}` }));
const credOf = (v: number | undefined) => CREDS[clamp(Math.round(v ?? 0), 0, CREDS.length - 1)];
const YES_NO = [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }];
const AHIMA_IDS: Array<'cca' | 'ccs' | 'ccsp'> = ['cca', 'ccs', 'ccsp'];
const AHIMA_OPT = AHIMA_IDS.map((id, i) => ({ value: String(i), label: `${credById(id).code}, ${SHORT[id]}` }));
const PACE_IDS: CredId[] = ['cpc', 'cca', 'ccs', 'ccsp'];
const PACE_OPT = PACE_IDS.map((id, i) => ({ value: String(i), label: `${credById(id).code} (${credById(id).body})` }));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_OPT = MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));
const YEAR_OPT = [2026, 2027].map((y) => ({ value: String(y), label: String(y) }));
const STATE_OPT = [...IPEDS.rows].sort((a, b) => a.name.localeCompare(b.name)).map((r, i) => ({ value: String(i), label: r.name }));
const STATE_LIST = [...IPEDS.rows].sort((a, b) => a.name.localeCompare(b.name));
const isAhima = (id: CredId) => id === 'cca' || id === 'ccs' || id === 'ccsp';
const yrs = (k: number) => plural(k, 'year');
/** Same number of sittings on both sides of a comparison (naive testers, 2026-11-14). */
const SITTINGS_OPT = [{ value: '1', label: '1 each (pass the first time)' }, { value: '2', label: '2 each (one retake)' }];
const SITTINGS_ONE = [{ value: '1', label: '1 (pass the first time)' }, { value: '2', label: '2 (one retake)' }];
const sittingsOf = (v: number | undefined) => (Math.round(v ?? 1) === 2 ? 2 : 1);
const YEARS_LABEL = 'Years you hold it (the exam year is year 1)';
/** Who a credential is for, in words, from the settings read on AAPC and AHIMA pages. */
const whoFor = (c: ReturnType<typeof credById>) => `${c.code} = ${c.name} (${c.body}), for ${c.setting}.`;
/** Comparison result: each total first, then the difference, named, then what was counted the same way. */
function compareOut(ca: ReturnType<typeof credById>, cb: ReturnType<typeof credById>, years: number, sittings: number, ahimaMember: boolean) {
  const r = compareTwo(ca.id, cb.id, { years, sittings, ahimaMember });
  const cheaper = r.cheaper ? credById(r.cheaper).code : null;
  const rows: Array<[string, string]> = [
    [`${ca.code} (${ca.body}), total`, money(r.a.total)],
    [`${cb.code} (${cb.body}), total`, money(r.b.total)],
    [cheaper ? `Difference: the ${cheaper} costs less by` : 'Difference', cheaper ? money(r.diff) : 'None, same cost'],
    ['Counted the same way for both', `${sittings === 1 ? '1 sitting each' : '2 sittings each'}, no course, no books`],
  ];
  return { r, head: [`Total over ${yrs(years)}: ${ca.code}, then ${cb.code}`, `${money(r.a.total)} · ${money(r.b.total)}`] as [string, string], rows };
}

const SPECS: Record<string, () => MiniSpec> = {
  /** Home: two credentials side by side over the same years. */
  compare: () => ({
    title: 'Compare two coding credentials, all costs in', cta: 'Add course and books: full cost calculator',
    exemple: (v) => `Example for ${credOf(v.a).code} against ${credOf(v.b).code}, held ${yrs(Math.round(v.y ?? 2))}, one sitting each, AHIMA exam taken as a non-member`,
    inputs: [
      { id: 'a', label: 'First credential', def: 0, options: CRED_OPT },
      { id: 'b', label: 'Second credential', def: 6, options: CRED_OPT },
      { id: 'y', label: YEARS_LABEL, def: 2, unit: 'years', max: 10 },
      { id: 'n', label: 'Exam sittings counted', def: 1, options: SITTINGS_OPT },
      { id: 'm', label: 'AHIMA member (changes AHIMA fees only)', def: 0, options: YES_NO, avance: true },
    ],
    run: (v) => {
      const years = clamp(Math.round(v.y ?? 2), 1, 10);
      const ca = credOf(v.a), cb = credOf(v.b);
      const o = compareOut(ca, cb, years, sittingsOf(v.n), v.m === 1);
      return {
        head: o.head,
        rows: o.rows,
        alert: 'Course and code books are not counted here: add them in the full cost calculator, link below.',
        note: `${whoFor(ca)}${ca.id === cb.id ? '' : ` ${whoFor(cb)}`} AAPC membership is counted because AAPC requires it; AHIMA membership ${v.m === 1 ? 'is counted, as you chose' : 'is optional and not counted'}. A second AAPC sitting is priced as the 2-attempt voucher.`,
      };
    },
  }),
  /** Certification cost page: one credential, every line. */
  total: () => ({
    title: 'Total cost of your coding credential', cta: 'Compare two credentials side by side',
    exemple: (v) => `Example for the ${credOf(v.c).code}, held ${yrs(Math.round(v.y ?? 2))}, one sitting, with no course or books bought`,
    inputs: [
      { id: 'c', label: 'Credential', def: 0, options: CRED_OPT },
      { id: 'n', label: 'Exam sittings to budget', def: 1, options: SITTINGS_ONE },
      { id: 's', label: 'AAPC student pricing', def: 0, options: YES_NO, showIf: (v) => !isAhima(credOf(v.c).id), help: 'Student exam and dues rates, as AAPC lists them' },
      { id: 'm', label: 'Join AHIMA', def: 0, options: YES_NO, showIf: (v) => isAhima(credOf(v.c).id) },
      { id: 'y', label: YEARS_LABEL, def: 2, unit: 'years', max: 10 },
      { id: 'p', label: 'Course or review you pay', def: 0, unit: '$', max: 20000, avance: true },
      { id: 'k', label: 'Code books you buy', def: 0, unit: '$', max: 2000, avance: true },
    ],
    run: (v) => {
      const c = credOf(v.c);
      const n = sittingsOf(v.n);
      const t = totalCost({ id: c.id, member: isAhima(c.id) ? v.m === 1 : true, student: v.s === 1, sittings: n, twoAttempt: !isAhima(c.id) && n === 2, prep: v.p ?? 0, books: v.k ?? 0, years: v.y ?? 2 });
      const pr = passRate(c.id);
      return {
        head: [`${c.code}, total over ${yrs(clamp(Math.round(v.y ?? 2), 1, 10))}`, money(t.total)],
        rows: t.lines.map(([l, x]) => [l, money(x)] as [string, string]),
        alert: (v.p ?? 0) === 0 ? 'Your course is not counted yet: type its price under “More settings”. It is often the largest line.' : undefined,
        note: `${whoFor(c)} ${pr ? `AHIMA's ${pr.year} first-time pass rate for the ${c.code}: ${pct(pr.rate)}; choose 2 sittings to budget a retake.` : `AAPC publishes no pass rate on the pages we read; 2 sittings are priced as the 2-attempt voucher.`}`,
      };
    },
  }),
  /** Billing and coding certification: CPC, CPB or both under one AAPC membership. */
  billcode: () => ({
    title: 'Coding, billing or both: what you pay AAPC', cta: 'Total cost of any credential',
    exemple: (v) => `Example for ${['the CPC alone', 'the CPB alone', 'the CPC and the CPB'][clamp(Math.round(v.w ?? 2), 0, 2)]}, kept ${yrs(Math.round(v.y ?? 2))}`,
    inputs: [
      { id: 'w', label: 'Credential to earn', def: 2, options: [{ value: '0', label: 'CPC, coding' }, { value: '1', label: 'CPB, billing' }, { value: '2', label: 'Both CPC and CPB' }] },
      { id: 'y', label: YEARS_LABEL, def: 2, unit: 'years', max: 10 },
      { id: 's', label: 'AAPC student pricing', def: 0, options: YES_NO, avance: true },
    ],
    run: (v) => {
      const w = clamp(Math.round(v.w ?? 2), 0, 2);
      const years = clamp(Math.round(v.y ?? 2), 1, 10);
      const exams = w === 2 ? 2 : 1;
      const voucher = examFee('cpc', { member: true, student: v.s === 1 });
      const first = v.s === 1 ? A.membership.student : A.membership.individual;
      const later = (years - 1) * A.membership.renewal;
      const total = exams * voucher + first + later;
      return {
        head: [`${['CPC', 'CPB', 'CPC and CPB'][w]} over ${yrs(years)}`, money(total)],
        rows: [[`${plural(exams, 'exam voucher')}, 1 attempt each`, money(exams * voucher)], ['AAPC membership, first year', money(first)], ['Membership renewals', money(later)]],
        note: w === 2 ? 'One membership covers both credentials. AAPC asks 36 CEUs every two years for one credential; we did not read its rule for two, so ask AAPC.' : `AAPC keeps the credential active with yearly dues and ${A.ceu.perCycle} CEUs every ${A.ceu.cycleYears} years.`,
      };
    },
  }),
  /** Billing and coding page: what to earn for the job you want. */
  chooser: () => ({
    title: 'Which credential fits the job you want', cta: 'See this credential’s total cost',
    exemple: 'Example for coding in a physician office',
    inputs: [{ id: 'j', label: 'Where you want to work', def: 0, options: [
      { value: '0', label: 'Coding in a physician office or clinic' },
      { value: '1', label: 'Coding hospital outpatient visits' },
      { value: '2', label: 'Coding hospital inpatient stays' },
      { value: '3', label: 'Billing and claims follow-up' },
      { value: '4', label: 'Risk adjustment for health plans' },
      { value: '5', label: 'Starting out, no coding experience yet' },
    ] }],
    run: (v) => {
      const j = clamp(Math.round(v.j ?? 0), 0, 5);
      const pick: Array<[CredId, CredId | null, string]> = [
        ['cpc', 'ccsp', 'physician-based'], ['coc', 'ccs', 'hospital outpatient'], ['cic', 'ccs', 'inpatient'], ['cpb', null, 'billing'], ['crc', null, 'risk adjustment'], ['cpc', 'cca', 'entry level'],
      ];
      const [a, b] = pick[j];
      const fa = examFee(a, { member: true });
      const rows: Array<[string, string]> = [[`AAPC: ${credById(a).code}, one-attempt voucher`, money(fa)]];
      if (b) rows.push([`AHIMA: ${credById(b).code}, non-member fee`, money(examFee(b, { member: false }))]);
      rows.push(['AAPC yearly membership, needed to hold the credential', money(A.membership.individual)]);
      return {
        head: ['Credential to look at first', b ? `${credById(a).code} or ${credById(b).code}` : credById(a).code],
        rows,
        note: j === 5 ? `AAPC adds “-A” (apprentice) to a CPC earned without ${A.apprentice.years} years of experience; AHIMA's CCA asks only a high school diploma.` : 'Both bodies are recognized nationally; job ads often name the one the employer prefers.',
        go: [`${credById(a).code} cost in full →`, j === 3 ? '/en/medical-billing-and-coding-certification/' : j === 5 ? '/en/cca-certification/' : '/en/medical-coding-certification/'],
      };
    },
  }),
  /** CPC page. */
  'cpc-cost': () => ({
    title: 'What the CPC costs you, year by year', cta: 'Compare the CPC with other credentials',
    exemple: (v) => `Example for a ${v.s === 1 ? 'student' : 'non-student'} buying a ${v.v === 2 ? '2' : '1'}-attempt voucher and keeping the CPC ${yrs(Math.round(v.y ?? 3))}`,
    inputs: [
      { id: 'v', label: 'Voucher', def: 1, options: [{ value: '1', label: '1 attempt' }, { value: '2', label: '2 attempts' }] },
      { id: 's', label: 'AAPC student pricing', def: 0, options: YES_NO },
      { id: 'y', label: 'Years you keep the CPC', def: 3, unit: 'years', max: 10 },
    ],
    run: (v) => {
      const years = clamp(Math.round(v.y ?? 3), 1, 10);
      const t = totalCost({ id: 'cpc', member: true, student: v.s === 1, twoAttempt: v.v === 2, prep: 0, books: 0, years });
      return {
        head: [`CPC over ${yrs(years)}, before any course`, money(t.total)],
        rows: [['Exam voucher', money(t.exam)], ['Membership, first year', money(t.joinDues)], [`Renewals at ${money(A.membership.renewal)} a year`, money(t.renewal)], ['CEUs to earn in that time', `${n0(renewal('cpc', { member: true, years }).ceus)}`]],
        note: `AAPC: “maintain your AAPC annual membership, and earn ${A.ceu.perCycle} CEUs every ${A.ceu.cycleYears} years”. The cost of CEUs depends on how you earn them and is not counted.`,
      };
    },
  }),
  /** CPC exam page: time per question. */
  pace: () => ({
    title: 'Your time per question on exam day', cta: 'Practice score against the passing line',
    exemple: (v) => `Example for the ${credById(PACE_IDS[clamp(Math.round(v.e ?? 0), 0, 3)]).code} with ${n0(v.r ?? 20)} minutes kept for review`,
    inputs: [
      { id: 'e', label: 'Exam', def: 0, options: PACE_OPT },
      { id: 'r', label: 'Minutes you keep at the end for review', def: 20, unit: 'min', max: 120 },
    ],
    run: (v) => {
      const id = PACE_IDS[clamp(Math.round(v.e ?? 0), 0, 3)];
      const p = pace(id, v.r ?? 20);
      const c = credById(id);
      const rows: Array<[string, string]> = [['Questions', n0(p.items)], ['Exam time', `${n0(p.minutes)} minutes`]];
      if (p.passCorrect != null) rows.push(['Right answers needed', `${n0(p.passCorrect)} (${n0(p.maxWrong!)} misses allowed)`]);
      else rows.push(['Passing standard', `scaled score of ${n0(H.passScore)}, not a count`]);
      return {
        head: ['Minutes per question', n0(p.per, 1)],
        rows,
        alert: p.per < 1.5 ? 'Under 1.5 minutes a question: keep less time for review.' : undefined,
        note: `${c.code}: ${c.body === 'AHIMA' ? `${n0(c.items!)} questions of which ${n0(c.scored!)} scored; unscored pretest questions are mixed in` : 'AAPC format read on its “Taking the CPC exam” page'}.`,
      };
    },
  }),
  /** CPC exam cost page: 1-attempt or 2-attempt voucher. */
  voucher: () => ({
    title: 'One-attempt or two-attempt CPC voucher?', cta: 'Your CPC cost year by year',
    exemple: (v) => `Example for a ${n0(v.p ?? 70)}% chance of passing the first sitting, ${v.s === 1 ? 'student' : 'regular'} pricing`,
    inputs: [
      { id: 'p', label: 'Your chance of passing the first sitting', def: 70, unit: '%', max: 100, help: 'Your honest guess: AAPC publishes no pass rate' },
      { id: 's', label: 'AAPC student pricing', def: 0, options: YES_NO },
    ],
    run: (v) => {
      const r = voucherChoice((v.p ?? 70) / 100, v.s === 1);
      const pick = r.better === 'two' ? '2-attempt voucher' : '1-attempt voucher';
      return {
        head: ['Cheaper on average', pick],
        rows: [['2-attempt voucher, paid once', money(r.two)], ['1-attempt voucher, plus a second only if you fail', `${money(r.expectedSingles)} on average`], ['Break-even chance of passing', pct(r.breakEven, 1)]],
        note: `Below a ${pct(r.breakEven, 1)} chance, the 2-attempt voucher costs less on average. Vouchers are non-refundable and valid ${A.voucherValidMonths} months from purchase.`,
      };
    },
  }),
  /** Practice test page: a practice score against the CPC line. */
  practice: () => ({
    title: 'Your practice score against the CPC passing line', cta: 'Time per question on exam day',
    exemple: (v) => `Example for ${n0(v.c ?? 62)} right answers out of ${n0(v.n ?? 100)}`,
    inputs: [
      { id: 'c', label: 'Right answers on your practice test', def: 62, max: 200 },
      { id: 'n', label: 'Questions on that practice test', def: 100, max: 200 },
    ],
    run: (v) => {
      const g = practiceGap(v.c ?? 62, v.n ?? 100);
      return {
        head: ['Your score', pct(g.share)],
        rows: [['Same score on the 100-question CPC', `${n0(g.onCpc)} right`], ['CPC passing line', `${n0(A.cpc.passCorrect)} right (${pct(A.cpc.passShare)})`], [g.gap > 0 ? 'Right answers still missing' : 'Margin above the line', n0(Math.abs(g.gap))]],
        alert: (v.c ?? 0) > (v.n ?? 100) ? 'More right answers than questions: check the two numbers.' : undefined,
        note: 'A practice test from a publisher is not the real exam: treat the margin as a signal, not a promise. AHIMA exams use a scaled score of 300, which no practice percentage converts to.',
      };
    },
  }),
  /** CCS page: join AHIMA or not. */
  'ahima-member': () => ({
    title: 'Join AHIMA before the exam, or not?', cta: 'Pass rates and expected retakes',
    exemple: (v) => `Example for the ${credById(AHIMA_IDS[clamp(Math.round(v.e ?? 1), 0, 2)]).code}, kept ${yrs(Math.round(v.y ?? 2))}, sittings expected from the latest pass rate`,
    inputs: [
      { id: 'e', label: 'AHIMA exam', def: 1, options: AHIMA_OPT },
      { id: 'y', label: 'Years you keep the credential', def: 2, unit: 'years', max: 10 },
    ],
    run: (v) => {
      const id = AHIMA_IDS[clamp(Math.round(v.e ?? 1), 0, 2)];
      const years = clamp(Math.round(v.y ?? 2), 1, 10);
      const r = ahimaMembership(id, years);
      return {
        head: [r.diff > 0 ? 'Joining saves you' : 'Staying a non-member saves you', money(Math.abs(r.diff))],
        rows: [['As a member: exam, dues, recertification', money(r.member)], ['As a non-member: exam, recertification', money(r.nonMember)], [`Average tries per person (${pct(passRate(id)!.rate)} pass the first time)`, n0(r.sittings, 2)]],
        note: `Professional dues ${money(H.membership.professional)} a year; recertification every ${H.recert.cycleYears} years: ${money(H.recert.member)} member, ${money(H.recert.nonMember)} non-member. Student dues are ${money(H.membership.student)}.`,
      };
    },
  }),
  /** CCA page: CCA first then CCS, or straight to the CCS. */
  'cca-path': () => ({
    title: 'CCA first, then CCS: what the two steps cost', cta: 'Join AHIMA or not',
    exemple: (v) => `Example for a ${v.m === 1 ? 'member' : 'non-member'} who takes the CCS ${yrs(Math.round(v.g ?? 1))} after the CCA`,
    inputs: [
      { id: 'g', label: 'Years between the CCA and the CCS', def: 1, unit: 'years', max: 6 },
      { id: 'm', label: 'AHIMA member', def: 0, options: YES_NO },
    ],
    run: (v) => {
      const gap = clamp(Math.round(v.g ?? 1), 0, 6);
      const member = v.m === 1;
      const sA = expectedAttempts(passRate('cca')!.rate), sS = expectedAttempts(passRate('ccs')!.rate);
      const cca = examFee('cca', { member }) * sA;
      const ccs = examFee('ccs', { member }) * sS;
      const recert = member ? H.recert.member : H.recert.nonMember;
      const cyclesOnCca = Math.floor(gap / H.recert.cycleYears);
      const dues = member ? (gap + 1) * H.membership.professional : 0;
      const total = cca + ccs + cyclesOnCca * recert + dues;
      return {
        head: ['Both exams and fees until the CCS', money(total)],
        rows: [[`CCA fees, retakes included on average (${pct(passRate('cca')!.rate)} pass the first time)`, money(cca)], [`CCS fees, retakes included on average (${pct(passRate('ccs')!.rate)} pass the first time)`, money(ccs)], ['CCA recertification paid in between', money(cyclesOnCca * recert)], ['AHIMA dues over the period', money(dues)]],
        note: `Average fees: one fee per sitting, times ${n0(sA, 2)} sittings for the CCA and ${n0(sS, 2)} for the CCS, the average number of tries per person that AHIMA’s 2025 first-time pass rates imply. Once the CCS is earned it replaces the CCA, so only the CCS is renewed.`,
      };
    },
  }),
  /** CCS-P page: CCS-P or CPC for a physician practice. */
  'ccsp-cpc': () => ({
    title: 'CCS-P or CPC for physician-practice coding', cta: 'Compare any two credentials',
    exemple: (v) => `Example over ${yrs(Math.round(v.y ?? 4))}, one sitting each, ${v.m === 1 ? 'AHIMA member' : 'not an AHIMA member'}`,
    inputs: [
      { id: 'y', label: YEARS_LABEL, def: 4, unit: 'years', max: 10 },
      { id: 'n', label: 'Exam sittings counted', def: 1, options: SITTINGS_OPT },
      { id: 'm', label: 'AHIMA member for the CCS-P', def: 0, options: YES_NO },
    ],
    run: (v) => {
      const years = clamp(Math.round(v.y ?? 4), 1, 10);
      const o = compareOut(credById('ccsp'), credById('cpc'), years, sittingsOf(v.n), v.m === 1);
      const pr = passRate('ccsp')!;
      return {
        head: o.head,
        rows: o.rows,
        note: `Only ${pct(pr.rate)} of first-time CCS-P testers passed in ${pr.year}; AAPC publishes no CPC rate. Choose 2 sittings to budget a retake on both sides: a second AAPC sitting is priced as the 2-attempt voucher.`,
      };
    },
  }),
  /** How to become a medical coder: CPC-A removal. */
  apprentice: () => ({
    title: 'When the “A” comes off your CPC', cta: 'How long the whole path takes',
    exemple: (v) => `Example for ${plural(Math.round(v.x ?? 6), 'month')} of coding experience${v.k === 1 ? ' and an 80-hour course' : ''}`,
    inputs: [
      { id: 'x', label: 'Months of coding experience you will have at the exam', def: 6, unit: 'months', max: 60 },
      { id: 'k', label: '80-hour coding course completed (or AAPC CPC prep course)', def: 1, options: YES_NO },
    ],
    run: (v) => {
      const r = apprentice(v.x ?? 6, v.k === 1);
      return {
        head: ['Experience still needed after you pass', r.left === 0 ? 'None' : plural(r.left, 'month')],
        rows: [['Experience AAPC asks for', plural(r.need, 'month')], ['Already counted', plural(Math.min(r.need, Math.round(v.x ?? 6)), 'month')], ['Credential after the exam', r.left === 0 ? 'CPC' : 'CPC-A (apprentice)']],
        note: `AAPC: a course of ${A.apprentice.courseHours} hours or more waives ${A.apprentice.waivesYears} year of the ${A.apprentice.years} years; removal is requested from AAPC.`,
      };
    },
  }),
  /** How long: dates from the start of training. */
  timeline: () => ({
    title: 'Your CPC dates, from the first day of training', cta: 'When the apprentice “A” comes off',
    exemple: (v) => `Example for training that starts in ${MONTHS[clamp(Math.round(v.m ?? 1), 1, 12) - 1]} ${v.yy ?? 2027} and lasts ${plural(Math.round(v.s ?? 6), 'month')}`,
    inputs: [
      { id: 'm', label: 'Month you start training', def: 1, options: MONTH_OPT },
      { id: 'yy', label: 'Year', def: 2027, options: YEAR_OPT },
      { id: 's', label: 'Months of study', def: 6, unit: 'months', max: 24, help: `AAPC: most people take ${A.prepMonths[0]} to ${A.prepMonths[1]} months` },
    ],
    run: (v) => {
      const t = aapcTimeline(Math.round(v.yy ?? 2027), Math.round(v.m ?? 1), v.s ?? 6);
      return {
        head: ['Earliest exam date', dateL(t.exam)],
        rows: [['Book the exam by', dateL(t.bookBy)], ['Results expected between', `${dateL(t.resFrom)} and ${dateL(t.resTo)}`]],
        alert: t.shifted ? `Your date fell in AAPC's year-end blackout (from December ${A.blackout.startDay}); exams resume ${A.blackout.resumes}.` : undefined,
        note: `Booking ${A.registerWeeksBefore} weeks ahead, as AAPC asks; results in ${A.resultsBusinessDays[0]} to ${A.resultsBusinessDays[1]} business days, federal holidays not removed.`,
      };
    },
  }),
  /** CEU and renewal page. */
  renewal: () => ({
    title: 'Keeping your credential: dues, fees and CEUs', cta: 'Total cost from the exam on',
    exemple: (v) => `Example for the ${credOf(v.c).code}, renewed over ${yrs(Math.round(v.y ?? 4))}`,
    inputs: [
      { id: 'c', label: 'Credential', def: 6, options: CRED_OPT },
      { id: 'y', label: 'Years after the exam', def: 4, unit: 'years', max: 20 },
      { id: 'm', label: 'AHIMA member', def: 0, options: YES_NO, showIf: (v) => isAhima(credOf(v.c).id) },
      { id: 'x', label: 'Other AHIMA credentials you hold', def: 0, max: 5, showIf: (v) => isAhima(credOf(v.c).id), avance: true },
    ],
    run: (v) => {
      const c = credOf(v.c);
      const years = clamp(Math.round(v.y ?? 4), 0, 20);
      const r = renewal(c.id, { member: v.m === 1, years, extraCreds: v.x ?? 0 });
      const rows: Array<[string, string]> = isAhima(c.id)
        ? [['Recertification fees', money(r.recert)], ['AHIMA dues', money(r.dues)], ['CEUs to report', `${n0(r.ceus)} over ${plural(r.cycles, 'cycle')}`]]
        : [['AAPC membership renewals', money(r.dues)], ['CEUs to earn', `${n0(r.ceus)} over ${plural(r.cycles, 'cycle')}`]];
      return {
        head: [`${c.code}, renewal over ${yrs(years)}`, money(r.total)],
        rows,
        note: isAhima(c.id) ? `AHIMA: ${H.recert.ceus.ccs} CEUs per 2-year cycle for the CCA, CCS and CCS-P; late extension ${money(H.recert.extension)}, reinstatement ${money(H.recert.reinstatement)}.` : `AAPC: yearly membership and ${A.ceu.perCycle} CEUs every ${A.ceu.cycleYears} years for one credential.`,
      };
    },
  }),
  /** Pass rates page: expected sittings and fees. */
  retake: () => ({
    title: 'Average tries and exam fees from AHIMA pass rates', cta: 'Join AHIMA or not',
    exemple: (v) => `Example for the ${credById(AHIMA_IDS[clamp(Math.round(v.e ?? 2), 0, 2)]).code} at the ${n0(v.yy ?? 2025)} rate, non-member fee`,
    inputs: [
      { id: 'e', label: 'AHIMA exam', def: 2, options: AHIMA_OPT },
      { id: 'yy', label: 'Pass-rate year', def: 2025, options: [2023, 2024, 2025].map((y) => ({ value: String(y), label: String(y) })) },
      { id: 'm', label: 'AHIMA member', def: 0, options: YES_NO, avance: true },
    ],
    run: (v) => {
      const id = AHIMA_IDS[clamp(Math.round(v.e ?? 2), 0, 2)];
      const r = passRates(id).find((x) => x.year === Math.round(v.yy ?? 2025)) ?? passRates(id)[passRates(id).length - 1];
      const s = expectedAttempts(r.rate);
      const fee = examFee(id, { member: v.m === 1 });
      return {
        head: ['Exam fees to expect', money(fee * s)],
        rows: [[`First-time pass rate, ${r.year}`, `${pct(r.rate)} of ${n0(r.testers)} testers`], ['Average tries per person until a pass', n0(s, 2)], ['Fee for each sitting', money(fee)]],
        note: `Average for a candidate passing each sitting at the published first-time rate; a retake needs a new application and a ${H.retakeWaitDays}-day wait.`,
      };
    },
  }),
  /** Rescheduling page. */
  reschedule: () => ({
    title: 'Fee to move your exam appointment', cta: 'Your CPC dates and booking deadline',
    exemple: (v) => `Example for ${['an AAPC exam at a testing center', 'an AAPC exam at home', 'an AHIMA exam at Pearson VUE'][clamp(Math.round(v.w ?? 1), 1, 3) - 1]}, ${plural(Math.round(v.d ?? 7), 'day')} before`,
    inputs: [
      { id: 'w', label: 'Exam and format', def: 1, options: [{ value: '1', label: 'AAPC, testing center' }, { value: '2', label: 'AAPC, at home (live remote proctor)' }, { value: '3', label: 'AHIMA, Pearson VUE center' }] },
      { id: 'd', label: 'Days before the appointment', def: 7, unit: 'days', max: 120 },
    ],
    run: (v) => {
      const r = rescheduleFee(Math.round(v.w ?? 1), Math.round(v.d ?? 7));
      return {
        head: ['Fee to move or cancel', r.allowed ? money(r.fee ?? 0) : 'Not possible'],
        rows: [['Rule that applies', r.rule]],
        alert: r.allowed ? undefined : 'Missing the appointment loses the attempt or the fee.',
        note: 'AAPC rules from its reschedule page; AHIMA rules from its exam cancellation policy (business days and calendar days as each body writes them).',
      };
    },
  }),
  /** Code books page. */
  books: () => ({
    title: 'Code books: does the member price pay for the dues?', cta: 'What the CPC costs year by year',
    exemple: (v) => `Example for ${plural(Math.round(v.n ?? 1), 'bundle')} bought as an AAPC member`,
    inputs: [{ id: 'n', label: 'Pro Fee Coder bundles you buy (one a year)', def: 1, max: 10 }],
    run: (v) => {
      const b = bookSaving();
      const n = clamp(Math.round(v.n ?? 1), 0, 10);
      return {
        head: ['Saved on books as a member', money(n * b.saving)],
        rows: [['Member price of one bundle', money(b.member)], ['Non-member price', money(b.nonMember)], ['Yearly AAPC membership', money(A.membership.individual)]],
        note: 'Prices of the AAPC Pro Fee Coder book bundle on AAPC’s membership page. Any publisher’s current-year books are accepted for the CPC.',
      };
    },
  }),
  /** Programs by state (IPEDS). */
  state: () => ({
    title: 'Coding programs in your state, federal count', cta: 'How long training takes',
    exemple: (v) => `Example for ${STATE_LIST[clamp(Math.round(v.s ?? 0), 0, STATE_LIST.length - 1)].name}`,
    inputs: [{ id: 's', label: 'State', def: STATE_LIST.findIndex((r) => r.st === 'TX'), options: STATE_OPT }],
    run: (v) => {
      const r = STATE_LIST[clamp(Math.round(v.s ?? 0), 0, STATE_LIST.length - 1)];
      return {
        head: [`Coding awards in ${r.name}, ${IPEDS.year}`, n0(ipedsTotal(r))],
        rows: [['Schools that reported some', n0(r.inst)], ['Certificates under 1 year', n0(r.short)], ['Certificates of 1 to 2 years', n0(r.cert)], ['Associate degrees', n0(r.assoc)], ['Rank among the states listed', `${n0(ipedsRank(r.st))} of ${n0(IPEDS_SORTED.length)}`]],
        note: `IPEDS program code ${IPEDS.cip}, first majors, ${IPEDS.release} release. A school can teach coding under another code: this is a floor, not a full list.`,
      };
    },
  }),
};

export function getSpec(kind: string, _lang = 'en'): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown mini spec: ${kind}`);
  return f();
}
export const SPEC_IDS = Object.keys(SPECS);
/** Page each calculator's link goes to (Tool.astro reads it). */
export const CTA_PAGE: Record<string, string> = {
  compare: 'medical-coding-certification', total: 'home', billcode: 'medical-coding-certification', chooser: 'medical-coding-certification',
  'cpc-cost': 'home', pace: 'medical-coding-practice-test', voucher: 'cpc-certification', practice: 'cpc-exam',
  'ahima-member': 'medical-coding-pass-rates', 'cca-path': 'ccs-certification', 'ccsp-cpc': 'home', apprentice: 'how-long-does-it-take-to-become-a-medical-coder',
  timeline: 'how-to-become-a-medical-coder', renewal: 'medical-coding-certification', retake: 'ccs-certification', reschedule: 'how-long-does-it-take-to-become-a-medical-coder',
  books: 'cpc-certification', state: 'how-long-does-it-take-to-become-a-medical-coder',
};
