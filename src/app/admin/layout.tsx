import { ClerkProvider, SignInButton } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { getContributor } from "@/lib/auth";
import { adminEmails, hasAuth } from "@/lib/config";

export const dynamic = "force-dynamic";

async function Gate({ children }: { children: React.ReactNode }) {
  const contributor = await getContributor();

  if (!contributor) {
    return (
      <section className="mx-auto max-w-lg px-6 pt-20 pb-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">Sign in</h1>
        <div className="mt-6">
          <SignInButton mode="modal">
            <button className="rounded-md bg-ink-900 px-6 py-3 text-white hover:opacity-90">
              Sign in
            </button>
          </SignInButton>
        </div>
      </section>
    );
  }

  if (!contributor.isAdmin) {
    return (
      <section className="mx-auto max-w-lg px-6 pt-20 pb-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">Not for you</h1>
        <p className="mt-3 text-ink-600">
          {adminEmails().length === 0
            ? "No admin is configured on this deployment, so nobody can moderate here."
            : "This account cannot moderate the family record."}
        </p>
      </section>
    );
  }

  return <>{children}</>;
}

// Everything under /admin is behind the allowlist, including the older snippet
// and upload tools, which used to be reachable by anyone who knew the URL.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasAuth) {
    return (
      <section className="mx-auto max-w-lg px-6 pt-20 pb-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          Sign-in is not configured
        </h1>
        <p className="mt-3 text-ink-600">
          Set the Clerk keys on this deployment before using the admin tools.
        </p>
      </section>
    );
  }

  return (
    <ClerkProvider dynamic>
      <Gate>{children}</Gate>
      <Toaster position="top-center" richColors />
    </ClerkProvider>
  );
}
