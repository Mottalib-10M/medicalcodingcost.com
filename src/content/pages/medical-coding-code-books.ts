import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { money } from '../../lib/format-l';

export default definePage({
  id: 'medical-coding-code-books',
  group: 'aapc',
  order: 14,
  tool: { kind: 'mini:books' },
  related: ['cpc-exam', 'cpc-certification', 'ccs-certification', 'medical-coding-practice-test'],
  sources: ['aapc_taking', 'aapc_members', 'aapc_exams', 'ahima'],
  en: {
    slug: 'medical-coding-code-books',
    nav: 'Code books for the exam',
    card: 'Which code books and which year each exam allows, and what the AAPC member price saves.',
    title: 'Medical Coding Code Books: Which Year, Member Price, Rules',
    description: `Medical coding code books for the 2026 exams: the books the CPC allows, which year, notes and tabs, AHIMA's codebook list, and the ${money(P.aapc.books.proFeeBundle.member, 2)} AAPC member bundle.`,
    h1: 'Medical coding code books: which ones, which year, what price',
    intro: `Medical coding code books are allowed in the exam room, and the wrong year can cost you the exam. AAPC's book bundle is ${money(P.aapc.books.proFeeBundle.member, 2)} for members and ${money(P.aapc.books.proFeeBundle.nonMember, 2)} for others. See below what the member price saves.`,
    resume: (h) => `Coding exams are open-book: candidates code from the official code sets, so the right books are part of the cost and part of the rules. For the CPC, AAPC allows the AMA's CPT Professional Edition and an ICD-10-CM and a HCPCS Level II book from any publisher, from the current or the previous year, one copy of each; books older than a year and next year's books are refused. AAPC's own bundle of the three books costs ${h.usd(h.A.books.proFeeBundle.member, 2)} for members and ${h.usd(h.A.books.proFeeBundle.nonMember, 2)} for non-members, a gap of ${h.usd(h.E.bookSaving().saving, 2)}. AHIMA publishes a codebook list for each exam and requires, for its CCA and CCS exams delivered on or after May 1, 2026, the 2026 books on that list; a candidate without the right books is not allowed to test and forfeits the fee. Rules and prices read on ${h.read}.`,
    faqs: (h) => [
      { q: 'Can I write notes in my code books for the CPC?', a: 'In print books, yes, if the notes relate to daily coding work. Long passages on blank pages and questions copied from study guides or practice exams are not allowed. Tabs may be inserted, taped or stapled to mark pages, with words or numbers only. With eBooks, personal notes and tabs are not available at all.' },
      { q: 'What happens if I bring the wrong books to an AHIMA exam?', a: 'AHIMA says candidates without the correct code books are not allowed to test and forfeit their exam fees. For the CCA and CCS, exams delivered on or after May 1, 2026 require the 2026 books from the codebook list. Check the list for your exam on AHIMA’s site before you buy or bring anything.' },
      { q: 'Do I have to buy the code books from AAPC?', a: `No. For the CPC, AAPC asks for the AMA's CPT Professional Edition and lets you choose the publisher of the ICD-10-CM and HCPCS Level II books. Its bundle is one option among others. The member price saves ${h.usd(h.E.bookSaving().saving, 2)} on one bundle, which matters only if you are a member anyway.` },
    ],
    body: (h) => `
<h2>Medical coding code books allowed, exam by exam</h2>
${h.table(['Exam', 'Books', 'Year'], [['CPC (AAPC)', 'AMA CPT Professional Edition, ICD-10-CM and HCPCS Level II of any publisher', 'Current or previous year, one copy each'], ['CCA, CCS (AHIMA)', 'Books on AHIMA’s codebook list for the exam', '2026 books for exams on or after May 1, 2026'], ['Other AAPC exams', 'Listed on AAPC’s approved code books page', 'See that page for each exam']], `AAPC “Taking the CPC exam” page; AHIMA certification pages, read ${h.read}.`, ['l', 'l', 'l'])}
<p>AAPC strongly suggests current-year books since the code sets change every year; HCPCS Level II exam content moved to the 2026 codes on March 2, 2026, with either the 2025 or the 2026 book accepted.</p>

<h2>Print or eBook</h2>
<p>When you redeem an AAPC voucher you choose print books or eBooks. eBooks give a shared library with search but no personal notes or tabs; print books allow tabs and short notes. Pick the format you practiced with: changing on exam day costs time on every question.</p>

<h2>Does the member price justify joining?</h2>
<p>For the CPC you join AAPC anyway, since membership is required to sit. The calculator shows how much several years of bundles save at the member price. To place the books in the full cost of a credential, see the ${h.a('cpc-certification', 'CPC page')}, and for AHIMA's exams, the ${h.a('ccs-certification', 'CCS page')}.</p>
`,
  },
});
