// Approximate dates as a first-class concept. Family memories rarely come with
// a full date: "1975", "circa 1962", "March 1998", "Diwali 1998". This parses
// that free text into a sortable (year, month?, day?, circa) shape so stories
// and, later, memories/events all order chronologically the same way. Pure and
// client-safe: no server imports.

export type FuzzyDate = {
  year: number;
  month: number | null; // 1-12
  day: number | null; // 1-31
  circa: boolean;
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function monthIndex(name: string): number | null {
  const n = name.toLowerCase().replace(/\.$/, "");
  const i = MONTHS.findIndex((m) => m === n || m.slice(0, 3) === n);
  return i === -1 ? null : i + 1;
}

const YEAR_MIN = 1200;
const YEAR_MAX = 2099;

function validYear(y: number): boolean {
  return y >= YEAR_MIN && y <= YEAR_MAX;
}

// Two-digit years only appear in casual input ("summer of 62"); pivot at 50.
function normYear(raw: string): number {
  const n = parseInt(raw, 10);
  if (raw.length === 4) return n;
  return n >= 50 ? 1900 + n : 2000 + n;
}

function make(year: number, month: number | null, day: number | null, circa: boolean): FuzzyDate | null {
  if (!validYear(year)) return null;
  if (month !== null && (month < 1 || month > 12)) return null;
  if (day !== null && (day < 1 || day > 31)) return null;
  return { year, month, day: month === null ? null : day, circa };
}

/** Parse free text into a fuzzy date, or null when no year is recognizable. */
export function parseFuzzyDate(input: string | null | undefined): FuzzyDate | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;
  const s = raw.toLowerCase();
  const circa = /(^|[\s(])(circa|around|about|approx\.?|roughly|early|late|mid|c\.)([\s)]|$)/.test(s) || s.includes("~");

  // ISO-ish: 1998-03-19 / 1998-03 / 1998
  let m = s.match(/^~?\s*(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return make(+m[1], +m[2], +m[3], circa);
  m = s.match(/^~?\s*(\d{4})-(\d{1,2})$/);
  if (m) return make(+m[1], +m[2], null, circa);
  m = s.match(/^~?\s*(\d{4})$/);
  if (m) return make(+m[1], null, null, circa);

  // Numeric day-first (Indian convention): 19/03/1998, 19.3.98, 19-03-1998.
  // When one component exceeds 12 it disambiguates itself.
  m = s.match(/^~?\s*(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (m) {
    const a = +m[1];
    const b = +m[2];
    const y = normYear(m[3]);
    if (a > 12 && b <= 12) return make(y, b, a, circa);
    if (b > 12 && a <= 12) return make(y, a, b, circa);
    return make(y, b, a, circa); // ambiguous: day-first
  }

  // "19 March 1998", "19th March 1998", "March 19, 1998", "March 1998"
  m = s.match(/^~?\s*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+\.?)\s+(\d{2,4})$/);
  if (m) {
    const mo = monthIndex(m[2]);
    if (mo) return make(normYear(m[3]), mo, +m[1], circa);
  }
  m = s.match(/^~?\s*([a-z]+\.?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{2,4})$/);
  if (m) {
    const mo = monthIndex(m[1]);
    if (mo) return make(normYear(m[3]), mo, +m[2], circa);
  }
  m = s.match(/^~?\s*(?:circa\s+|around\s+|about\s+|early\s+|late\s+|mid\s+|mid-)?([a-z]+\.?)\s+(\d{4})$/);
  if (m) {
    const mo = monthIndex(m[1]);
    if (mo) return make(+m[2], mo, null, circa);
  }

  // Fallback: any recognizable year inside longer text ("Diwali 1998",
  // "the summer of 1975, in Banda"). Surrounding words make it approximate.
  m = s.match(/(?:^|\D)(1[2-9]\d{2}|20\d{2})(?:\D|$)/);
  if (m) return make(+m[1], null, null, true);

  return null;
}

/** Sortable integer: year, then month, then day; unknown parts sort first
 *  within their year so "1975" precedes "March 1975". */
export function fuzzySortKey(f: Pick<FuzzyDate, "year" | "month" | "day"> | null): number {
  if (!f) return Number.MAX_SAFE_INTEGER;
  return f.year * 10000 + (f.month ?? 0) * 100 + (f.day ?? 0);
}

/** Human label: "circa 1962", "March 1998", "19 March 1998". */
export function fuzzyDateLabel(f: FuzzyDate | null): string | null {
  if (!f) return null;
  const month = f.month ? MONTHS[f.month - 1] : null;
  const cap = month ? month[0].toUpperCase() + month.slice(1) : null;
  const core = f.day && cap ? `${f.day} ${cap} ${f.year}` : cap ? `${cap} ${f.year}` : String(f.year);
  return f.circa ? `circa ${core}` : core;
}

/** Whole years elapsed since the fuzzy date, relative to `now`. */
export function fuzzyYearsAgo(f: Pick<FuzzyDate, "year">, now: Date): number {
  return now.getFullYear() - f.year;
}
