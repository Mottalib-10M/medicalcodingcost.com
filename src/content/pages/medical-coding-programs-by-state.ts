import { definePage } from '../../lib/guide-types';
import P from '../../data/params-2026.json';
import { formatNumberL } from '../../lib/format-l';

export default definePage({
  id: 'medical-coding-programs-by-state',
  group: 'start',
  order: 4,
  tool: { kind: 'mini:state' },
  related: ['how-long-does-it-take-to-become-a-medical-coder', 'medical-billing-and-coding', 'how-to-become-a-medical-coder', 'medical-coding-certification'],
  sources: ['ipeds', 'cip'],
  en: {
    slug: 'medical-coding-programs-by-state',
    nav: 'Coding programs by state',
    card: 'How many medical coding certificates and degrees schools awarded in each state, from the federal IPEDS file.',
    title: 'Medical Coding Programs by State: Awards in the IPEDS File',
    description: 'Medical coding programs by state: certificates and associate degrees awarded in 2023-24 under program code 51.0713, and how many schools reported them (IPEDS).',
    h1: 'Medical coding programs by state: what schools awarded',
    intro: `Medical coding programs at US colleges awarded ${formatNumberL(P.ipeds.total)} certificates and degrees in ${P.ipeds.year}, from ${formatNumberL(P.ipeds.institutions)} schools, in the federal IPEDS count. Pick your state below to see its share.`,
    resume: (h) => `Every college that takes federal student aid reports to the National Center for Education Statistics how many awards it gave in each program, by program code. Code ${h.I.cip}, “${h.I.title}”, is the code for medical coding programs. In the ${h.I.year} school year (July to June, ${h.I.release} release), schools reported ${h.num(h.I.total)} awards under it as a first major: ${h.num(h.I.tot.short)} certificates of less than one year, ${h.num(h.I.tot.cert)} certificates of one to two years, ${h.num(h.I.tot.assoc)} associate degrees and ${h.num(h.I.tot.other)} other awards, from ${h.num(h.I.institutions)} schools. The count says where coding is taught at scale, not which school is good, and it misses programs filed under neighboring codes or run by schools outside federal aid, such as some online course sellers. The tool and the table below give the figures for each state that reported awards. Read with the ${h.a('how-long-does-it-take-to-become-a-medical-coder', 'time it takes')}, they help size a local program before you compare its price.`,
    faqs: (h) => [
      { q: 'Why is my state missing from the coding programs table?', a: `${h.I.absent.join(', ')} report no award under code ${h.I.cip} in the ${h.I.year} file. Schools there may still teach coding under another program code, or online schools based elsewhere may serve students there. The table only shows what schools filed under this one code.` },
      { q: 'Does a certificate from a college make me a certified coder?', a: 'No. A college certificate shows you finished a program; the professional credential comes from passing an exam of AAPC or AHIMA, such as the CPC or the CCA. Many programs prepare for one of those exams. Ask the school which exam it prepares for, and whether the exam fee is part of the price or comes on top of it.' },
      { q: 'How long are medical coding certificate programs?', a: `IPEDS sorts awards by length: certificates under one year (up to 899 clock hours or 29 semester credits), certificates of one to two years, and associate degrees. In ${h.I.year}, ${h.pc(h.I.tot.cert / h.I.total)} of coding awards were one-to-two-year certificates and ${h.pc(h.I.tot.short / h.I.total)} were the shorter certificates.` },
    ],
    body: (h) => {
      const rows = h.E.IPEDS_SORTED.map((r, i) => [`${i + 1}. ${r.name}`, h.E.ipedsTotal(r), r.inst, r.short, r.cert, r.assoc]);
      return `
<h2>Medical coding programs by state, ${h.I.year}</h2>
<p>States are sorted by awards under code ${h.I.cip}, first majors. “Schools” counts the institutions that reported at least one award.</p>
${h.table(['State', 'Awards', 'Schools', 'Under 1 year', '1 to 2 years', 'Associate'], rows, `IPEDS Completions ${h.I.year}, file C2024_A, ${h.I.release}. Other awards (${h.num(h.I.tot.other)}) are counted in the total only.`, ['l', 'r', 'r', 'r', 'r', 'r'])}

<h2>How to read these counts</h2>
<p>Awards follow population and the number of community colleges, so large states lead. A small count does not mean no training: online programs based in another state enroll students everywhere, and their awards are counted where the school is. The award level matters more for you than the rank. A certificate under one year is close to the ${h.A.prepMonths[0]} to ${h.A.prepMonths[1]} months AAPC says most people take to finish coursework and pass; an associate degree takes about two years of study.</p>

<h2>Before you enroll</h2>
<p>Ask three questions: which exam the program prepares for (CPC, CCA or another), whether the exam voucher and the code books are in the price, and whether the course is long enough to waive part of AAPC's experience rule (${h.A.apprentice.courseHours} hours waive ${h.A.apprentice.waivesYears} year). Then compare what the credential costs over the years you keep it on the ${h.a('medical-coding-certification', 'certification page')}.</p>
`;
    },
  },
});
