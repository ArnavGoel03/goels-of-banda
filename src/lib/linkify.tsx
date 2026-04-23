import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { people } from "@/data/people";
import { businesses } from "@/data/businesses";
import { places } from "@/data/places";
import { schools } from "@/data/schools";

type Token = {
  text: string;
  href: string;
  external?: boolean;
  kind: "person" | "business" | "place" | "school";
};

function buildTokens(): Token[] {
  const tokens: Token[] = [];

  for (const p of people) {
    tokens.push({
      text: p.name,
      href: `/people/${p.slug}`,
      kind: "person",
    });
    for (const alt of p.altNames ?? []) {
      tokens.push({
        text: alt,
        href: `/people/${p.slug}`,
        kind: "person",
      });
    }
  }

  for (const b of businesses) {
    tokens.push({
      text: b.name,
      href: `/businesses/${b.slug}`,
      kind: "business",
    });
  }

  for (const pl of places) {
    tokens.push({
      text: pl.name,
      href: `/places#${pl.slug}`,
      kind: "place",
    });
    // also the bare city name before the comma
    const bare = pl.name.split(",")[0].trim();
    if (bare && bare !== pl.name) {
      tokens.push({ text: bare, href: `/places#${pl.slug}`, kind: "place" });
    }
  }

  for (const s of schools) {
    if (!s.website) continue;
    tokens.push({
      text: s.name,
      href: s.website,
      external: true,
      kind: "school",
    });
    for (const a of s.aliases ?? []) {
      tokens.push({ text: a, href: s.website, external: true, kind: "school" });
    }
  }

  // Dedupe by (text, href) while keeping order
  const seen = new Set<string>();
  const deduped: Token[] = [];
  for (const t of tokens) {
    const key = `${t.text.toLowerCase()}::${t.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(t);
  }

  // Longest text first so "Gondilal Saraf" beats "Gondilal" and
  // "Vivek Agarwal" beats "Vivek" where both exist.
  deduped.sort((a, b) => b.text.length - a.text.length);
  return deduped;
}

let TOKENS: Token[] | null = null;
function tokens(): Token[] {
  if (!TOKENS) TOKENS = buildTokens();
  return TOKENS;
}

function matchAt(text: string, idx: number, token: Token): boolean {
  const end = idx + token.text.length;
  if (end > text.length) return false;
  if (text.slice(idx, end).toLowerCase() !== token.text.toLowerCase())
    return false;
  const prev = idx === 0 ? " " : text[idx - 1];
  const next = end >= text.length ? " " : text[end];
  if (isWordChar(prev) || isWordChar(next)) return false;
  return true;
}

function isWordChar(ch: string): boolean {
  return /[A-Za-z0-9]/.test(ch);
}

export function linkify(text: string, excludeHrefs: string[] = []): ReactNode[] {
  if (!text) return [];
  const nodes: ReactNode[] = [];
  const excluded = new Set(excludeHrefs);
  const toks = tokens();
  let buffer = "";
  let i = 0;
  let keyCounter = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      nodes.push(buffer);
      buffer = "";
    }
  };

  while (i < text.length) {
    let matched: Token | null = null;
    for (const tok of toks) {
      if (excluded.has(tok.href)) continue;
      if (matchAt(text, i, tok)) {
        matched = tok;
        break;
      }
    }
    if (matched) {
      flushBuffer();
      const matchedText = text.slice(i, i + matched.text.length);
      const key = `lk-${keyCounter++}`;
      if (matched.external) {
        nodes.push(
          <a
            key={key}
            href={matched.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-700 underline decoration-1 underline-offset-2 hover:text-accent-800"
          >
            {matchedText}
          </a>,
        );
      } else {
        nodes.push(
          <Link
            key={key}
            href={matched.href}
            className="text-accent-700 underline decoration-1 underline-offset-2 hover:text-accent-800"
          >
            {matchedText}
          </Link>,
        );
      }
      i += matched.text.length;
    } else {
      buffer += text[i];
      i += 1;
    }
  }
  flushBuffer();

  return nodes.map((n, idx) => <Fragment key={idx}>{n}</Fragment>);
}
