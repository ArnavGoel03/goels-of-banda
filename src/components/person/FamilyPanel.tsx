import type { Person } from "@/data/types";
import { getPerson } from "@/data/people";
import {
  getSiblings,
  getInLaws,
} from "@/lib/person-derivations";
import { MiniPersonLink } from "./MiniPersonLink";

export function FamilyPanel({ person }: { person: Person }) {
  const father = person.parents?.father ? getPerson(person.parents.father) : undefined;
  const mother = person.parents?.mother ? getPerson(person.parents.mother) : undefined;
  const spouse = person.spouse ? getPerson(person.spouse.slug) : undefined;
  const children = (person.children ?? [])
    .map((s) => getPerson(s))
    .filter((p): p is Person => Boolean(p));
  const siblings = getSiblings(person);
  const { parents: inLawParents, siblings: inLawSiblings } = getInLaws(person);

  const hasAny =
    father ||
    mother ||
    spouse ||
    children.length > 0 ||
    siblings.length > 0 ||
    inLawParents.length > 0 ||
    inLawSiblings.length > 0;
  if (!hasAny) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Family
      </h2>
      <div className="mt-5 space-y-6">
        {father || mother ? (
          <Row label="Parents">
            {father ? <MiniPersonLink person={father} /> : null}
            {mother ? <MiniPersonLink person={mother} /> : null}
          </Row>
        ) : null}
        {spouse ? (
          <Row label="Spouse">
            <MiniPersonLink person={spouse} />
          </Row>
        ) : null}
        {children.length > 0 ? (
          <Row label={children.length === 1 ? "Child" : "Children"}>
            {children.map((c) => (
              <MiniPersonLink key={c.slug} person={c} />
            ))}
          </Row>
        ) : null}
        {siblings.length > 0 ? (
          <Row label={siblings.length === 1 ? "Sibling" : "Siblings"}>
            {siblings.map((s) => (
              <MiniPersonLink key={s.slug} person={s} />
            ))}
          </Row>
        ) : null}
        {inLawParents.length > 0 ? (
          <Row label="In-laws">
            {inLawParents.map((p) => (
              <MiniPersonLink key={p.slug} person={p} />
            ))}
          </Row>
        ) : null}
        {inLawSiblings.length > 0 ? (
          <Row label={`${spouse?.name.split(" ")[0] ?? "Spouse"}'s siblings`}>
            {inLawSiblings.map((p) => (
              <MiniPersonLink key={p.slug} person={p} />
            ))}
          </Row>
        ) : null}
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
