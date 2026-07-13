import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { VoiceNote } from "@/components/VoiceNote";
import { breadcrumbJsonLd } from "@/lib/schema";
import { getMemory, listMemories, mediaUrl } from "@/lib/contributions";
import { peopleBySlug } from "@/data/people";
import { site } from "@/data/config";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const memories = await listMemories();
  return memories.map((m) => ({ slug: m.slug! }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const memory = await getMemory(slug);
  if (!memory) return { title: "Not found" };
  return {
    title: memory.title,
    description: memory.body.slice(0, 170),
    alternates: { canonical: `/memories/${slug}` },
  };
}

export default async function MemoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const memory = await getMemory(slug);
  if (!memory) return notFound();

  const photo = mediaUrl(memory.photoKey);
  const audio = mediaUrl(memory.audioKey);
  const teller = memory.toldBySlug ? peopleBySlug[memory.toldBySlug] : undefined;
  const about = (memory.personSlugs ?? [])
    .map((s) => peopleBySlug[s])
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Memories", url: `${site.baseUrl}/memories` },
          { name: memory.title, url: `${site.baseUrl}/memories/${slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16 prose-family">
        <Link
          href="/memories"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium no-underline"
        >
          Memories
        </Link>

        {memory.occurredOn ? (
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-500">
            {memory.occurredOn}
          </p>
        ) : null}

        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900">{memory.title}</h1>

        {memory.toldBy ? (
          <p className="mt-2 text-sm text-ink-600 not-prose">
            Told by{" "}
            {teller ? (
              <Link href={`/people/${teller.slug}`} className="text-accent-700 underline">
                {memory.toldBy}
              </Link>
            ) : (
              memory.toldBy
            )}
          </p>
        ) : null}

        {audio ? (
          <VoiceNote src={audio} toldBy={memory.toldBy} transcript={memory.audioTranscript} />
        ) : null}

        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={memory.title}
            className="my-8 w-full rounded-md border border-ink-100"
          />
        ) : null}

        {memory.body.split("\n").filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {about.length > 0 ? (
          <p className="not-prose mt-10 text-sm text-ink-600">
            About{" "}
            {about.map((p, i) => (
              <span key={p.slug}>
                {i > 0 ? ", " : ""}
                <Link href={`/people/${p.slug}`} className="text-accent-700 underline">
                  {p.name}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </article>
    </>
  );
}
