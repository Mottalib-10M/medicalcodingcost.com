import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

const A = P.aapc, H = P.ahima;
export default definePage({
  id: 'medical-coding-ceu-requirements',
  group: 'keep',
  order: 30,
  tool: { kind: 'mini:renewal' },
  related: ['cpc-certification', 'ccs-certification', 'medical-coding-certification', 'medical-coding-exam-rescheduling'],
  sources: ['aapc_after', 'aapc_members', 'ahima'],
  en: {
    slug: 'medical-coding-ceu-requirements',
    nav: 'CEUs and renewal',
    card: 'Continuing education units and renewal fees after the exam: AAPC dues every year, AHIMA fees every two years.',
    title: 'Medical Coding CEU Requirements: AAPC and AHIMA Renewal',
    description: `Medical coding CEU requirements in 2026: ${A.ceu.perCycle} CEUs every 2 years and ${money(A.membership.renewal)} of dues a year for AAPC, ${H.recert.ceus.ccs} CEUs and ${money(H.recert.nonMember)} for AHIMA, and what a late renewal costs.`,
    h1: 'Medical coding CEU requirements and renewal fees',
    intro: `Medical coding CEU requirements: AAPC asks for ${A.ceu.perCycle} continuing education units every ${A.ceu.cycleYears} years plus ${money(A.membership.renewal)} of dues each year; AHIMA asks for ${H.recert.ceus.ccs} every ${H.recert.cycleYears} years plus a fee. Pick a credential to add up the years ahead.`,
    resume: (h) => `A coding credential stays valid only if you keep proving you are current. Both bodies count this in continuing education units (CEUs), earned through webinars, courses, conferences and similar activities they approve, and both work in two-year cycles. AAPC ties the credential to membership: to keep a CPC you pay the yearly membership, ${h.usd(A.membership.renewal)} for an individual, and earn ${A.ceu.perCycle} CEUs every ${A.ceu.cycleYears} years. AHIMA keeps the two apart: membership is optional, and every ${H.recert.cycleYears} years you enter ${H.recert.ceus.ccs} CEUs for a CCA, CCS or CCS-P in its CEU Center and pay a recertification fee of ${h.usd(H.recert.member)} as a member or ${h.usd(H.recert.nonMember)} otherwise. Each extra AHIMA credential adds ten CEUs and ${h.usd(H.recert.memberExtra)} or ${h.usd(H.recert.nonMemberExtra)}. Over five or ten years these lines usually cost more than the exam. AAPC rules from aapc.com, read ${h.read}; ${h.ahima('Recertification Guide')}.`,
    faqs: (h) => [
      { q: 'What happens if I miss the AHIMA recertification deadline?', a: `The credential goes inactive for six months and cannot be used. To return to active status you meet the original requirements and pay an extension fee of ${h.usd(H.recert.extension)} per credential. After that the credential is temporarily revoked, and reinstatement costs ${h.usd(H.recert.reinstatement)}, according to AHIMA's Recertification Guide.` },
      { q: 'How are AHIMA CEUs counted for a webinar?', a: 'AHIMA counts clock hours: half a CEU for every thirty minutes of attendance or participation, and a session shorter than thirty minutes earns nothing. CEUs must be earned inside the two-year cycle and be relevant to health information, and they must all be entered in the CEU Center before the fee is paid.' },
      { q: 'Does passing another AHIMA exam count toward my CEUs?', a: `Yes, once. AHIMA's guide gives ${H.recert.ceuPerAdditionalCert} CEUs for obtaining an additional AHIMA certification, on passing the exam. The new credential then brings its own requirement: ten more CEUs per cycle and the extra recertification fee, ${h.usd(H.recert.memberExtra)} for members or ${h.usd(H.recert.nonMemberExtra)} for others.` },
      { q: 'What does it cost to renew an AAPC membership late?', a: `AAPC says a renewal paid after the expiration date is subject to additional fees, without giving the amount on the pages we read. The individual renewal is ${h.usd(A.membership.renewal)} a year if paid on time, and AAPC also offers a plan in two payments of ${h.usd(A.membership.plan2[0])}.` },
    ],
    body: (h) => {
      const yrs = [2, 4, 6, 10];
      const rows = yrs.map((y) => {
        const c = h.E.renewal('cpc', { member: true, years: y });
        const n = h.E.renewal('ccs', { member: false, years: y });
        const m = h.E.renewal('ccs', { member: true, years: y });
        return [`${y} ${y === 1 ? 'year' : 'years'}`, h.usd(c.total), h.usd(n.total), h.usd(m.total)];
      });
      return `
<h2>Medical coding CEU requirements side by side</h2>
${h.table(['Rule', 'AAPC (CPC and other credentials)', 'AHIMA (CCA, CCS, CCS-P)'], [
  ['Cycle', `${A.ceu.cycleYears} years`, `${H.recert.cycleYears} years`],
  ['CEUs for one credential', String(A.ceu.perCycle), String(H.recert.ceus.ccs)],
  ['Each extra credential', 'See AAPC’s CEU rules', '10 more CEUs, up to 50 in all'],
  ['Membership', `${h.usd(A.membership.renewal)} a year, required`, `${h.usd(H.membership.professional)} a year, optional`],
  ['Fee each cycle', 'None beyond dues', `${h.usd(H.recert.member)} member, ${h.usd(H.recert.nonMember)} non-member`],
], 'AAPC: certification and membership pages; AHIMA: Recertification Guide.', ['l', 'l', 'l'])}

<h2>Renewal cost after the exam</h2>
<p>The table counts only what comes after the exam year: AAPC dues every year, AHIMA fees once per full cycle, and AHIMA dues only in the member column. CEUs can cost nothing if you use free webinars, or a lot if you buy conferences; they are not counted.</p>
${h.table(['Years after the exam', 'CPC, AAPC dues', 'CCS, non-member', 'CCS, AHIMA member'], rows, 'Individual AAPC renewal rate; AHIMA Professional dues.', ['l', 'r', 'r', 'r'])}

<h2>Where the order changes</h2>
<p>An AHIMA credential kept without membership is the cheapest to renew: ${h.usd(H.recert.nonMember)} every two years. AAPC's yearly dues make the CPC cost more to keep, but they also bring member prices on books and exams. The ${h.a('medical-coding-certification', 'total cost page')} puts the exam and the renewal in one figure.</p>
`;
    },
  },
});
