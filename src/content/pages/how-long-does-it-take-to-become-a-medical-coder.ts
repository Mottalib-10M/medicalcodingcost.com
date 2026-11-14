import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';

export default definePage({
  id: 'how-long-does-it-take-to-become-a-medical-coder',
  group: 'start',
  order: 6,
  tool: { kind: 'mini:timeline' },
  related: ['how-to-become-a-medical-coder', 'medical-coding-exam-rescheduling', 'cpc-exam', 'medical-coding-programs-by-state'],
  sources: ['aapc_cpc', 'aapc_exams', 'aapc_taking', 'ahima'],
  en: {
    slug: 'how-long-does-it-take-to-become-a-medical-coder',
    nav: 'Time to become a coder',
    card: 'From the first day of training to the exam result: study months, booking, the year-end break when no exam is held, and results.',
    title: 'Time to Become a Medical Coder: Course, Exam and Results',
    description: `Time to become a medical coder: ${P.aapc.prepMonths[0]} to ${P.aapc.prepMonths[1]} months of study as AAPC puts it, booking ${P.aapc.registerWeeksBefore} weeks ahead, no exams from December ${P.aapc.blackout.startDay}, results in ${P.aapc.resultsBusinessDays[0]} to ${P.aapc.resultsBusinessDays[1]} business days.`,
    h1: 'Time to become a medical coder, from first class to result',
    intro: `The time to become a medical coder is ${P.aapc.prepMonths[0]} to ${P.aapc.prepMonths[1]} months for most people, AAPC says, from coursework to a passed exam. Add ${P.aapc.registerWeeksBefore} weeks of booking and ${P.aapc.resultsBusinessDays[0]} to ${P.aapc.resultsBusinessDays[1]} business days for results. Enter your start month below.`,
    resume: (h) => `How long it takes to become a medical coder depends on the course more than on the exam. AAPC's answer to the question is that most people complete the coursework and pass the exam in ${h.A.prepMonths[0]} to ${h.A.prepMonths[1]} months. Three fixed delays sit around that. AAPC asks you to register at least ${h.A.registerWeeksBefore} weeks before the exam date, so the voucher has to be bought and redeemed before the course ends. AAPC gives no exams during its yearly blackout, from December ${h.A.blackout.startDay} until ${h.A.blackout.resumes}, while it switches to the new year's codes. And results arrive ${h.A.resultsBusinessDays[0]} to ${h.A.resultsBusinessDays[1]} business days after the exam, in the member area. AHIMA lets you schedule within ${h.H.scheduleWithinDays} days of being found eligible. The calculator dates each step from the month you start, as read on ${h.read}. Experience comes after: see the apprentice rule on the ${h.a('how-to-become-a-medical-coder', 'steps page')}.`,
    faqs: (h) => [
      { q: 'Can I become a medical coder in less than four months?', a: `Some people do, especially those who already work in healthcare and code part of the day. AAPC's ${h.A.prepMonths[0]} to ${h.A.prepMonths[1]} months is a typical range, not a minimum. A short course still has to leave room for the ${h.A.registerWeeksBefore}-week booking rule, and passing without ${h.A.apprentice.years} years of experience gives the CPC-A, not the full CPC.` },
      { q: 'Why can I not take an AAPC exam in early January?', a: `AAPC stops its exams for a yearly blackout from December ${h.A.blackout.startDay} to make the new year's exam updates. Exams resume ${h.A.blackout.resumes}. A course that ends in late December leads to an exam in the second half of January at the earliest, which the calculator shows when your date falls in that window.` },
      { q: 'How soon do AAPC exam results come?', a: `AAPC posts results in the member area ${h.A.resultsBusinessDays[0]} to ${h.A.resultsBusinessDays[1]} business days after the exam, and says the delay can vary with volume and the time of year. Results are never given by phone. Passing candidates receive their certificate by mail afterwards.` },
    ],
    body: (h) => {
      const ex = [[2027, 1, 4], [2027, 1, 8], [2026, 7, 5], [2027, 3, 6]].map(([y, m, s]) => { const t = h.E.aapcTimeline(y, m, s); return [`${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}, ${s} months`, h.date(t.exam), h.date(t.bookBy), `${h.date(t.resFrom)} to ${h.date(t.resTo)}`]; });
      return `
<h2>Time to become a medical coder: four example timelines</h2>
<p>Each line starts training on the first of the month and books the exam for the day the study months end. The voucher must be redeemed and the exam booked ${h.A.registerWeeksBefore} weeks before.</p>
${h.table(['Start and study time', 'Exam', 'Book by', 'Result between'], ex, 'Business days counted Monday to Friday; federal holidays not removed.', ['l', 'l', 'l', 'l'])}
<p>The July start with five months of study lands on December 1, before the blackout. Move it one month later and the exam slides to January, after AAPC's restart day.</p>

<h2>Where the months go</h2>
<p>A coding course that starts from zero covers terminology and anatomy before the code sets, which is why AAPC suggests its prerequisite course to people new to healthcare. The federal count of awards shows that most college programs in coding are certificates of one to two years: see the ${h.a('medical-coding-programs-by-state', 'programs by state page')}. A self-paced course can be shorter, and AAPC gives its online preparation courses a four-month window or less.</p>

<h2>After the result</h2>
<p>A pass gives the CPC, or the CPC-A without experience. A fail sends you back to the booking step: a 2-attempt voucher holds the second sitting, otherwise a new voucher is needed. Moving an appointment has its own deadlines and fees, set out on the ${h.a('medical-coding-exam-rescheduling', 'rescheduling page')}.</p>
`;
    },
  },
});
