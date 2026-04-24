import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { getPerson } from "./src/data/people";
import { getBusiness } from "./src/data/businesses";
import { placesBySlug } from "./src/data/places";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink-900 mt-10">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl text-ink-900 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-4 leading-relaxed text-ink-800">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-accent-700 underline hover:text-accent-800">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mt-4 list-disc pl-6 space-y-1 text-ink-800">{children}</ul>
    ),
    Person: ({ slug, children }: { slug: string; children?: React.ReactNode }) => {
      const p = getPerson(slug);
      if (!p) return <span>{children ?? slug}</span>;
      return (
        <Link
          href={`/people/${p.slug}`}
          className="text-accent-700 underline hover:text-accent-800"
        >
          {children ?? p.name}
        </Link>
      );
    },
    Business: ({ slug, children }: { slug: string; children?: React.ReactNode }) => {
      const b = getBusiness(slug);
      if (!b) return <span>{children ?? slug}</span>;
      return (
        <Link
          href={`/businesses/${b.slug}`}
          className="text-accent-700 underline hover:text-accent-800"
        >
          {children ?? b.name}
        </Link>
      );
    },
    Place: ({ slug, children }: { slug: string; children?: React.ReactNode }) => {
      const pl = placesBySlug[slug];
      if (!pl) return <span>{children ?? slug}</span>;
      return (
        <Link
          href={`/places#${pl.slug}`}
          className="text-accent-700 underline hover:text-accent-800"
        >
          {children ?? pl.name}
        </Link>
      );
    },
    ...components,
  };
}
