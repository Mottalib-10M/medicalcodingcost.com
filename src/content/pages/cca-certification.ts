import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money, pct } from '../../lib/format-l';

const X = P.ahima.exams.cca;
const last = X.rates[X.rates.length - 1];
export default definePage({
  id: 'cca-certification',
  group: 'ahima',
  order: 21,
  tool: { kind: 'mini:cca-path' },
  related: ['ccs-certification', 'medical-coding-pass-rates', 'how-to-become-a-medical-coder', 'medical-coding-certification'],
  sources: ['ahima', 'pearson_ahima'],
  en: {
    slug: 'cca-certification',
    nav: 'CCA certification',
    card: 'AHIMA’s entry-level coding credential: what it costs, the exam, its falling pass rate and the later step to the CCS.',
    title: 'CCA Certification: Fees, Format and the Step to the CCS',
    description: `CCA certification in 2026: ${money(X.member)} for AHIMA members or ${money(X.nonMember)}, ${X.items} questions in 2 hours, a first-time pass rate of ${pct(last[2])}, renewal, and what the later CCS step adds.`,
    h1: 'CCA certification: what the entry-level AHIMA exam costs',
    intro: `CCA certification is AHIMA's entry-level coding credential: ${money(X.member)} per sitting for members, ${money(X.nonMember)} for others, and ${pct(last[2])} of first-time testers passed in ${last[0]}. Set the years until your CCS to price both steps.`,
    resume: (h) => `The Certified Coding Associate (CCA) is the credential AHIMA offers to coders at the start of their career. The only eligibility rule is a high school diploma; AHIMA recommends, without requiring it, six months of coding experience, an AHIMA approved coding program (PCAP) or a training program that covers anatomy and physiology, medical terminology and basic diagnostic and procedural coding. The exam has ${h.num(X.items)} questions, ${h.num(X.scored)} of them scored, in ${h.hm(X.minutes)}, and a scaled score of ${h.H.passScore} passes. A sitting costs ${h.usd(X.member)} for members or ${h.usd(X.nonMember)} for others. The first-time pass rate fell from ${h.pc(X.rates[0][2])} in ${X.rates[0][0]} to ${h.pc(last[2])} in ${last[0]}, so the average candidate needs ${h.num(h.E.expectedAttempts(last[2]), 2)} sittings. Like the CCS, the CCA is renewed every ${h.H.recert.cycleYears} years with ${h.H.recert.ceus.cca} CEUs, and the CCS replaces it once passed. ${h.ahima('CCA certification page')}.`,
    faqs: (h) => [
      { q: 'Can I take the CCA with no coding experience?', a: `Yes. AHIMA's only eligibility rule for the CCA is a high school diploma. Six months of experience or a coding program is recommended, not required. The exam still assumes you can code: the first-time pass rate was ${h.pc(last[2])} in ${last[0]}, which is lower than the CCS rate the same year.` },
      { q: 'Is it cheaper to skip the CCA and go straight to the CCS?', a: `On fees alone, yes: one CCS sitting costs ${h.usd(h.H.exams.ccs.nonMember)} for a non-member, while the two steps add a CCA fee and, if the gap lasts a full cycle, a CCA recertification. The CCS assumes more experience, though. The calculator above prices both steps with the gap you choose.` },
      { q: 'How many questions are on the CCA exam?', a: `${h.num(X.items)} multiple-choice questions in ${h.hm(X.minutes)}. Of these, ${h.num(X.scored)} count toward the score and ${h.num(X.items - X.scored)} are pretest items that AHIMA is trying out; you cannot tell which ones. AHIMA groups the competencies into six domains, from classification systems to confidentiality and privacy.` },
    ],
    body: (h) => {
      const rows = h.E.passRates('cca').map((r) => [String(r.year), h.num(r.testers), h.pc(r.rate), h.usd(h.H.exams.cca.nonMember * h.E.expectedAttempts(r.rate))]);
      return `
<h2>CCA certification fees, retakes included</h2>
<p>The fee is paid with each application, so a retake costs the same again. The last column multiplies the non-member fee by the sittings the average first-time rate implies.</p>
${h.table(['Year', 'First-time testers', 'Pass rate', 'Expected non-member fees'], rows, `${h.num(X.certified)} CCA holders at the end of 2025, as AHIMA reports it.`, ['l', 'r', 'r', 'r'])}

<h2>From the CCA to the CCS</h2>
<p>AHIMA lists the CCA plus one year of coding experience among the profiles it recommends for the CCS. Once you pass the CCS, AHIMA's Recertification Guide says it supersedes the CCA: the older credential is replaced and stops needing CEUs and a fee. Between the two exams, each full ${h.H.recert.cycleYears}-year cycle on the CCA costs one recertification fee, ${h.usd(h.H.recert.member)} for members or ${h.usd(h.H.recert.nonMember)} for others. The ${h.a('ccs-certification', 'CCS page')} prices the second step on its own.</p>

<h2>Exam day</h2>
<p>The CCA is taken at a Pearson VUE center within the ${h.H.scheduleWithinDays}-day eligibility window AHIMA sets after approval. Since May 1, 2026, candidates bring the code books on AHIMA's 2026 list; without them they cannot test and forfeit the fee. A retake needs a new application after ${h.H.retakeWaitDays} days. What moving the appointment costs is on the ${h.a('medical-coding-exam-rescheduling', 'rescheduling page')}.</p>
`;
    },
  },
});
