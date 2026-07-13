import type { Metadata } from "next";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ContributeSheets, type PersonOption } from "@/components/contribute/ContributeSheets";
import { getContributor } from "@/lib/auth";
import { canContribute, hasAuth } from "@/lib/config";
import { people } from "@/data/people";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Add a recipe, a tradition, a memory",
  description:
    "Record a family recipe, custom or memory, in the voice of the person it came from.",
  robots: { index: false, follow: false },
};

// A session is read here, so this page is rendered per request. It is the only
// page on the site that is, which is the point: the public history stays static.
export const dynamic = "force-dynamic";

export default async function NewContributionPage() {
  if (!canContribute) {
    return (
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          Contributions are not switched on yet
        </h1>
        <p className="mt-3 text-ink-600">
          This deployment has no database, storage or sign-in configured, so there
          is nowhere to put a recipe yet. In the meantime you can still{" "}
          <Link href="/contribute" className="text-accent-700 underline">
            email it in
          </Link>
          .
        </p>
      </section>
    );
  }

  const contributor = hasAuth ? await getContributor() : null;

  if (!contributor) {
    return (
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {site.shortName}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">
          Sign in to add to the family record
        </h1>
        <p className="mt-4 text-ink-600">
          A name and an email, so we know who to thank and who to ask when a
          detail needs checking. Nothing you add appears on the site until it has
          been read through.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <SignUpButton mode="modal">
            <button className="rounded-md bg-ink-900 px-6 py-3 text-white hover:opacity-90">
              Create an account
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="rounded-md border border-ink-300 px-6 py-3 text-ink-900 hover:bg-parchment-dark">
              I have one
            </button>
          </SignInButton>
        </div>
      </section>
    );
  }

  // Oldest first: the people whose recipes and memories are most at risk of
  // being lost are the ones you should be prompted to pick.
  const options: PersonOption[] = [...people]
    .sort((a, b) => (a.generation ?? 99) - (b.generation ?? 99) || a.name.localeCompare(b.name))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      hint: [p.familyRole, p.currentLocation].filter(Boolean).join(", ") || undefined,
    }));

  return (
    <section className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
            Add to the record
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900 leading-[1.1]">
            Write down one thing today
          </h1>
        </div>
        <UserButton />
      </div>

      <p className="mt-4 text-ink-600">
        One recipe, one custom, one story. The people who carry them will not
        always be here to ask, and a voice note takes two minutes.
      </p>
      {contributor.isAdmin ? (
        <p className="mt-3 text-sm">
          <Link href="/admin/review" className="text-accent-700 underline">
            Review what is waiting
          </Link>
        </p>
      ) : null}

      <div className="mt-10">
        <ContributeSheets people={options} />
      </div>
    </section>
  );
}
