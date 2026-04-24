import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documents, getDocument } from "@/data/documents";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export function generateStaticParams() {
  return documents.map((d) => ({ slug: d.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.description.slice(0, 170),
    alternates: { canonical: `/archive/${slug}` },
  };
}

export default async function ArchiveItemPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) return notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Archive", url: `${site.baseUrl}/archive` },
          { name: doc.title, url: `${site.baseUrl}/archive/${slug}` },
        ])}
      />
      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16">
        <Link
          href="/archive"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium"
        >
          ← Archive
        </Link>
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {doc.kind} {doc.date?.year ? `· ${doc.date.year}` : ""}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900">
          {doc.title}
        </h1>
        {doc.imageUrl ? (
          <img
            src={doc.imageUrl}
            alt={doc.title}
            className="mt-6 rounded-md border border-ink-100"
          />
        ) : null}
        <p className="mt-6 text-ink-700">{doc.description}</p>
        {doc.pdfUrl ? (
          <a
            href={doc.pdfUrl}
            rel="noopener"
            className="mt-6 inline-block rounded-md border border-accent-700/30 bg-accent-700/5 px-3 py-1.5 text-sm text-accent-700 hover:bg-accent-700/10"
          >
            View the PDF →
          </a>
        ) : null}
      </article>
    </>
  );
}
