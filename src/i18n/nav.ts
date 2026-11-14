/** Menus and footer, built from the page registry: a new page file appears in its group by itself. */
import { route, hasRoute, type Locale } from './routes';
import { PAGES, pageById } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Cost comparator', method: 'Method and sources', about: 'About', widget: 'Embed the comparator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
/** Short labels for the top menu (one or two words, MASTERFACTORY §10.3); full labels in the footer and on the home page. */
const GROUP_SHORT: Record<Group, string> = { start: 'Getting started', aapc: 'CPC (AAPC)', ahima: 'CCA, CCS, CCS-P (AHIMA)', keep: 'Costs, renewal' };
const GROUP_LABEL: Record<Group, string> = { start: 'Becoming a medical coder', aapc: 'CPC and the other AAPC credentials', ahima: 'CCA, CCS and CCS-P (AHIMA)', keep: 'Costs, rescheduling and renewal' };
export const GROUPS_ORDER: Group[] = ['start', 'aapc', 'ahima', 'keep'];
export const groupLabel = (g: Group, _lang: Locale = 'en') => GROUP_LABEL[g];
export const label = (id: string, _lang: Locale = 'en') => CORE[id] ?? pageById(id)?.en.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS_ORDER.map((g) => ({ label: short ? GROUP_SHORT[g] : GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
/** Direct links (naive testers, 2nd round: the comparator, the site's main tool, was missing from the menu). */
export const navDirect = (lang: Locale): NavLink[] => [{ href: route('home', lang), label: 'Compare credentials' }];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...navCategories(lang, false),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
export const popularLinks = (_lang: Locale): NavLink[] => [];
