"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteContribution,
  publishContribution,
  rejectContribution,
} from "@/lib/actions";
import type { ContributionKind } from "@/lib/contributions";

export function ReviewActions({
  kind,
  id,
  title,
}: {
  kind: ContributionKind;
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(
    action: (k: ContributionKind, i: string) => Promise<{ ok: boolean; error?: string }>,
    success: string,
  ) {
    startTransition(async () => {
      const res = await action(kind, id);
      if (!res.ok) {
        toast.error(res.error ?? "That did not work.");
        return;
      }
      toast.success(success);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(publishContribution, "Published.")}
        className="rounded-md bg-ink-900 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
      >
        Publish
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(rejectContribution, "Held back.")}
        className="rounded-md border border-ink-300 px-4 py-2 text-sm text-ink-800 hover:bg-parchment-dark disabled:opacity-60"
      >
        Hold back
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete "${title}" and its photo and voice note for good?`)) return;
          run(deleteContribution, "Deleted.");
        }}
        className="rounded-md px-4 py-2 text-sm text-ink-500 hover:text-ink-900 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}
