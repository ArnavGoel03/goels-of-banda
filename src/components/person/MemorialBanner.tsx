import type { Person } from "@/data/types";

function lifespanLine(person: Person): string {
  const b = person.birth?.year;
  const d = person.death?.year;
  const approx = person.birth?.yearApprox ? "c. " : "";
  if (b && d) return `${approx}${b} – ${d}`;
  if (d) return `d. ${d}`;
  if (b) return `b. ${approx}${b}`;
  return "In memoriam";
}

function isPlaceholder(p: Person): boolean {
  return p.publicity === "minimal" && !p.birth?.year && !p.death?.year;
}

export function MemorialBanner({ person }: { person: Person }) {
  if (person.isLiving) return null;
  if (isPlaceholder(person)) return null;

  return (
    <aside
      className="mt-6 overflow-hidden rounded-md border border-ink-200 bg-gradient-to-b from-parchment-dark to-parchment p-5"
      aria-label="In memoriam"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-500 font-medium">
        In memoriam
      </p>
      <p className="mt-2 font-serif text-lg text-ink-800">
        {lifespanLine(person)}
        {person.death?.place ? (
          <span className="text-ink-500"> · {person.death.place}</span>
        ) : null}
      </p>
      {person.death?.note ? (
        <p className="mt-1 text-sm italic text-ink-600">{person.death.note}</p>
      ) : null}
    </aside>
  );
}
