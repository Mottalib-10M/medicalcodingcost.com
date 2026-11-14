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
    intro: `CCS-P certification costs ${money(X.member)} per sitting for AHIMA members and ${money(X.nonMember)} for others, but only ${pct(last[2])} of first-time testers passed in ${last[0]}. The calculator compares it with the CPC (Certified Professional Coder) over 2 years, the exam taken once, no course, as on every page.`,
    resume: (h) => `The Certified Coding Specialist, Physician-based (CCS-P) is AHIMA's credential for coders in physician offices, group practices, multi-specialty clinics and specialty centers, much of the ground the AAPC CPC also covers. AHIMA recommends, without requiring it, coursework plus one year of experience, two years of multi-specialty coding, the CCA plus one year, or another body's coding credential plus one year. The exam has ${h.num(X.items)} questions, ${h.num(X.scored)} of them scored, in ${h.hm(X.minutes)}. A sitting costs ${h.usd(X.member)} for members and ${h.usd(X.nonMember)} for others. It has the lowest first-time pass rate AHIMA publishes for a coding exam: ${h.pc(X.rates[0][2])} in ${X.rates[0][0]} and ${h.pc(last[2])} in ${last[0]}, so ${h.num(Math.round((1 - last[2]) * 100))} in 100 first-time testers had to take it again. Renewal takes ${h.H.recert.ceus.ccsp} CEUs every ${h.H.recert.cycleYears} years. ${h.ahima('CCS-P certification page')}; CPC figures from aapc.com, read the same day.`,
    faqs: (h) => [
      { q: 'Why is the CCS-P pass rate so low?', a: `AHIMA publishes the rate but not the reasons. The numbers are small, ${h.num(last[1])} first-time testers in ${last[0]}, and AHIMA recommends multi-specialty experience before the exam. At ${h.pc(last[2])}, a candidate with average results should budget about two sittings, which doubles the exam line of the total.` },
      { q: 'Can I hold both the CCS and the CCS-P?', a: `Yes. They are separate credentials and the CCS-P does not replace the CCS. Holding both means ${h.H.recert.ceus.ccs} CEUs for the first plus ten more for the second each cycle, and an extra recertification fee of ${h.usd(h.H.recert.memberExtra)} for members or ${h.usd(h.H.recert.nonMemberExtra)} for others.` },
      { q: 'Is the CCS-P or the CPC cheaper over two years?', a: (() => { const one = h.E.compareTwo('ccsp', 'cpc', h.E.DEFAULTS); const two = h.E.compareTwo('ccsp', 'cpc', { ...h.E.DEFAULTS, sittings: 2 }); const who = (r: typeof one) => (r.cheaper === 'ccsp' ? 'the CCS-P costs less' : r.cheaper === 'cpc' ? 'the CPC costs less' : 'both cost the same'); return `Counted the same way on both sides, over two years with no course and as an AHIMA non-member: taken once, ${who(one)}, ${h.usd(one.a.total)} for the CCS-P against ${h.usd(one.b.total)} for the CPC; with one retake each, ${who(two)}, ${h.usd(two.a.total)} against ${h.usd(two.b.total)}. The CPC needs AAPC dues every year; the CCS-P needs none, but its low pass rate makes the retake case the one to budget. The calculator above changes the years and membership.`; })() },
    ],
    body: (h) => {
      const rows = h.E.passRates('ccsp').map((r) => [String(r.year), h.num(r.testers), h.pc(r.rate), `${h.num(Math.round((1 - r.rate) * 100))} in 100`]);
      const one = h.E.compareTwo('ccsp', 'cpc', h.E.DEFAULTS);
      const two = h.E.compareTwo('ccsp', 'cpc', { ...h.E.DEFAULTS, sittings: 2 });
      return `
<h2>CCS-P certification pass rates by year</h2>
${h.table(['Year', 'First-time testers', 'Pass rate', 'Failed the first time'], rows, `${h.num(X.certified)} CCS-P holders at the end of 2025, as AHIMA reports it.`, ['l', 'r', 'r', 'r'])}
<p>Fewer than four hundred people take it for the first time each year, against several thousand for the CCS. A small group moves the rate a lot from one year to the next.</p>

<h2>CCS-P vs CPC over two years</h2>
<p>Both are counted the same way as everywhere on this site: two years, the same number of tries at the exam, no course and no books. Taking the exam once, a non-member pays ${h.usd(one.a.total)} for the CCS-P (the exam fee and one recertification fee) and ${h.usd(one.b.total)} for the CPC (a 1-attempt voucher and two years of AAPC dues). With one retake each, the CCS-P costs ${h.usd(two.a.total)} (two exam fees and the recertification fee) and the CPC ${h.usd(two.b.total)} (the 2-attempt voucher and the dues). AHIMA's ${last[0]} pass rate of ${h.pc(last[2])} makes the retake case the safer budget for the CCS-P; AAPC publishes no rate for the CPC.</p>

<h2>Exam rules to plan for</h2>
<p>The CCS-P is taken at Pearson VUE within ${h.H.scheduleWithinDays} days of approval, with the code books on AHIMA's 2026 list. A retake needs a new application and the full fee after ${h.H.retakeWaitDays} days. AHIMA groups the competencies into five domains. The ${h.a('cpc-certification', 'CPC page')} gives the AAPC side in detail.</p>
`;
    },
  },
});
