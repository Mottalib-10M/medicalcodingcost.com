import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money, pct } from '../../lib/format-l';

const last = P.ahima.exams.ccs.rates[P.ahima.exams.ccs.rates.length - 1];
export default definePage({
  id: 'ccs-certification',
  group: 'ahima',
  order: 20,
  tool: { kind: 'mini:ahima-member' },
  related: ['cca-certification', 'ccs-p-certification', 'medical-coding-pass-rates', 'medical-coding-ceu-requirements', 'cpc-certification'],
  sources: ['ahima', 'pearson_ahima'],
  en: {
    slug: 'ccs-certification',
    nav: 'CCS certification',
    card: 'AHIMA’s Certified Coding Specialist: fees for members and others, format, pass rates, and whether to join.',
    title: 'CCS Certification: AHIMA Fees, Pass Rates and Renewal',
    description: `CCS certification in 2026: ${money(P.ahima.exams.ccs.member)} for AHIMA members, ${money(P.ahima.exams.ccs.nonMember)} for others, ${P.ahima.exams.ccs.items} questions in 4 hours, a first-time pass rate of ${pct(last[2])} and the recertification fees.`,
    h1: 'CCS certification: fees, format, pass rate and renewal',
    intro: `CCS certification costs ${money(P.ahima.exams.ccs.member)} per sitting for AHIMA members and ${money(P.ahima.exams.ccs.nonMember)} for others, and ${pct(last[2])} of first-time testers passed in ${last[0]}. Pick the exam and the years below to see whether joining AHIMA pays.`,
    resume: (h) => `The Certified Coding Specialist (CCS) is AHIMA's credential for coders experienced with inpatient and outpatient records, and in AHIMA's credential hierarchy it sits above the entry-level CCA. Experience is recommended, not required: AHIMA lists five profiles, such as two years of coding that directly applies codes, or the CCA plus one year. The exam has ${h.H.exams.ccs.items} questions, ${h.H.exams.ccs.scored} of them scored, in ${h.hm(h.H.exams.ccs.minutes)}, and the pass mark is a scaled ${h.H.passScore}. It costs ${h.usd(h.H.exams.ccs.member)} for members and ${h.usd(h.H.exams.ccs.nonMember)} for others, and a retake costs the same after a ${h.H.retakeWaitDays}-day wait. In ${last[0]}, ${h.pc(last[2])} of ${h.num(last[1])} first-time testers passed, against ${h.pc(h.H.exams.ccs.rates[0][2])} in ${h.H.exams.ccs.rates[0][0]}. The credential is renewed every ${h.H.recert.cycleYears} years with ${h.H.recert.ceus.ccs} CEUs and a fee of ${h.usd(h.H.recert.member)} for members or ${h.usd(h.H.recert.nonMember)} for others. ${h.ahima('CCS certification page and Recertification Guide')}.`,
    faqs: (h) => [
      { q: 'Is it worth joining AHIMA before taking the CCS?', a: `Membership costs ${h.usd(h.H.membership.professional)} a year and saves ${h.usd(h.H.exams.ccs.nonMember - h.H.exams.ccs.member)} per sitting and ${h.usd(h.H.recert.nonMember - h.H.recert.member)} per recertification. For one sitting and one two-year cycle the saving does not cover two years of dues; for students, dues of ${h.usd(h.H.membership.student)} change the result. The calculator does the sum for your exam and years.` },
      { q: 'How long do I have to wait to retake the CCS?', a: `At least ${h.H.retakeWaitDays} days. AHIMA treats a retake as a new application with the same exam fee, and approves it only after the wait. Once approved, you schedule with Pearson VUE within ${h.H.scheduleWithinDays} days of eligibility. Moving an appointment within ${h.H.pearson.feeFromDays} days of the date costs ${h.usd(h.H.pearson.fee)}.` },
      { q: 'Does the CCS replace the CCA?', a: 'Yes. In AHIMA’s credential hierarchy the CCS supersedes the CCA: once you pass the CCS, the CCA is replaced and no longer has to be recertified. You then pay one recertification fee for the CCS instead of two, and report the CEUs of a single coding credential.' },
    ],
    body: (h) => {
      const rows = h.E.passRates('ccs').map((r) => [String(r.year), h.num(r.testers), h.pc(r.rate), h.num(h.E.expectedAttempts(r.rate), 2)]);
      return `
<h2>CCS certification pass rates</h2>
<p>AHIMA publishes the first-time pass rate and the number of first-time testers. The rate rose sharply in three years while the number of testers almost doubled.</p>
${h.table(['Year', 'First-time testers', 'Pass rate', 'Expected sittings'], rows, `${h.num(h.H.exams.ccs.certified)} CCS holders at the end of 2025, as AHIMA reports it.`, ['l', 'r', 'r', 'r'])}

<h2>The exam</h2>
<p>${h.H.exams.ccs.items} questions, of which ${h.H.exams.ccs.items - h.H.exams.ccs.scored} are unscored pretest items mixed in, in ${h.hm(h.H.exams.ccs.minutes)} at a Pearson VUE center. The questions follow five domains. From May 1, 2026, candidates bring the code books on AHIMA's 2026 list; without the right books they are not allowed to test and forfeit the fee. Arriving late counts as a no-show, which also forfeits it.</p>

<h2>Recertification</h2>
<p>Every two years: ${h.H.recert.ceus.ccs} CEUs entered in AHIMA's CEU Center and the fee, ${h.usd(h.H.recert.member)} for members or ${h.usd(h.H.recert.nonMember)} for others, plus ${h.usd(h.H.recert.memberExtra)} or ${h.usd(h.H.recert.nonMemberExtra)} for each additional AHIMA credential. A CCS adds six CEUs when you earn another AHIMA certification. Compare the CCS with the CPC over the same years on the ${h.a('home', 'comparator')}, and with the ${h.a('ccs-p-certification', 'CCS-P')}, its physician-practice twin.</p>
`;
    },
  },
});
