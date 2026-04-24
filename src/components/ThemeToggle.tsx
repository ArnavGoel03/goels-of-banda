"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  html.classList.toggle("dark", resolved === "dark");
  html.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = (window.localStorage.getItem("gob:theme") as Theme | null) ?? "system";
    setTheme(stored);
    apply(stored);
    if (stored === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    window.localStorage.setItem("gob:theme", t);
    apply(t);
  };

  const next: Record<Theme, Theme> = { light: "dark", dark: "system", system: "light" };
  const label: Record<Theme, string> = { light: "☀", dark: "☾", system: "◐" };

  return (
    <button
      type="button"
      onClick={() => choose(next[theme])}
      aria-label={`Theme: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
      className="rounded-md px-2 py-1 text-sm text-ink-700 hover:bg-ink-100 hover:text-ink-900 transition-colors"
    >
      <span aria-hidden="true">{label[theme]}</span>
    </button>
  );
}
