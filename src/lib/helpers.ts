/** Writing helpers handed to every page: links, figures read from params-2026.json through the engine, tables. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { formatNumberL, money, pct, dateL } from './format-l';
import P from '../data/params-2026.json';
import * as E from './engine/coding';
import { etiquettes } from './tableaux';

export type SourceKey = keyof typeof P.sources;
const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
/** Table that becomes cards on a phone (class `empile`, trame `lib/tableaux.ts`). */
export function table(headers: string[], rows: Array<Array<string | number>>, caption: string | undefined, align: Array<'l' | 'r'>) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  const labs = etiquettes(headers.map((h) => String(h).replace(/<[^>]+>/g, '')), headers.length);
  const lab = (i: number) => (labs[i] ?? '').replace(/"/g, '&quot;');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal empile w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td data-label="${lab(i)}" class="tabular-nums border-b border-navy-100 px-3 py-2 align-top text-navy-800 ${al(i)}">${i > 0 && typeof c !== 'number' && /</.test(c) ? `<span>${c}</span>` : typeof c === 'number' ? esc(formatNumberL(c)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(lang: Locale = 'en', strict = false) {
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, lang)}">${text}</a>`;
  };
  const ext = (url: string, text: string) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`;
  const src = (k: SourceKey, text: string) => ext(P.sources[k].url, text);
  return {
    lang, a, ext, src, P, E, A: P.aapc, H: P.ahima, I: P.ipeds,
    /** $425 (whole dollars) or $244.99 with `d = 2`. */
    usd: (n: number, d = 0) => money(n, d),
    num: (n: number, d = 0) => formatNumberL(n, 'en', d),
    pc: (x: number, d = 0) => pct(x, 'en', d),
    date: (iso: string) => dateL(iso),
    /** Day the AAPC and AHIMA pages were read: "November 13, 2026". */
    read: dateL(P.retrieved_at),
    table: (h: string[], r: Array<Array<string | number>>, c?: string, al: Array<'l' | 'r'> = []) => table(h, r, c, al),
    box: (title: string, html: string) => `<div class="callout callout-info"><span class="callout-title">${title}</span>${html}</div>`,
    /** "4 hours" or "2 hours" or "3 hours 30 minutes". */
    hm: (m: number) => { const h = Math.floor(m / 60), r = m % 60; return `${h ? `${h} hour${h === 1 ? '' : 's'}` : ''}${h && r ? ' ' : ''}${r ? `${r} minutes` : ''}`; },
    /** AHIMA cited without a deep link (its terms ask written approval for links to inner pages). */
    ahima: (page: string) => `AHIMA's ${page} (read on ${dateL(P.retrieved_at)} on ${ext(P.sources.ahima.url, 'ahima.org')})`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
