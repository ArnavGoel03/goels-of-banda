import { EntryCard } from "@/components/EntryCard";
import { contributionsForPerson, mediaUrl } from "@/lib/contributions";

/**
 * What this person passed down: the recipes they cook, the customs they keep,
 * the things they remember. This is the payoff of tagging a contribution with a
 * person slug. A page that was a set of dates becomes a page of their voice.
 *
 * Published rows only, and the publish action revalidates every tagged person's
 * page, so this stays statically rendered and costs the visitor nothing.
 */
export async function ContributedPanel({
  personSlug,
  personName,
}: {
  personSlug: string;
  personName: string;
}) {
  const { recipes, traditions, memories } = await contributionsForPerson(personSlug);
  const total = recipes.length + traditions.length + memories.length;
  if (total === 0) return null;

  const firstName = personName.split(" ")[0];

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-ink-900">
        From {firstName}
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Recipes, customs and memories the family recorded in {firstName}&rsquo;s name.
      </p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {recipes.map((r) => (
          <EntryCard
            key={r.id}
            href={`/recipes/${r.slug}`}
            title={r.title}
            meta="Recipe"
            summary={r.summary}
            toldBy={r.toldBy}
            hasAudio={Boolean(r.audioKey)}
            photoUrl={mediaUrl(r.photoKey)}
          />
        ))}
        {traditions.map((t) => (
          <EntryCard
            key={t.id}
            href={`/traditions/${t.slug}`}
            title={t.title}
            meta="Tradition"
            summary={t.summary}
            toldBy={t.toldBy}
            hasAudio={Boolean(t.audioKey)}
            photoUrl={mediaUrl(t.photoKey)}
          />
        ))}
        {memories.map((m) => (
          <EntryCard
            key={m.id}
            href={`/memories/${m.slug}`}
            title={m.title}
            meta={m.occurredOn ? `Memory · ${m.occurredOn}` : "Memory"}
            summary={m.body.slice(0, 180)}
            toldBy={m.toldBy}
            hasAudio={Boolean(m.audioKey)}
            photoUrl={mediaUrl(m.photoKey)}
          />
        ))}
      </ul>
    </section>
  );
}
