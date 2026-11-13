/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/guides';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS_ORDER, groupLabel } from '../i18n/nav';
import params from '../data/params-2026.json';

const words = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> What US medical coding and billing credentials cost: AAPC exam vouchers (CPC, COC, CIC, CRC, CPB), AHIMA exam fees (CCA, CCS, CCS-P), membership, retakes expected from AHIMA's published first-time pass rates, renewal fees and CEUs, AAPC exam dates and apprentice status, rescheduling fees, and IPEDS counts of coding certificates by state. Independent: not affiliated with AAPC or AHIMA. No salary figures. Last updated ${words(LAST_UPDATED)}.`,
    '',
    '## Data',
    `- Fees and rules read on AAPC and AHIMA pages, retrieved ${words(params.retrieved_at)}; IPEDS Completions ${params.ipeds.year}, program code ${params.ipeds.cip}.`,
    '',
    `- [Credential cost comparator](${SITE_URL}${route('home', 'en')}): two credentials side by side, exam, dues and renewal`,
    '',
    ...GROUPS_ORDER.flatMap((g) => [`## ${groupLabel(g)}`, ...PAGES.filter((p) => p.group === g).map((p) => `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`), '']),
    '## About',
    `- [Method and sources](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
