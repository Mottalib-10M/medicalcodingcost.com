import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

const R = P.aapc.reschedule, V = P.ahima.pearson;
export default definePage({
  id: 'medical-coding-exam-rescheduling',
  group: 'keep',
  order: 31,
  tool: { kind: 'mini:reschedule' },
  related: ['cpc-exam', 'cpc-exam-cost', 'how-long-does-it-take-to-become-a-medical-coder', 'ccs-certification'],
  sources: ['aapc_reschedule', 'ahima', 'pearson_ahima'],
  en: {
    slug: 'medical-coding-exam-rescheduling',
    nav: 'Rescheduling an exam',
    card: 'What moving or missing an AAPC or AHIMA exam appointment costs, by format and by days left.',
    title: 'Medical Coding Exam Rescheduling: Fees, Deadlines, No-Shows',
    description: `Medical coding exam rescheduling: free over ${R.centerFreeDays} days ahead for AAPC centers, ${money(R.centerFee)} after, ${R.remoteFreeHours} hours for remote ones, ${money(V.fee)} at Pearson VUE for AHIMA, and no-shows.`,
    h1: 'Medical coding exam rescheduling: fees and deadlines',
    intro: `Medical coding exam rescheduling is free if you act early: more than ${R.centerFreeDays} days ahead for an AAPC testing center, ${R.remoteFreeHours} hours for an AAPC remote exam, ${V.freeBusinessDays} business days for AHIMA. Enter your format and the days left.`,
    resume: (h) => `Moving an exam appointment follows three sets of rules. AAPC exams taken at a testing center can be moved or canceled at no cost more than ${R.centerFreeDays} days ahead; between ${R.centerFeeFromDays} and ${R.centerFeeToDays} days ahead the fee is ${h.usd(R.centerFee)}, paid online to Meazure Learning, and under ${R.centerFeeToDays} days nothing can change. AAPC exams taken at home with a live remote proctor are free to move more than ${R.remoteFreeHours} hours before the start. Missing either kind, or failing the check-in requirements, is a no-show: the voucher is canceled and a new one must be bought, unless a second attempt remains. AHIMA exams are booked with Pearson VUE: free up to ${V.freeBusinessDays} business days before, ${h.usd(V.fee)} between ${V.feeFromDays} days and ${V.feeToHours} hours, and a no-show forfeits the application fee. Rules read on aapc.com on ${h.read}; ${h.ahima('Candidate Guide and certification policies')}.`,
    faqs: (h) => [
      { q: 'Can I get my AHIMA exam fee back if I cannot take it?', a: `AHIMA accepts refund requests up to fourteen business days before the scheduled test date or the end of the eligibility window. A processing fee of ${h.usd(V.refundProcessing)} is kept. No refund is given after the eligibility end date or once the exam has been forfeited, for instance after a no-show.` },
      { q: 'What happens if my CPC remote exam fails the check-in?', a: 'AAPC treats not meeting the requirements to take a remote exam like not showing up: the voucher is canceled, and a new one must be bought, or the second attempt used if you bought the 2-attempt voucher. Testing the computer, camera and room before the day is the cheapest protection.' },
      { q: 'Can I move my AHIMA exam outside the 120-day window?', a: `No. After approval, AHIMA's Authorization to Test letter gives an eligibility window of ${h.H.scheduleWithinDays} days, and the appointment must fall inside it. If the window ends without a test, a new application and the full fee are needed. Plan the application date around the day you expect to be ready.` },
    ],
    body: (h) => `
<h2>Medical coding exam rescheduling rules by format</h2>
${h.table(['Format', 'Free', 'Fee', 'No change possible'], [
  ['AAPC, testing center', `${R.centerFreeDays}+ days ahead`, `${h.usd(R.centerFee)}, ${R.centerFeeFromDays} to ${R.centerFeeToDays} days ahead`, `Under ${R.centerFeeToDays} days`],
  ['AAPC, at home', `More than ${R.remoteFreeHours} hours ahead`, 'None listed', `${R.remoteFreeHours} hours or less`],
  ['AHIMA, Pearson VUE', `${V.freeBusinessDays} business days ahead`, `${h.usd(V.fee)}, ${V.feeFromDays} days to ${V.feeToHours} hours`, `Under ${V.feeToHours} hours`],
], 'AAPC reschedule page; AHIMA exam cancellation policy.', ['l', 'l', 'l', 'l'])}

<h2>What a no-show costs</h2>
<p>An AAPC no-show costs a voucher: ${h.usd(h.A.voucher.core.one)} for a new 1-attempt core voucher, unless the second attempt of a 2-attempt voucher covers it. An AHIMA no-show costs the full application fee, ${h.usd(h.H.exams.ccs.nonMember)} for a CCS non-member, and a new application. For AHIMA, arriving late counts as a no-show.</p>

<h2>Dates to avoid</h2>
<p>AAPC holds no exams from December ${h.A.blackout.startDay} until ${h.A.blackout.resumes}, and asks candidates to register about ${h.A.registerWeeksBefore} weeks before the date they want. Moving a December exam can push it into January. The ${h.a('how-long-does-it-take-to-become-a-medical-coder', 'timeline calculator')} places your exam around that break.</p>
`,
  },
});
