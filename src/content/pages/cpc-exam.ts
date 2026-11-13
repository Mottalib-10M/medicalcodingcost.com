import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';

export default definePage({
  id: 'cpc-exam',
  group: 'aapc',
  order: 11,
  tool: { kind: 'mini:pace' },
  related: ['medical-coding-practice-test', 'cpc-exam-cost', 'medical-coding-code-books', 'cpc-certification'],
  sources: ['aapc_taking', 'aapc_exams', 'aapc_cpc'],
  en: {
    slug: 'cpc-exam',
    nav: 'CPC exam format',
    card: 'The CPC exam in numbers: questions per area, four hours, 70 right answers to pass, books allowed.',
    title: `CPC Exam: ${P.aapc.cpc.questions} Questions, 4 Hours, ${P.aapc.cpc.passCorrect} to Pass, by Area`,
    description: `CPC exam format in 2026: ${P.aapc.cpc.questions} multiple-choice questions in four hours, ${P.aapc.cpc.passCorrect} right answers to pass, questions per area, approved books and time per question.`,
    h1: 'CPC exam: questions per area, time and the passing line',
    intro: `The CPC exam has ${P.aapc.cpc.questions} multiple-choice questions in four hours, and you pass with ${P.aapc.cpc.passCorrect} right answers. That is ${(P.aapc.cpc.minutes / P.aapc.cpc.questions).toFixed(1)} minutes a question before any review. Set the minutes you want to keep for review below.`,
    resume: (h) => `The CPC exam is taken in one sitting of ${h.hm(h.A.cpc.minutes)}, at home with a live remote proctor or at a Meazure Learning testing center, and has ${h.A.cpc.questions} multiple-choice questions. AAPC sets the passing line at ${h.pc(h.A.cpc.passShare)}: ${h.A.cpc.passCorrect} right answers, so more than ${h.A.cpc.questions - h.A.cpc.passCorrect} wrong answers is a fail. The questions cover ${h.A.cpc.areas.length} areas, from terminology and anatomy to each series of procedure codes and ten coding cases, and AAPC publishes how many questions each area has. Candidates bring the approved code books: the AMA's CPT Professional Edition and their choice of ICD-10-CM and HCPCS Level II books, from the current or the previous year, one copy of each. Handwritten notes are allowed in print books if they relate to daily coding; long passages are not. Results come in ${h.A.resultsBusinessDays[0]} to ${h.A.resultsBusinessDays[1]} business days, with the weak areas named if you fail. Format read on ${h.read}.`,
    faqs: (h) => [
      { q: 'How many questions can I miss on the CPC exam?', a: `${h.A.cpc.questions - h.A.cpc.passCorrect}. The CPC has ${h.A.cpc.questions} questions and AAPC requires ${h.A.cpc.passCorrect} right answers, a score of ${h.pc(h.A.cpc.passShare)}. AAPC advises answering every question, since a guess has a one-in-four chance and a blank has none. If you fail, the result names the areas where you were weakest.` },
      { q: 'Can I use eBooks on the CPC exam?', a: 'Yes, if you choose them when you redeem the voucher. With eBooks you use a shared library of the approved references and its search function, but your own notes and tabs are not available. With print books you may tab pages and write short notes that relate to daily coding; questions copied from study guides are not allowed.' },
      { q: 'Which year’s code books are allowed on the CPC?', a: 'The current year or the previous year, or a mix of both, with one copy of each book. Books older than one year and next year’s books are refused. AAPC strongly suggests current-year books because the code sets change every year, and a second attempt taken in the next calendar year uses that year’s exam.' },
    ],
    body: (h) => {
      const rows = h.A.cpc.areas.map(([n, q]) => [n as string, q as number]);
      return `
<h2>CPC exam questions by area</h2>
<p>AAPC publishes the number of questions in each area of the ${h.A.cpc.questions}-question exam. The procedure code series count for ${6 * 6} questions together, and the ten cases ask one question each.</p>
${h.table(['Area', 'Questions'], rows, `“Breakdown of the 100-question CPC exam”, AAPC, read ${h.read}.`, ['l', 'r'])}

<h2>Pacing the four hours</h2>
<p>Four hours for ${h.A.cpc.questions} questions is ${h.num(h.A.cpc.minutes / h.A.cpc.questions, 1)} minutes each. AAPC's own advice is to read the answer choices before the question, to leave the hardest for last and to answer everything. Keeping twenty minutes for review brings the pace to ${h.num((h.A.cpc.minutes - 20) / h.A.cpc.questions, 1)} minutes. The calculator also gives the pace of AHIMA's CCA, CCS and CCS-P, which mix unscored questions into the count and report a scaled score instead of a number of right answers.</p>

<h2>Exam day</h2>
<p>Bring a valid photo ID whose names match the confirmation exactly; temporary or digital IDs are refused. A remote exam needs a system check first. The CPC is not given during AAPC's year-end blackout, from December ${h.A.blackout.startDay} to ${h.A.blackout.resumes}. To test your level before booking, use the ${h.a('medical-coding-practice-test', 'practice test page')}; for the price of a second sitting, the ${h.a('cpc-exam-cost', 'voucher page')}.</p>
`;
    },
  },
});
