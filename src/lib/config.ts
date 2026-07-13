// The public half of this site is static content in src/data and must keep
// building and serving with no database, no storage and no auth configured.
// Only the contribution half needs services, so every service is optional and
// its absence degrades that half to a clear "not set up" message.

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const hasStorage = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY,
);

export const hasAuth = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

/** Contributions can only be accepted when all three are wired. */
export const canContribute = hasDatabase && hasStorage && hasAuth;

/**
 * Who may publish. Fails closed: with no allowlist set, nobody is an admin and
 * the review queue is unreachable, rather than open to every signed-in user.
 */
export function adminEmails(): string[] {
  return (process.env.GOELS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}
