"use client";

import { useEffect, useState } from "react";

export function useLowBandwidth(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const conn = (navigator as unknown as {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (!conn) return;
    const evaluate = () =>
      setLow(
        Boolean(conn.saveData) ||
          conn.effectiveType === "slow-2g" ||
          conn.effectiveType === "2g" ||
          conn.effectiveType === "3g",
      );
    evaluate();
    const listener = () => evaluate();
    const target = conn as unknown as EventTarget;
    if ("addEventListener" in target) {
      target.addEventListener("change", listener);
      return () => target.removeEventListener("change", listener);
    }
  }, []);
  return low;
}

export function SlowConnectionNotice() {
  const low = useLowBandwidth();
  if (!low) return null;
  return (
    <div className="mt-5 rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 text-sm text-ink-800">
      <p className="font-medium text-ink-900">
        Your connection looks slow right now.
      </p>
      <p className="mt-1 text-xs text-ink-700">
        To keep this page snappy for you, we&rsquo;re skipping the large interactive tree
        and showing a streamlined version below instead. The full interactive tree
        (six generations, 100+ cards) will render automatically on a faster connection.
      </p>
    </div>
  );
}
