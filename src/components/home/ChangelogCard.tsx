import { getRecentCommits } from "@/lib/changelog";
import { site } from "@/data/config";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.round((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.round(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function ChangelogCard() {
  const entries = getRecentCommits(5);
  if (entries.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-baseline justify-between border-b border-ink-100 pb-2">
        <h2 className="font-serif text-2xl font-semibold text-ink-900">
          Recently updated
        </h2>
        <a
          href={`${site.repoUrl}/commits/main`}
          rel="noopener"
          className="text-xs uppercase tracking-[0.12em] text-accent-700 hover:text-accent-800"
        >
          Full history ↗
        </a>
      </div>
      <ul className="mt-4 divide-y divide-ink-100">
        {entries.map((e) => {
          const subjectLine = e.subject.split("\n")[0];
          return (
            <li key={e.sha} className="flex items-start gap-4 py-3 text-sm">
              <span className="w-24 shrink-0 text-xs uppercase tracking-[0.12em] text-ink-500">
                {formatDate(e.date)}
              </span>
              <span className="text-ink-800">
                <a
                  href={`${site.repoUrl}/commit/${e.sha}`}
                  rel="noopener"
                  className="hover:text-accent-700"
                >
                  {subjectLine}
                </a>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
