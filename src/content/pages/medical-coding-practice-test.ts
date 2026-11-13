import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';

export default definePage({
  id: 'medical-coding-practice-test',
  group: 'aapc',
  order: 13,
  tool: { kind: 'mini:practice' },
  related: ['cpc-exam', 'cpc-exam-cost', 'medical-coding-pass-rates', 'medical-coding-code-books'],
  sources: ['aapc_taking', 'aapc_exams', 'ahima'],
  en: {
    slug: 'medical-coding-practice-test',
    nav: 'Practice test score',
    card: 'Set a practice test score against the CPC passing line, and read AHIMA practice exams the right way.',
    title: 'Medical Coding Practice Test: Score You Need and Pacing',
    description: `Medical coding practice test results read against the real line: ${P.aapc.cpc.passCorrect} of ${P.aapc.cpc.questions} on the CPC, a scaled ${P.ahima.passScore} on AHIMA exams, and how to time a full practice run.`,
    h1: 'Medical coding practice test: is your score enough?',
    intro: `A medical coding practice test tells you something only next to the real line: ${P.aapc.cpc.passCorrect} right answers out of ${P.aapc.cpc.questions} on the CPC. Type your practice score below to see the gap, on a 100-question scale.`,
    resume: (h) => `Practice tests for medical coding exams are sold by the credentialing bodies and by course publishers, and none of them is the real exam. What makes a practice score useful is the line it is read against. For the CPC that line is public and simple: ${h.A.cpc.passCorrect} right answers out of ${h.A.cpc.questions}, so a practice score is easy to place, once it is brought to the same scale. AHIMA's exams are different: they report a scaled score with ${h.H.passScore} as the pass mark and mix in unscored pretest questions, so no percentage on a practice test converts into that score. AHIMA's own preparation products include full-length practice exams and hundreds of practice questions; AAPC sells practice exams and an online exam review. This site writes no practice questions and copies none: the calculator only places the score you got elsewhere against the CPC line. Use it with a timed run, at the pace the exam imposes, read on ${h.read}.`,
    faqs: (h) => [
      { q: 'What practice test score means I am ready for the CPC?', a: `No score guarantees a pass, but the line is ${h.pc(h.A.cpc.passShare)} on the real exam. A practice score a few points above that line, on a full-length test taken in ${h.hm(h.A.cpc.minutes)} with your own books, is a reasonable signal. A score taken untimed or with notes beyond what the exam allows overstates your level.` },
      { q: 'Can I convert a practice percentage to the AHIMA scaled score?', a: `No. AHIMA reports a scaled score, with ${h.H.passScore} as the pass mark, and does not publish how many right answers that represents. Its exams also include unscored pretest questions that you cannot tell apart. Treat an AHIMA practice exam as a check of your weak domains rather than as a predicted score.` },
      { q: 'How should I time a full medical coding practice exam?', a: `Copy the real conditions: ${h.A.cpc.questions} questions in ${h.hm(h.A.cpc.minutes)} for the CPC, ${h.H.exams.ccs.items} in ${h.hm(h.H.exams.ccs.minutes)} for the CCS, ${h.H.exams.cca.items} in ${h.hm(h.H.exams.cca.minutes)} for the CCA. Use the same books you will bring, in the same format, print or eBook, and answer every question.` },
    ],
    body: (h) => `
<h2>Medical coding practice test scores against the CPC line</h2>
<p>The real exam has ${h.A.cpc.questions} questions, so any practice score can be brought to the same scale. The table places a few typical results.</p>
${h.table(['Practice result', 'On 100 questions', 'Against the line'], [[62, 80], [55, 75], [80, 100], [38, 50]].map(([c, n]) => { const g = h.E.practiceGap(c, n); return [`${c} of ${n}`, String(g.onCpc), g.gap > 0 ? `${g.gap} short` : `${-g.gap} above`]; }), `CPC passing line: ${h.A.cpc.passCorrect} right answers out of ${h.A.cpc.questions}.`, ['l', 'r', 'l'])}

<h2>Reading a weak area</h2>
<p>The CPC weighs its areas unequally: the six series of procedure codes count ${6 * 6} questions together, the ten cases ten, terminology and anatomy four each. A practice test that splits your score by area tells you where a few hours of study move the most questions. The ${h.a('cpc-exam', 'CPC exam page')} lists all ${h.A.cpc.areas.length} areas with their counts.</p>

<h2>Pacing a practice run</h2>
<p>Four hours for ${h.A.cpc.questions} questions leaves ${h.num(h.A.cpc.minutes / h.A.cpc.questions, 1)} minutes each. AAPC's advice for the real exam works for practice: read the answers before the question, skip what is slow and come back, never leave a blank. A practice score earned at a slower pace does not tell you much. If your score is close to the line, a 2-attempt voucher may be the cheaper bet: see the ${h.a('cpc-exam-cost', 'voucher calculator')}. AHIMA's ${h.a('medical-coding-pass-rates', 'pass rates')} show how many first-time candidates pass its exams.</p>
`,
  },
});
