import { execSync } from "node:child_process";

export type ChangelogEntry = {
  sha: string;
  date: string;
  subject: string;
};

// Read the most recent N commits. Runs at build time (Node only).
// Cached at module scope so multiple pages in one build reuse it.
let cache: ChangelogEntry[] | null = null;

export function getRecentCommits(limit = 6): ChangelogEntry[] {
  if (cache) return cache.slice(0, limit);
  try {
    const out = execSync(
      `git log -${limit + 2} --pretty=format:%H%x1f%cI%x1f%s%x1e`,
      { encoding: "utf8", cwd: process.cwd(), stdio: ["ignore", "pipe", "ignore"] },
    );
    const entries = out
      .split("\x1e")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const [sha, date, subject] = chunk.split("\x1f");
        return { sha, date, subject };
      })
      .filter((e) => !e.subject.startsWith("Merge "));
    cache = entries;
    return entries.slice(0, limit);
  } catch {
    return [];
  }
}
