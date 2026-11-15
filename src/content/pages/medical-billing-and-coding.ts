import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'medical-billing-and-coding',
  group: 'start',
  order: 3,
  tool: { kind: 'mini:chooser' },
  related: ['medical-billing-and-coding-certification', 'how-to-become-a-medical-coder', 'medical-coding-programs-by-state', 'cca-certification'],
  sources: ['aapc_cpc', 'aapc_coc', 'aapc_cic', 'aapc_crc', 'aapc_cpb', 'ahima'],
  en: {
    slug: 'medical-billing-and-coding',
    nav: 'Billing and coding jobs',
    card: 'Six kinds of billing and coding work, and the credential each one points to, with its exam fee.',
    title: 'Medical Billing and Coding: Which Credential for Which Job',
    description: 'Medical billing and coding work in six settings, from physician offices to hospitals and health plans: the AAPC or AHIMA credential each asks for, and its fee.',
    h1: 'Medical billing and coding: which credential for which job',
    intro: `Medical billing and coding covers six kinds of work, each with its own credential. Exam fees run from ${money(P.ahima.exams.cca.member)} to ${money(P.aapc.voucher.core.one)} for one attempt. New to coding? Start with the CPC for doctor offices, or the CCA for hospitals, as it leads to the CCS. Pick the work you want below.`,
    resume: (h) => `Coding and billing are two halves of the same money trail. A coder reads what the provider documented and assigns standard codes for diagnoses, procedures and supplies; a biller puts those codes on a claim, sends it to the payer and follows it until it is paid or denied. The credential that fits depends less on that split than on where you work: a physician office uses professional codes, a hospital uses facility codes, and a health plan reviews risk adjustment codes. AAPC has a credential for each setting (CPC, COC, CIC, CRC) and one for billing (CPB); AHIMA has the CCA to start and the CCS and CCS-P for experienced coders. The tool below matches each kind of work to the credentials AAPC and AHIMA aim at it, with the fee read on ${h.read}. The rest of the site then adds dues, retakes and renewal.`,
    faqs: (h) => [
      { q: 'Is medical billing or medical coding the better place to start?', a: `That depends on the job you can get locally, not on the credential. Coding has more credentials and more settings; billing has one AAPC credential, the CPB. Both exams cost ${h.usd(h.A.voucher.core.one)} for a one-attempt voucher and both need AAPC membership. Read local job ads first: they say which credential employers ask for.` },
      { q: 'Do medical billing and coding jobs need a license?', a: 'This site does not cover state rules. The credentials described here are issued by private national associations, AAPC and AHIMA, not by a state board. Whether an employer requires one is its own choice; job ads usually say so. Check with the employer or your state if a job mentions any license or registration.' },
      { q: 'What does a risk adjustment coder do differently?', a: `A risk adjustment coder reviews records for the diagnosis codes that health plans use to set payment for chronic and complex conditions. AAPC's credential for that work is the CRC, a core exam at ${h.usd(h.A.voucher.core.one)} for one attempt, with the same membership and the same ${h.A.ceu.perCycle} CEUs every ${h.A.ceu.cycleYears} years as the CPC.` },
    ],
    body: (h) => {
      const rows = [
        ['Physician office or clinic', 'CPC (AAPC)', 'CCS-P (AHIMA)'],
        ['Hospital outpatient department', 'COC (AAPC)', 'CCS (AHIMA)'],
        ['Hospital inpatient stays', 'CIC (AAPC)', 'CCS (AHIMA)'],
        ['Billing, claims and denials', 'CPB (AAPC)', 'none'],
        ['Risk adjustment for health plans', 'CRC (AAPC)', 'none'],
        ['First job, no experience yet', 'CPC for doctor offices, with “A” for apprentice', 'CCA for hospitals, leads to the CCS'],
      ];
      return `
<h2>Medical billing and coding settings and their credentials</h2>
<p>Each body describes who its credential is for. The table puts those descriptions side by side; it is a reading of AAPC and AHIMA pages, not a ranking.</p>
${h.table(['Kind of work', 'AAPC credential', 'AHIMA credential'], rows, `From the certification pages of AAPC and AHIMA, read ${h.read}.`, ['l', 'l', 'l'])}

<h2>What the first year costs in each case</h2>
<p>With AAPC, any of its core credentials costs a ${h.usd(h.A.voucher.core.one)} voucher plus ${h.usd(h.A.membership.individual)} of dues the first year. With AHIMA, the CCA costs ${h.usd(h.H.exams.cca.member)} for a member or ${h.usd(h.H.exams.cca.nonMember)} for a non-member, and the CCS and CCS-P ${h.usd(h.H.exams.ccs.member)} or ${h.usd(h.H.exams.ccs.nonMember)}. A course comes on top. The ${h.a('home', 'comparator')} puts two credentials side by side over several years.</p>

<h2>Training before the exam</h2>
<p>On the pages we read, neither body asks for a college degree for its coding exams: AHIMA's CCA asks for a high school diploma, and only its RHIT, a health information credential, needs an accredited associate degree. AAPC recommends its prerequisite course in anatomy, terminology and pathophysiology to those without two years of healthcare experience. The federal count of coding certificates and degrees awarded in each state is on the ${h.a('medical-coding-programs-by-state', 'programs by state page')}, and the ${h.a('how-to-become-a-medical-coder', 'steps to become a coder')} page dates each step.</p>
`;
    },
  },
});
