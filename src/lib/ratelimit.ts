// In-memory, per-instance. Good enough here: the thing being limited is a signed
// -in relative submitting recipes, not an anonymous public endpoint, and every
// submission is moderated anyway. A serverless instance holding its own counter
// only ever under-counts, which is the safe direction for a family site and
// costs nothing (no Redis, no paid tier).
const hits = new Map<string, number[]>();

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}
