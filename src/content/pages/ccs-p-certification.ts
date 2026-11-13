import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money, pct } from '../../lib/format-l';

const X = P.ahima.exams.ccsp;
const last = X.rates[X.rates.length - 1];
export default definePage({
  id: 'ccs-p-certification',
  group: 'ahima',
  order: 22,
  tool: { kind: 'mini:ccsp-cpc' },
  related: ['ccs-certification', 'cpc-certification', 'medical-coding-pass-rates', 'medical-coding-ceu-requirements'],
  sources: ['ahima', 'aapc_cpc', 'aapc_members'],
  en: {
    slug: 'ccs-p-certification',
    nav: 'CCS-P certification',
    card: 'AHIMA’s physician-based coding credential: fees, the lowest pass rate AHIMA publishes, and the cost gap with the CPC.',
    title: 'CCS-P Certification: Fees, Pass Rates, CCS-P vs CPC',
    description: `CCS-P certification in 2026: ${money(X.member)} for AHIMA members or ${money(X.nonMember)}, ${X.items} questions in 4 hours, a first-time pass rate of ${pct(last[2])}, and its total cost next to the CPC.`,
    h1: 'CCS-P certification: fees, pass rate and the CPC comparison',
    intro: `CCS-P certification costs ${money(X.member)} per sitting for AHIMA members and ${money(X.nonMember)} for others, but only ${pct(last[2])} of first-time testers passed in ${last[0]}. Set the years you keep it to compare it with the CPC.`,
    resume: (h) => `The Certified Coding Specialist, Physician-based (CCS-P) is AHIMA's credential for coders in physician offices, group practices, multi-specialty clinics and specialty centers, much of the ground the AAPC CPC also covers. AHIMA recommends, without requiring it, coursework plus one year of experience, two years of multi-specialty coding, the CCA plus one year, or another body's coding credential plus one year. The exam has ${h.num(X.items)} questions, ${h.num(X.scored)} of them scored, in ${h.hm(X.minutes)}. A sitting costs ${h.usd(X.member)} for members and ${h.usd(X.nonMember)} for others. It has the lowest first-time pass rate AHIMA publishes for a coding exam: ${h.pc(X.rates[0][2])} in ${X.rates[0][0]} and ${h.pc(last[2])} in ${last[0]}, so on average ${h.num(h.E.expectedAttempts(last[2]), 1)} sittings. Renewal takes ${h.H.recert.ceus.ccsp} CEUs every ${h.H.recert.cycleYears} years. ${h.ahima('CCS-P certification page')}; CPC figures from aapc.com, read the same day.`,
    faqs: (h) => [
      { q: 'Why is the CCS-P pass rate so low?', a: `AHIMA publishes the rate but not the reasons. The numbers are small, ${h.num(last[1])} first-time testers in ${last[0]}, and AHIMA recommends multi-specialty experience before the exam. At ${h.pc(last[2])}, a candidate with average results should budget about two sittings, which doubles the exam line of the total.` },
      { q: 'Can I hold both the CCS and the CCS-P?', a: `Yes. They are separate credentials and the CCS-P does not replace the CCS. Holding both means ${h.H.recert.ceus.ccs} CEUs for the first plus ten more for the second each cycle, and an extra recertification fee of ${h.usd(h.H.recert.memberExtra)} for members or ${h.usd(h.H.recert.nonMemberExtra)} for others.` },
      { q: 'Is the CCS-P or the CPC cheaper over four years?', a: `With no course counted, it depends on membership and retakes. The CPC needs AAPC dues every year; the CCS-P needs none, but its pass rate implies about two sittings. The calculator above shows the gap for the years you choose, with and without AHIMA membership.` },
    ],
    body: (h) => {
      const rows = h.E.passRates('ccsp').map((r) => [String(r.year), h.num(r.testers), h.pc(r.rate), h.num(h.E.expectedAttempts(r.rate), 2)]);
      const cp = h.E.totalCost({ id: 'ccsp', member: false, prep: 0, books: 0, years: 4 });
      const cc = h.E.totalCost({ id: 'cpc', member: true, prep: 0, books: 0, years: 4 });
      return `
<h2>CCS-P certification pass rates by year</h2>
${h.table(['Year', 'First-time testers', 'Pass rate', 'Expected sittings'], rows, `${h.num(X.certified)} CCS-P holders at the end of 2025, as AHIMA reports it.`, ['l', 'r', 'r', 'r'])}
<p>Fewer than four hundred people take it for the first time each year, against several thousand for the CCS. A small group moves the rate a lot from one year to the next.</p>

<h2>CCS-P vs CPC over four years</h2>
<p>For a non-member taking the CCS-P, four years add up to ${h.usd(cp.total)}: the exam fee times the expected sittings and two recertification fees. The CPC over the same years, with a 1-attempt voucher and AAPC dues each year, adds up to ${h.usd(cc.total)}. A CPC retake would add a voucher, and AAPC publishes no rate to estimate it. Neither total counts a course or books.</p>

<h2>Exam rules to plan for</h2>
<p>The CCS-P is taken at Pearson VUE within ${h.H.scheduleWithinDays} days of approval, with the code books on AHIMA's 2026 list. A retake needs a new application and the full fee after ${h.H.retakeWaitDays} days. AHIMA groups the competencies into five domains. The ${h.a('cpc-certification', 'CPC page')} gives the AAPC side in detail.</p>
`;
    },
  },
});
