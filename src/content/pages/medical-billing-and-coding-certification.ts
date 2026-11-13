import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'medical-billing-and-coding-certification',
  group: 'start',
  order: 2,
  tool: { kind: 'mini:billcode' },
  related: ['medical-billing-and-coding', 'cpc-certification', 'cpc-exam-cost', 'medical-coding-certification'],
  sources: ['aapc_cpb', 'aapc_cpc', 'aapc_exams', 'aapc_members', 'aapc_taking'],
  en: {
    slug: 'medical-billing-and-coding-certification',
    nav: 'Billing and coding certification',
    card: 'CPC for coding, CPB for billing, or both under one AAPC membership: what each route costs.',
    title: 'Medical Billing and Coding Certification: CPC, CPB or Both',
    description: 'Medical billing and coding certification in 2026: the CPC for coding, the CPB for billing, or both under one AAPC membership, with vouchers, dues and renewal.',
    h1: 'Medical billing and coding certification: CPC, CPB or both',
    intro: `A medical billing and coding certification usually means AAPC's CPC (coding) or CPB (billing). Each exam voucher costs ${money(P.aapc.voucher.core.one)}, and one ${money(P.aapc.membership.individual)} membership covers both. Pick a route below.`,
    resume: (h) => `“Billing and coding” is one phrase in school brochures, but two jobs and two credentials at AAPC. The Certified Professional Coder (CPC) proves you can turn a record into diagnosis and procedure codes; the Certified Professional Biller (CPB) shows you can manage the full billing cycle, from clean claims to denials, in AAPC's words. Both are core AAPC exams, sold at the same voucher price, ${h.usd(h.A.voucher.core.one)} for one attempt or ${h.usd(h.A.voucher.core.two)} for two, both last four hours, and both need a current AAPC membership to sit and to keep. AAPC does not require the CPC to sit the CPB, or the reverse: the CPB is a stand-alone credential. Someone who wants both pays two vouchers but one membership, ${h.usd(h.A.membership.individual)} a year. AHIMA has no billing credential, and NHA's billing and coding credential could not be costed because its site refused our reading. Fees read on ${h.read}.`,
    faqs: (h) => [
      { q: 'Is there one exam for both medical billing and coding?', a: `Not at AAPC. Coding is tested by the CPC and billing by the CPB, two separate exams with separate vouchers. AAPC sells a combined CPC and CPB training path, but each credential still has its own exam. Expect ${h.usd(2 * h.A.voucher.core.one)} for two one-attempt vouchers, plus the membership that both require.` },
      { q: 'Does the CPB require the CPC first?', a: 'No. AAPC lists the CPB among its stand-alone certifications, with no requirement to hold the CPC. AAPC recommends billing experience or its recommended courses before the exam, and a current membership is required to sit, as for every AAPC exam. Many candidates take the CPB alone when their job is claims and payments rather than code assignment.' },
      { q: 'How many CEUs do I need with both the CPC and the CPB?', a: `For one credential AAPC asks ${h.A.ceu.perCycle} CEUs every ${h.A.ceu.cycleYears} years. AAPC's rule for members who hold several credentials was not on the pages we read, so the calculator does not count extra CEUs for a second credential. Ask AAPC before you plan your continuing education, because the count depends on the credentials you hold.` },
    ],
    body: (h) => `
<h2>Medical billing and coding certification: the two AAPC exams</h2>
<p>The CPC tests code assignment across ${h.A.cpc.questions} questions in ${h.hm(h.A.cpc.minutes)}; you pass with ${h.A.cpc.passCorrect} right answers. AAPC places the CPB among the exams that last four hours but have a different number of questions, and it does not publish that number on the pages we read. Both use the same voucher, valid ${h.A.voucherValidMonths} months from purchase.</p>
${h.table(['Route', 'Vouchers (1 attempt)', 'First-year dues', 'Year two'], [['CPC only', h.usd(h.A.voucher.core.one), h.usd(h.A.membership.individual), h.usd(h.A.membership.renewal)], ['CPB only', h.usd(h.A.voucher.core.one), h.usd(h.A.membership.individual), h.usd(h.A.membership.renewal)], ['CPC and CPB', h.usd(2 * h.A.voucher.core.one), h.usd(h.A.membership.individual), h.usd(h.A.membership.renewal)]], `AAPC voucher prices and individual dues, read ${h.read}.`, ['l', 'r', 'r', 'r'])}

<h2>Student prices</h2>
<p>AAPC lists student exam pricing of ${h.usd(h.A.voucher.student.one)} for one attempt and ${h.usd(h.A.voucher.student.two)} for two, and student dues of ${h.usd(h.A.membership.student)} for a new member enrolled in an AAPC course or in a course of one of its approved partners. A student who takes both exams saves ${h.usd(2 * (h.A.voucher.core.one - h.A.voucher.student.one))} on two vouchers and ${h.usd(h.A.membership.individual - h.A.membership.student)} on the first year of dues. Ask AAPC whether your course qualifies before you buy.</p>

<h2>Where billing and coding differ in practice</h2>
<p>A coder reads documentation and assigns codes; a biller turns codes into a claim, checks it against the payer's rules, posts payments and works denials. Small practices often ask one person to do both, which is why schools sell them together. Larger organizations split the roles. The ${h.a('medical-billing-and-coding', 'billing and coding page')} matches each job to its credential, and the ${h.a('cpc-exam-cost', 'CPC exam cost page')} says when a 2-attempt voucher is worth it.</p>
`,
  },
});
