import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'medical-coding-certification',
  group: 'start',
  order: 1,
  tool: { kind: 'mini:total' },
  related: ['home', 'cpc-certification', 'ccs-certification', 'medical-billing-and-coding-certification', 'medical-coding-ceu-requirements'],
  sources: ['aapc_exams', 'aapc_cpc', 'aapc_coc', 'aapc_cic', 'aapc_crc', 'aapc_members', 'ahima'],
  en: {
    slug: 'medical-coding-certification',
    nav: 'Medical coding certification',
    card: 'The eight coding credentials of AAPC and AHIMA, who each one is for, and its full cost from the exam on.',
    title: 'Medical Coding Certification: Which One and From Whom',
    description: 'Medical coding certification in 2026: the CPC, COC, CIC, CRC, CCA, CCS and CCS-P, who issues each one, what it is for, and its total cost from exam to renewal.',
    h1: 'Medical coding certification: which one, from whom, at what cost',
    intro: `A medical coding certification comes from AAPC or AHIMA, two private associations, and costs ${money(P.ahima.exams.cca.member)} to ${money(P.aapc.voucher.core.two)} for the exam alone. Pick a credential below to add membership, renewals and your course.`,
    resume: (h) => `Two private associations, AAPC and AHIMA, issue the medical coding credentials covered here. AAPC offers the Certified Professional Coder (CPC) for physician offices and outpatient services, the Certified Outpatient Coder (COC) for hospital outpatient departments, the Certified Inpatient Coder (CIC) for hospital stays, the Certified Risk Adjustment Coder (CRC) for health plans, and the Certified Professional Biller (CPB) for billing. AHIMA offers the Certified Coding Associate (CCA) for early-career coders, the Certified Coding Specialist (CCS) for inpatient and outpatient records, and the CCS-P for physician practices. AAPC charges ${h.usd(h.A.voucher.core.one)} per exam voucher and ${h.usd(h.A.membership.individual)} a year of membership; AHIMA charges ${h.usd(h.H.exams.cca.member)} to ${h.usd(h.H.exams.ccs.nonMember)} per sitting and a recertification fee every two years. The calculator adds every line for the credential you pick, as read on ${h.read}.`,
    faqs: (h) => [
      { q: 'Which medical coding certification should a beginner take?', a: `Pick by where you want to work: start with the CPC from AAPC for doctor offices, or the CCA from AHIMA for hospitals, as it leads to the CCS, AHIMA's hospital credential. The CPC, passed without two years of experience, it carries an “A” for apprentice until the experience is shown. AHIMA's CCA asks only a high school diploma to sit. Both are national credentials. Job ads in your area tell you which one local employers name most.` },
      { q: 'Are AAPC and AHIMA credentials both recognized?', a: `Both associations are national, and neither is a government body. AAPC aims its CPC at physician and outpatient services, AHIMA aims its CCS at inpatient and outpatient records, and each body has a credential for the other setting. A coder who holds one credential from each pays two sets of dues or fees and follows two renewal rules.` },
      { q: 'Can I hold several coding credentials at once?', a: `Yes. AAPC credentials share one yearly membership. AHIMA charges its recertification fee for the main credential and ${h.usd(h.H.recert.nonMemberExtra)} more per extra credential for non-members, ${h.usd(h.H.recert.memberExtra)} for members, every two years. When you earn the CCS, it replaces the CCA, so only one of the two is renewed.` },
    ],
    body: (h) => {
      const rows = h.E.CREDS.map((c) => [`<strong>${c.code}</strong>, ${c.name}`, c.body, c.setting, c.minutes ? h.hm(c.minutes) : 'see AAPC']);
      return `
<h2>The eight medical coding certifications at a glance</h2>
<p>Each credential targets a work setting. The exam time is the one the body publishes; AAPC gives four hours for most of its exams and names the CPB and the CIC among them.</p>
${h.table(['Credential', 'Body', 'Work setting', 'Exam time'], rows, `Read on AAPC and AHIMA pages, ${h.read}.`, ['l', 'l', 'l', 'l'])}
<p>RHIT, also from AHIMA, is a health information technician credential that needs an accredited associate degree in health information management: it is not a coding credential as such, but its pass rates are shown on the ${h.a('medical-coding-pass-rates', 'pass rate page')} for comparison.</p>

<h2>What you pay, and to whom</h2>
<p>AAPC sells an exam voucher that you buy before booking: ${h.usd(h.A.voucher.core.one)} for one attempt or ${h.usd(h.A.voucher.core.two)} for two, the same for its core exams, valid ${h.A.voucherValidMonths} months and not refundable. You must be a member to sit the exam and to keep the credential. AHIMA charges a fee per application, lower for members, and a retake is a new application at the same fee after a ${h.H.retakeWaitDays}-day wait.</p>
${h.box('No salary on this site', '<p>This site does not show pay figures: it covers what you spend, and only from the pages where the fees are set.</p>')}

<h2>How to choose between them</h2>
<p>Start from where you want to work. A clinic or physician group points to the CPC or the CCS-P; a hospital outpatient department to the COC or the CCS; inpatient coding to the CIC or the CCS. New to coding, start with the CPC for doctor offices, or the CCA for hospitals, as it leads to the CCS. Then compare what each costs over the years you expect to keep it on the ${h.a('home', 'comparator')}, and read the ${h.a('cpc-certification', 'CPC')} and ${h.a('ccs-certification', 'CCS')} pages for the rules of each body.</p>
`;
    },
  },
});
