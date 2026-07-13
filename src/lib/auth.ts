import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "./config";

export type Contributor = {
  userId: string;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
};

/**
 * The signed-in contributor, or null. Anyone with a Clerk account may submit,
 * because we cannot know every cousin's email in advance; nothing they submit
 * is public until an admin publishes it, so the moderation queue, not the sign
 * -up page, is the gate.
 */
export async function getContributor(): Promise<Contributor | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const verified =
    user?.primaryEmailAddress?.verification?.status === "verified";
  return {
    userId,
    email,
    name:
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
      user?.username ||
      null,
    // An unverified email must never satisfy the admin allowlist: sign-up lets
    // anyone type an address, and only verification proves they hold it.
    isAdmin: verified && isAdminEmail(email),
  };
}

export async function requireContributor(): Promise<Contributor> {
  const contributor = await getContributor();
  if (!contributor) throw new Error("Sign in to contribute.");
  return contributor;
}

export async function requireAdmin(): Promise<Contributor> {
  const contributor = await requireContributor();
  if (!contributor.isAdmin) throw new Error("Not allowed.");
  return contributor;
}
