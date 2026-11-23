import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'cpc-exam-cost',
  group: 'aapc',
  order: 12,
  tool: { kind: 'mini:voucher' },
  related: ['cpc-certification', 'cpc-exam', 'medical-coding-exam-rescheduling', 'medical-billing-and-coding-certification'],
  sources: ['aapc_exams', 'aapc_cpc', 'aapc_members', 'aapc_reschedule'],
  en: {
    slug: 'cpc-exam-cost',
    nav: 'CPC exam cost',
    card: 'The CPC voucher at one or two attempts, student prices, and the chance of passing at which the second attempt pays.',
    title: 'CPC Exam Cost 2026: Voucher Prices, Student Rate, Retakes',
    description: `CPC exam cost in 2026: ${money(P.aapc.voucher.core.one)} for one attempt, ${money(P.aapc.voucher.core.two)} for two, student pricing, membership on top, and when the 2-attempt voucher is the cheaper bet for you.`,
    h1: 'CPC exam cost: one attempt or two, and the student price',
    intro: `The CPC exam cost is ${money(P.aapc.voucher.core.one)} for a one-attempt voucher or ${money(P.aapc.voucher.core.two)} for two attempts, plus AAPC membership. Type how sure you are to pass the first time to see which voucher is cheaper on average.`,
    resume: (h) => `AAPC does not sell the CPC exam as a sitting but as a voucher, bought in your AAPC account and redeemed when you book. For its core exams, which include the CPC, the voucher costs ${h.usd(h.A.voucher.core.one)} for one attempt and ${h.usd(h.A.voucher.core.two)} for two; its student exam pricing is ${h.usd(h.A.voucher.student.one)} and ${h.usd(h.A.voucher.student.two)}. All exam fees are non-refundable and non-transferable, and the voucher must be used within one year of purchase, with no exception. A 2-attempt voucher is scheduled one attempt at a time, and AAPC says a second attempt taken in the next calendar year uses that year's exam. Membership comes on top: ${h.usd(h.A.membership.individual)} for an individual or ${h.usd(h.A.membership.student)} for a new student member. With the one-attempt price at ${h.usd(h.A.voucher.core.one)}, the second attempt in the bundle costs ${h.usd(h.A.voucher.core.two - h.A.voucher.core.one)}: it pays off on average when your chance of failing the first try is above ${h.pc(1 - h.E.voucherChoice(0).breakEven, 1)}. Prices read on ${h.read}.`,
    faqs: (h) => [
      { q: 'Is the CPC exam fee refundable?', a: `No. AAPC states that all exam fees are non-refundable and non-transferable, and that the voucher can be used for one full year from purchase, with no exception to that policy. Missing a remote exam or failing its requirements counts as a no-show and cancels the voucher, unless a second attempt remains on it.` },
      { q: 'Who can buy the CPC exam at the student price?', a: `AAPC lists student exam pricing at ${h.usd(h.A.voucher.student.one)} for one attempt and ${h.usd(h.A.voucher.student.two)} for two, but the pages we read do not define who qualifies. Its student membership is for new members enrolled in an AAPC course or one of its approved partners. Ask AAPC before buying if your course is elsewhere.` },
      { q: 'How much will the CPC exam cost in 2027?', a: `AAPC has not published 2027 voucher prices and keeps no price calendar. Until it changes its voucher page, the prices are ${h.usd(h.A.voucher.core.one)} for one attempt and ${h.usd(h.A.voucher.core.two)} for two, read ${h.read}; this page switches to the 2027 prices as soon as AAPC publishes them. A voucher is valid one year from purchase, so one bought in 2026 can be used in 2027.` },
      { q: 'Does the CPC exam fee include the code books?', a: `No. The voucher covers the exam only. You bring the approved books, print or eBook, chosen when you redeem the voucher. AAPC's own bundle of the three books costs ${h.usd(h.A.books.proFeeBundle.member, 2)} for members, ${h.usd(h.A.books.proFeeBundle.nonMember, 2)} for others, and any publisher's current books are accepted.` },
    ],
    body: (h) => {
      const rows = [50, 60, 70, 80, 90].map((p) => { const r = h.E.voucherChoice(p / 100); return [`${p}%`, h.usd(r.expectedSingles), h.usd(r.two), r.better === 'two' ? '2 attempts' : '1 attempt']; });
      return `
<h2>CPC exam cost by voucher</h2>
${h.table(['Voucher', 'Regular price', 'Student price'], [['1 attempt', h.usd(h.A.voucher.core.one), h.usd(h.A.voucher.student.one)], ['2 attempts', h.usd(h.A.voucher.core.two), h.usd(h.A.voucher.student.two)], ['Extra cost of the second attempt', h.usd(h.A.voucher.core.two - h.A.voucher.core.one), h.usd(h.A.voucher.student.two - h.A.voucher.student.one)]], `AAPC core exam and student prices, read ${h.read}. The last line is the 2-attempt price minus the 1-attempt price. The student discount is ${h.usd(h.A.voucher.core.one - h.A.voucher.student.one)} on the 1-attempt voucher and ${h.usd(h.A.voucher.core.two - h.A.voucher.student.two)} on the 2-attempt one, which is why the second attempt looks ${h.usd((h.A.voucher.student.two - h.A.voucher.student.one) - (h.A.voucher.core.two - h.A.voucher.core.one))} dearer at the student price.`, ['l', 'r', 'r'])}
<p>AAPC's specialty exams cost less (${h.usd(h.A.voucher.specialty.one)} and ${h.usd(h.A.voucher.specialty.two)}), but the CPC is a core exam.</p>

<h2>When the second attempt pays</h2>
<p>Buying a single voucher and a second single only after a fail costs ${h.usd(h.A.voucher.core.one)} if you pass, ${h.usd(2 * h.A.voucher.core.one)} if you do not. The table weighs both against the 2-attempt price for a range of first-sitting chances. Nobody knows their chance in advance, and AAPC publishes no pass rate: a practice test score is the best clue, see the ${h.a('medical-coding-practice-test', 'practice test page')}.</p>
${h.table(['Your chance of passing first', '1-attempt voucher, second one only after a fail (average)', '2-attempt voucher', 'Cheaper'], rows, 'Average cost for a candidate who would sit at most twice.', ['l', 'r', 'r', 'l'])}

<h2>CPC exam cost in 2027</h2>
<p>AAPC has not announced voucher prices for 2027 and publishes no price calendar: the figures above, read ${h.read}, stay until AAPC changes its voucher page, and the calculator will switch as soon as it does. What is already set: a voucher stays valid one year from purchase, so one bought in 2026 can be used in 2027; a second attempt taken in 2027 uses the 2027 exam; and AAPC holds no exams from December ${h.A.blackout.startDay}, 2026 until January 11, 2027.</p>

<h2>What else to budget</h2>
<p>The totals elsewhere on this site count the 1-attempt voucher, the price if you pass the first time; choosing to take the exam twice there counts the 2-attempt voucher. Membership: ${h.usd(h.A.membership.individual)} the first year, then ${h.usd(h.A.membership.renewal)} a year. Books: ${h.usd(h.A.books.proFeeBundle.member, 2)} for AAPC's bundle as a member. Moving a testing-center appointment between ${h.A.reschedule.centerFeeFromDays} and ${h.A.reschedule.centerFeeToDays} days ahead costs ${h.usd(h.A.reschedule.centerFee)}: see the ${h.a('medical-coding-exam-rescheduling', 'rescheduling page')}. The ${h.a('cpc-certification', 'CPC certification page')} adds the years of renewal.</p>
`;
    },
  },
});
