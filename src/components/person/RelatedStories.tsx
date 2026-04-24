import Link from "next/link";
import { getStoriesFor } from "@/data/stories";

export function RelatedStories({
  personSlug,
  businessSlug,
  placeSlug,
}: {
  personSlug?: string;
  businessSlug?: string;
  placeSlug?: string;
}) {
  const list = getStoriesFor({ personSlug, businessSlug, placeSlug });
  if (list.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Stories featuring
      </h2>
      <ul className="mt-4 space-y-3">
        {list.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/stories/${s.slug}`}
              className="group block rounded-md border border-ink-100 bg-parchment px-4 py-3 border-l-2 border-l-gold hover:border-accent-400 hover:-translate-y-0.5 transition-all"
            >
              {s.era ? (
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  {s.era}
                </p>
              ) : null}
              <p className="mt-0.5 font-serif text-lg font-semibold text-ink-900 group-hover:text-accent-700 leading-tight">
                {s.title}
              </p>
              <p className="mt-1 text-sm text-ink-600">{s.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
