import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { pct } from '../../lib/format-l';

const E = P.ahima.exams;
const y = E.ccs.rates[E.ccs.rates.length - 1][0];
export default definePage({
  id: 'medical-coding-pass-rates',
  group: 'ahima',
  order: 23,
  tool: { kind: 'mini:retake' },
  related: ['ccs-certification', 'cca-certification', 'ccs-p-certification', 'cpc-exam-cost', 'medical-coding-practice-test'],
  sources: ['ahima'],
  en: {
    slug: 'medical-coding-pass-rates',
    nav: 'Pass rates',
    card: 'First-time pass rates AHIMA publishes for 2023 to 2025, turned into expected sittings and exam fees.',
    title: 'Medical Coding Exam Pass Rates: CCA, CCS, CCS-P, RHIT',
    description: `Medical coding exam pass rates AHIMA publishes for ${y}: CCS ${pct(E.ccs.rates[2][2])}, CCA ${pct(E.cca.rates[2][2])}, CCS-P ${pct(E.ccsp.rates[2][2])}, RHIT ${pct(E.rhit.rates[2][2])}, with the number of testers, expected sittings and exam fees.`,
    h1: 'Medical coding exam pass rates, and what they cost you',
    intro: `Medical coding exam pass rates are published by AHIMA only: in ${y}, ${pct(E.ccs.rates[2][2])} of first-time CCS testers passed, ${pct(E.cca.rates[2][2])} on the CCA and ${pct(E.ccsp.rates[2][2])} on the CCS-P. Pick an exam and a year to turn the rate into fees.`,
    resume: (h) => `AHIMA publishes, for each certification exam, the share of first-time candidates who passed in each of the last three years and how many took it. AAPC publishes no such figure on the pages we read, so the CPC, the COC and its other exams have no rate on this site. A pass rate is an average across everyone who sat the exam for the first time; it says nothing about how prepared each candidate was. Still, it gives the number of sittings an average candidate should budget: one divided by the rate. At ${h.pc(E.ccsp.rates[2][2])}, that is ${h.num(h.E.expectedAttempts(E.ccsp.rates[2][2]), 2)} sittings for the CCS-P; at ${h.pc(E.ccs.rates[2][2])}, ${h.num(h.E.expectedAttempts(E.ccs.rates[2][2]), 2)} for the CCS. Each AHIMA sitting is paid in full, ${h.usd(E.ccs.nonMember)} for a CCS non-member, after a ${h.H.retakeWaitDays}-day wait. The RHIT is shown for reference; it is a health information credential, not a coding one. ${h.ahima('certification pages')}.`,
    faqs: (h) => [
      { q: 'Does AAPC publish a CPC pass rate?', a: 'Not on the AAPC pages we read for this site: the exam pages give the format, the passing score and the fees, but no share of candidates who pass. Figures quoted elsewhere online come without a source we could check, so this site does not use them. The CPC calculators ask you for your own estimate instead.' },
      { q: 'Why did the CCS pass rate rise while the CCA fell?', a: `AHIMA does not explain the change. The CCS went from ${h.pc(E.ccs.rates[0][2])} to ${h.pc(E.ccs.rates[2][2])} while its first-time testers nearly doubled; the CCA went from ${h.pc(E.cca.rates[0][2])} to ${h.pc(E.cca.rates[2][2])}. Any reading beyond these numbers would be a guess, so the site only turns them into expected sittings.` },
      { q: 'Are repeat testers counted in these rates?', a: 'No. AHIMA labels them first-time pass rates and gives the number of first-time testers next to each one. Candidates who retake the exam are not in these figures, so the rate on a second try may differ. The calculator assumes the same rate at each sitting, which is a simplification.' },
    ],
    body: (h) => {
      const ids = ['cca', 'ccs', 'ccsp', 'rhit'] as const;
      const rows = ids.map((id) => { const x = E[id]; return [id === 'ccsp' ? 'CCS-P' : id.toUpperCase(), ...x.rates.map((r) => `${h.pc(r[2])} (${h.num(r[1])})`), h.num(x.certified)]; });
      const fees = ids.map((id) => { const x = E[id]; const s = h.E.expectedAttempts(x.rates[2][2]); return [id === 'ccsp' ? 'CCS-P' : id.toUpperCase(), h.num(s, 2), h.usd(x.member * s), h.usd(x.nonMember * s)]; });
      return `
<h2>Medical coding exam pass rates, 2023 to 2025</h2>
${h.table(['Exam', '2023', '2024', '2025', 'Holders, end of 2025'], rows, 'First-time pass rate (first-time testers), as AHIMA publishes it.', ['l', 'r', 'r', 'r', 'r'])}

<h2>Fees to expect at the latest rate</h2>
<p>Multiply the fee of one sitting by the sittings the ${y} rate implies. The member column leaves out the dues of ${h.usd(h.H.membership.professional)} a year.</p>
${h.table(['Exam', 'Average tries per person', 'Member fees', 'Non-member fees'], fees, `Average tries per person = 1 / first-time pass rate, ${y}.`, ['l', 'r', 'r', 'r'])}

<h2>How to use a rate you cannot control</h2>
<p>Treat the expected fees as a budget line, not a prediction. A full timed practice exam tells you more about your own odds: the ${h.a('medical-coding-practice-test', 'practice test page')} compares your score with the pass mark. On the AAPC side, the 2-attempt voucher plays the role of a retake budget; the ${h.a('cpc-exam-cost', 'CPC exam cost page')} shows when it pays.</p>
`;
    },
  },
});
