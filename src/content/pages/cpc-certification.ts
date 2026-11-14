import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'cpc-certification',
  group: 'aapc',
  order: 10,
  tool: { kind: 'mini:cpc-cost' },
  related: ['cpc-exam', 'cpc-exam-cost', 'medical-coding-ceu-requirements', 'ccs-p-certification', 'medical-coding-code-books'],
  sources: ['aapc_cpc', 'aapc_after', 'aapc_members', 'aapc_taking', 'aapc_exams'],
  en: {
    slug: 'cpc-certification',
    nav: 'CPC certification',
    card: 'What AAPC asks to earn and keep the CPC: membership, exam voucher, CEUs, and the apprentice stage.',
    title: 'CPC Certification: Requirements, Dues and CEUs in 2026',
    description: `CPC certification in 2026: what AAPC asks to sit the exam and keep the credential, membership dues, vouchers, ${P.aapc.ceu.perCycle} CEUs every two years and the CPC-A stage.`,
    h1: 'CPC certification: what AAPC asks to earn it and keep it',
    intro: `CPC certification costs a ${money(P.aapc.voucher.core.one)} exam voucher and AAPC membership, ${money(P.aapc.membership.individual)} a year, which you keep paying to hold the credential, with ${P.aapc.ceu.perCycle} CEUs every ${P.aapc.ceu.cycleYears} years. Over 2 years, taken once with no course, that is ${money(P.aapc.voucher.core.one + P.aapc.membership.individual + P.aapc.membership.renewal)}, the same as on the home page.`,
    resume: (h) => `The Certified Professional Coder (CPC) is AAPC's credential for coding physician and outpatient services, and the one AAPC calls the best place to start a coding career. To sit the exam, AAPC lists four basic requirements: a current AAPC membership, a current email and valid address on file, a valid unused exam voucher, and a government-issued photo ID whose names match the exam confirmation exactly. The voucher costs ${h.usd(h.A.voucher.core.one)} for one attempt or ${h.usd(h.A.voucher.core.two)} for two, and is valid for ${h.A.voucherValidMonths} months. Once you pass, the credential stays active as long as you keep your AAPC membership, ${h.usd(h.A.membership.renewal)} a year for an individual, and earn ${h.A.ceu.perCycle} continuing education units every ${h.A.ceu.cycleYears} years. Without ${h.A.apprentice.years} years of coding experience, it reads CPC-A, the A meaning apprentice, until the experience is shown. AAPC rules and prices read on ${h.read}.`,
    faqs: (h) => [
      { q: 'What happens to my CPC if I stop paying AAPC dues?', a: `AAPC ties the credential to membership: to maintain it you must keep your annual membership and earn your CEUs. AAPC says a renewal paid after the expiration date is subject to additional fees, and that it contacts members before, but that renewing on time is the member's responsibility. A two- or three-month payment plan exists for US members, by phone.` },
      { q: 'Can I pay the AAPC renewal in installments?', a: `Yes, for individual renewals of US members, arranged by phone and paid by card: two payments of ${h.usd(h.A.membership.plan2[0], 2)}, or three payments of about ${h.usd(h.A.membership.renewal / 3)}, before or during the renewal month. Sales tax, if any, is added to the first payment. Once set up, the dates and the card cannot be changed.` },
      { q: 'Is the CPC recognized outside physician offices?', a: 'AAPC presents the CPC as recognized by physicians, payers and government agencies, and as the base for its specialty and facility credentials. For hospital outpatient work AAPC has the COC, and for inpatient work the CIC, each with its own exam at the same voucher price. A CPC holder can add one without a second membership.' },
    ],
    body: (h) => `
<h2>CPC certification requirements, as AAPC lists them</h2>
<ul>
<li><strong>Membership.</strong> Current AAPC membership: ${h.usd(h.A.membership.individual)} for an individual, ${h.usd(h.A.membership.student)} for a new member enrolled in an AAPC course.</li>
<li><strong>Voucher.</strong> A valid, unused exam voucher, bought from your AAPC account; you then choose print books or eBooks and schedule within the year.</li>
<li><strong>Identity.</strong> A government-issued photo ID; first and last names must match the exam confirmation exactly. Temporary, paper or digital IDs are refused.</li>
<li><strong>Knowledge.</strong> No experience is required to sit, but AAPC says the exam needs solid medical terminology and anatomy, and offers prerequisite courses.</li>
</ul>

<h2>Keeping the CPC</h2>
<p>Every year: membership. Every two years: ${h.A.ceu.perCycle} CEUs. AAPC grants CEUs for its own courses once you are certified, for example 40 CEUs for its CPC preparation course, but issues none before certification. The ${h.a('medical-coding-ceu-requirements', 'renewal page')} compares this with AHIMA's rules.</p>
${h.table(['Years you hold the CPC', 'Exam and dues', 'CEUs due by then (36 every 2 years)'], [1, 2, 3, 4, 5].map((y) => [`After ${y} year${y === 1 ? '' : 's'}`, h.usd(h.E.totalCost({ id: 'cpc', member: true, prep: 0, books: 0, years: y }).total), String(h.E.renewal('cpc', { member: true, years: y }).ceus)]), 'One-attempt voucher, individual dues, no course or books.', ['l', 'r', 'r'])}

<h2>The CPC-A stage</h2>
<p>Pass without ${h.A.apprentice.years} years of coding experience and the credential carries an A, for apprentice (CPC-A), until AAPC removes it on proof of experience. A course of ${h.A.apprentice.courseHours} hours or more waives one of the two years. The ${h.a('how-to-become-a-medical-coder', 'steps page')} counts the months left, and the ${h.a('cpc-exam', 'CPC exam page')} breaks down the ${h.A.cpc.questions} questions.</p>
`,
  },
});
