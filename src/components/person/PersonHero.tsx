import type { Person } from "@/data/types";

export function PersonHero({ person }: { person: Person }) {
  const lifespan = buildLifespan(person);
  const bylineParts = buildByline(person);

  return (
    <header className="border-b border-ink-100 pb-8">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {person.generation != null ? (
          <span className="rounded-full border border-ink-200 bg-parchment px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink-500">
            Gen {person.generation}
          </span>
        ) : null}
        {person.familyRole ? (
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent-700 font-medium">
            {person.familyRole}
          </span>
        ) : null}
      </div>

      <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-semibold text-ink-900 leading-[1.02]">
        {person.name}
        {!person.isLiving ? (
          <span className="ml-3 text-ink-300 font-normal">✝</span>
        ) : null}
      </h1>

      {person.altNames && person.altNames.length > 0 ? (
        <p className="mt-3 font-serif text-xl italic text-ink-600">
          known as {person.altNames.map((n) => `"${n}"`).join(", ")}
        </p>
      ) : null}

      {lifespan ? (
        <p className="mt-5 font-serif text-lg text-ink-700">{lifespan}</p>
      ) : null}

      {bylineParts.length > 0 ? (
        <p className="mt-2 text-sm text-ink-500">
          {bylineParts.join(" · ")}
        </p>
      ) : null}
    </header>
  );
}

function buildLifespan(person: Person): string | undefined {
  const b = person.birth?.year;
  const d = person.death?.year;
  const approx = person.birth?.yearApprox ? "c. " : "";
  if (b && d) return `${approx}${b} – ${d}`;
  if (b && person.isLiving) return `b. ${approx}${b}`;
  if (b) return `b. ${approx}${b}`;
  return undefined;
}

function buildByline(person: Person): string[] {
  const parts: string[] = [];
  if (person.occupation) parts.push(person.occupation);
  if (person.currentLocation && person.isLiving) parts.push(person.currentLocation);
  else if (person.birth?.place) parts.push(`born ${person.birth.place}`);
  if (person.birthFamilySurname)
    parts.push(`née ${person.birthFamilySurname}`);
  return parts;
}
