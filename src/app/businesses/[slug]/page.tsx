import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { businesses, getBusiness } from "@/data/businesses";
import { getPerson } from "@/data/people";
import { JsonLd } from "@/components/JsonLd";
import {
  organizationJsonLd,
  breadcrumbJsonLd,
  businessUrl,
} from "@/lib/schema";
import { site } from "@/data/config";

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return { title: "Not found" };
  return {
    title: b.name,
    description: b.description.slice(0, 170),
    alternates: { canonical: `/businesses/${slug}` },
    openGraph: {
      title: `${b.name} — ${site.shortName}`,
      description: b.description.slice(0, 170),
      url: businessUrl(slug),
    },
  };
}

export default async function BusinessPage({ params }: { params: Params }) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return notFound();

  const operators = b.runByPersonSlugs
    .map((s) => getPerson(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd data={organizationJsonLd(b)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Businesses", url: `${site.baseUrl}/businesses` },
          { name: b.name, url: businessUrl(slug) },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        <Link
          href="/businesses"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium"
        >
          ← All businesses
        </Link>

        <header className="mt-4 border-b border-ink-100 pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
            {b.kind}
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
            {b.name}
          </h1>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm">
            <Fact label="Location">
              {b.city}
              {b.state ? `, ${b.state}` : ""}, {b.country}
            </Fact>
            {b.established ? (
              <Fact label="Established">{b.established}</Fact>
            ) : null}
            {b.website ? (
              <Fact label="Website">
                <a
                  href={b.website}
                  rel="noopener"
                  className="text-accent-700 underline"
                >
                  {new URL(b.website).hostname}
                </a>
              </Fact>
            ) : null}
          </dl>
        </header>

        <section className="prose-family mt-8">
          <p className="lead">{b.description}</p>
        </section>

        {operators.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Run by
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {operators.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/people/${p.slug}`}
                    className="text-accent-700 underline hover:text-accent-800"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {b.sources && b.sources.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Sources
            </h2>
            <ul className="mt-4 space-y-1 text-sm">
              {b.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    className="text-accent-700 hover:text-accent-800 underline"
                    rel="noopener"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <dt className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
        {label}
      </dt>
      <dd className="text-ink-900">{children}</dd>
    </div>
  );
}
