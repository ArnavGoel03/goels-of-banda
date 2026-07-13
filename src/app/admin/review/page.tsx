import type { Metadata } from "next";
import { ReviewActions } from "@/components/admin/ReviewActions";
import { listPending, mediaUrl, type ContributionKind } from "@/lib/contributions";
import { peopleBySlug } from "@/data/people";

export const metadata: Metadata = {
  title: "Review",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

type PendingRow = {
  id: string;
  title: string;
  toldBy: string | null;
  toldBySlug: string | null;
  personSlugs: string[] | null;
  photoKey: string | null;
  audioKey: string | null;
  audioTranscript: string | null;
  notes: string | null;
  submittedByEmail: string | null;
  submittedAt: Date;
  tags: string[] | null;
};

function Entry({
  kind,
  row,
  body,
}: {
  kind: ContributionKind;
  row: PendingRow;
  body: React.ReactNode;
}) {
  const photo = mediaUrl(row.photoKey);
  const audio = mediaUrl(row.audioKey);
  const tagged = (row.personSlugs ?? [])
    .map((s) => peopleBySlug[s]?.name)
    .filter(Boolean);

  return (
    <li className="rounded-md border border-ink-200 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl font-semibold text-ink-900">{row.title}</h3>
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-500">
          {kind} · {row.submittedAt.toLocaleDateString("en-IN")}
        </p>
      </div>

      <p className="mt-1 text-sm text-ink-600">
        {row.toldBy ? `From ${row.toldBy}` : "No source given"}
        {row.toldBySlug ? " (linked)" : ""}
        {row.submittedByEmail ? ` · sent by ${row.submittedByEmail}` : ""}
      </p>

      {tagged.length > 0 ? (
        <p className="mt-1 text-sm text-ink-600">Also about: {tagged.join(", ")}</p>
      ) : null}

      <div className="mt-4 text-sm text-ink-800">{body}</div>

      {audio ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Voice note</p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls preload="none" src={audio} className="mt-2 w-full" />
        </div>
      ) : null}

      {row.audioTranscript ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-ink-700">{row.audioTranscript}</p>
      ) : null}

      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          className="mt-4 max-h-64 rounded-md border border-ink-100 object-cover"
        />
      ) : null}

      {row.notes ? (
        <p className="mt-3 text-sm text-ink-500">Note to us: {row.notes}</p>
      ) : null}

      <ReviewActions kind={kind} id={row.id} title={row.title} />
    </li>
  );
}

export default async function ReviewPage() {
  const { recipes, traditions, memories } = await listPending();
  const total = recipes.length + traditions.length + memories.length;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-24">
      <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
        {total === 0 ? "Nothing waiting" : `${total} waiting`}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">Review</h1>
      <p className="mt-3 text-ink-600">
        Nothing here is on the site yet. Read it, listen to it, then publish it or
        hold it back. Publishing gives it a permanent URL and puts it on the page
        of everyone it names.
      </p>

      {total === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
          <p className="font-serif text-xl text-ink-800">The queue is empty.</p>
          <p className="mt-2 text-sm text-ink-600">
            Ask someone for a recipe this week. That is how it fills.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-6">
          {recipes.map((r) => (
            <Entry
              key={r.id}
              kind="recipe"
              row={r}
              body={
                <>
                  {r.summary ? <p className="mb-3">{r.summary}</p> : null}
                  <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Ingredients</p>
                  <p className="whitespace-pre-wrap">{r.ingredients}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-500">Steps</p>
                  <p className="whitespace-pre-wrap">{r.steps}</p>
                </>
              }
            />
          ))}
          {traditions.map((t) => (
            <Entry
              key={t.id}
              kind="tradition"
              row={t}
              body={
                <>
                  {t.summary ? <p className="mb-3">{t.summary}</p> : null}
                  <p className="whitespace-pre-wrap">{t.body}</p>
                </>
              }
            />
          ))}
          {memories.map((m) => (
            <Entry
              key={m.id}
              kind="memory"
              row={m}
              body={
                <>
                  {m.occurredOn ? (
                    <p className="mb-2 text-xs uppercase tracking-[0.14em] text-ink-500">
                      {m.occurredOn}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap">{m.body}</p>
                </>
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}
