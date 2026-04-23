import Link from "next/link";
import type { PathStep, RelationEdge } from "@/lib/relationship";

export function RelationshipPath({
  path,
  viewerIsFirst,
}: {
  path: PathStep[];
  viewerIsFirst?: boolean;
}) {
  if (path.length === 0)
    return (
      <p className="text-ink-500">No connection found in the family graph.</p>
    );
  if (path.length === 1)
    return <p className="text-ink-500">The same person.</p>;

  return (
    <ol className="space-y-4">
      {path.map((step, i) => (
        <li key={step.person.slug} className="flex items-start gap-4">
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-parchment text-[11px] font-medium text-ink-500 tabular-nums">
            {i + 1}
          </span>
          <div className="min-w-0">
            <Link
              href={`/people/${step.person.slug}`}
              className="font-serif text-lg font-semibold text-ink-900 hover:text-accent-700"
            >
              {step.person.name}
              {step.person.altNames?.[0] ? (
                <span className="ml-1.5 text-sm italic text-ink-500">
                  &ldquo;{step.person.altNames[0]}&rdquo;
                </span>
              ) : null}
            </Link>
            {step.edgeFromPrev ? (
              <p className="text-sm text-ink-500">
                {relationLine(
                  path[i - 1],
                  step.edgeFromPrev,
                  step.person.sex,
                  Boolean(viewerIsFirst) && i === 1,
                )}
              </p>
            ) : (
              <p className="text-xs uppercase tracking-[0.15em] text-accent-700">
                {viewerIsFirst ? "You" : "Start"}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function relationLine(
  prev: PathStep,
  edge: RelationEdge,
  sex: "M" | "F" | "U",
  viewerIsFirst: boolean,
): string {
  const subject = viewerIsFirst ? "your" : `${prev.person.name.split(" ")[0]}'s`;
  const role = {
    parent: sex === "F" ? "mother" : sex === "M" ? "father" : "parent",
    child: sex === "F" ? "daughter" : sex === "M" ? "son" : "child",
    spouse: sex === "F" ? "wife" : sex === "M" ? "husband" : "spouse",
    sibling: sex === "F" ? "sister" : sex === "M" ? "brother" : "sibling",
  }[edge];
  return `${subject} ${role}`;
}
