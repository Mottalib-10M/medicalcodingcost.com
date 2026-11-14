import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';

export default definePage({
  id: 'how-to-become-a-medical-coder',
  group: 'start',
  order: 5,
  tool: { kind: 'mini:apprentice' },
  related: ['how-long-does-it-take-to-become-a-medical-coder', 'cpc-certification', 'cca-certification', 'medical-coding-programs-by-state'],
  sources: ['aapc_cpc', 'aapc_after', 'aapc_members', 'aapc_taking', 'ahima'],
  en: {
    slug: 'how-to-become-a-medical-coder',
    nav: 'Becoming a medical coder',
    card: 'The steps from first course to full credential, and the months of experience before the CPC loses its “A” (apprentice) mark.',
    title: 'Becoming a Medical Coder: Steps, Exam Costs, CPC-A Status',
    description: 'Becoming a medical coder in 2026: training, the CPC or CCA exam, AAPC membership, and the two years of experience before the apprentice “A” comes off the CPC.',
    h1: 'Becoming a medical coder: the steps, and when the “A” comes off',
    intro: `Becoming a medical coder takes a course, an exam and, for the CPC, ${P.aapc.apprentice.years} years of experience before AAPC removes the “A” for apprentice. A course of ${P.aapc.apprentice.courseHours} hours counts as ${P.aapc.apprentice.waivesYears} year. Type your experience below.`,
    resume: (h) => `The path to becoming a medical coder has four steps whatever the credential: learn the basics, learn the code sets, pass a credentialing exam, then gain experience on the job. AAPC recommends that people with less than two years of healthcare experience start with a prerequisite course in anatomy, medical terminology and pathophysiology, then a coding course. The CPC exam itself needs a current AAPC membership and a voucher, and AAPC asks candidates to book at least three weeks ahead. Pass it without ${h.A.apprentice.years} years of coding experience and the credential reads CPC-A, for apprentice. AAPC removes the A once you show the experience; a coding course of ${h.A.apprentice.courseHours} hours or more counts as ${h.A.apprentice.waivesYears} year of it, and AAPC's own CPC preparation course is accepted for that. AHIMA's CCA has no apprentice stage: it asks for a high school diploma, then the exam. Rules read on ${h.read}.`,
    faqs: (h) => [
      { q: 'What does CPC-A mean on a coder’s resume?', a: `It means the person passed the CPC exam but has not yet shown ${h.A.apprentice.years} years of coding experience to AAPC. The A stands for apprentice. AAPC describes it as a temporary step that employers respect. The exam passed is the same one; only the experience is missing, and the A comes off once that experience is shown to AAPC.` },
      { q: 'Can a course replace part of the experience for the CPC-A?', a: `Yes, one year of it. AAPC says that completing a classroom course of ${h.A.apprentice.courseHours} hours or more waives one year of experience, with a letter or certificate showing the hours. Completing AAPC's own CPC or COC preparation course online counts the same way, and AAPC verifies it without proof from you.` },
      { q: 'Do I need healthcare experience before a coding course?', a: 'Not by rule. AAPC says that without two years of healthcare experience you should begin with what it calls the essentials, anatomy, medical terminology and pathophysiology, offered as one course. With formal training in medicine or more than two years in the field, AAPC says you can skip that step and start the coding course.' },
    ],
    body: (h) => `
<h2>Becoming a medical coder in four steps</h2>
<ol>
<li><strong>Basics.</strong> Anatomy, terminology and pathophysiology, if you have not worked in healthcare for two years (AAPC's recommendation).</li>
<li><strong>Coding course.</strong> The code sets and their guidelines. AAPC says most people complete coursework and pass the exam in ${h.A.prepMonths[0]} to ${h.A.prepMonths[1]} months. The federal count of programs is on the ${h.a('medical-coding-programs-by-state', 'programs by state page')}.</li>
<li><strong>Exam.</strong> CPC: ${h.usd(h.A.voucher.core.one)} voucher and ${h.usd(h.A.membership.individual)} of dues; CCA: ${h.usd(h.H.exams.cca.member)} for an AHIMA member or ${h.usd(h.H.exams.cca.nonMember)} otherwise.</li>
<li><strong>Experience.</strong> For the CPC, ${h.A.apprentice.years} years before the A comes off, or ${h.A.apprentice.years - h.A.apprentice.waivesYears} with a course of ${h.A.apprentice.courseHours} hours or more.</li>
</ol>

<h2>The apprentice “A”, month by month</h2>
<p>The calculator counts the experience you will already have on exam day. Two cases cover most readers: someone who switches from a front-desk or billing job and already codes part of the day, and someone who starts from zero after a course. The first may pass straight to CPC; the second will hold CPC-A for twelve months after the first coding job if the course counted, twenty-four if not. The removal itself is requested from AAPC once the experience is there.</p>

<h2>What it costs to get there</h2>
<p>The fixed fees are small next to the course: ${h.usd(h.A.voucher.core.one + h.A.membership.individual)} for a CPC voucher and the first year of dues, ${h.usd(h.A.membership.renewal)} a year after that. The ${h.a('how-long-does-it-take-to-become-a-medical-coder', 'timeline page')} dates the exam from your first day of training, and the ${h.a('cpc-certification', 'CPC page')} adds the years of renewal.</p>
`,
  },
});
