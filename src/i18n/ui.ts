import type { Locale } from './routes';
const en = {
  updatedOn: 'Fees checked on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Fees and rules read by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions future coders ask', relatedCalculators: 'Keep going', sourcesTitle: 'Pages this one was checked against', writtenBy: 'Written by',
  asOf: 'Exam, membership and renewal fees', lastUpdated: 'read on the AAPC and AHIMA pages, last checked on',
  footerValidated: 'Every fee and rule is dated and names the AAPC or AHIMA page it was read on',
  footerBrowser: 'Calculators run in your browser · nothing you type is sent · free, no account, no email',
  footerDisclaimer: 'Medical Coding Cost is an independent site published by Radif Partners. It is not affiliated with, endorsed by or connected to AAPC, AHIMA, NHA, Pearson VUE, Meazure Learning or any school. CPC, COC, CIC, CRC and CPB are credentials of AAPC; CCA, CCS, CCS-P and RHIT are credentials of AHIMA; the names are used only to identify them. Fees and rules are given for guidance and change: confirm them in your AAPC or AHIMA account before you pay. Nothing here is training, career or legal advice.',
  footerPopular: 'Costs',
  notFound: 'There is no page at this address. The cost comparator for medical coding credentials and every fee page start on the home page.',
  readMore: 'Read more', back: 'Home',
  independent: 'Independent site, not AAPC or AHIMA. Exam vouchers, applications, payments and scheduling happen only in your AAPC or AHIMA account.',
};
export function t(_lang: Locale = 'en') { return en; }
