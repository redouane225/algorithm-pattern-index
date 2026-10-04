"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { swapLocaleInPath } from "@/lib/i18n";
import type { Locale } from "@/types/pattern";

interface Props {
  lang: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function Header({ lang, dict }: Props) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const isLight = document.documentElement.classList.contains("light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isDark) setTheme("dark");
     
    else if (isLight) setTheme("light");
     
    else setTheme("system");
  }, []);

  const changeTheme = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    if (newTheme !== "system") {
      html.classList.add(newTheme);
    }
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
  };

  const targetLang = lang === "en" ? "fr" : "en";
  const targetPath = swapLocaleInPath(pathname || "/", targetLang);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link 
          href={`/${lang}`} 
          className="text-lg font-bold text-text hover:text-accent focus-visible:ring-2 focus-visible:ring-focus-ring outline-none rounded-sm px-1"
        >
          {/* Using a generic 'Home' or similar if dict doesn't have it, but we can just use the site title */}
          Algorithmic Patterns
        </Link>

        <div className="flex items-center gap-4">
          <select 
            value={theme}
            onChange={(e) => changeTheme(e.target.value as "system" | "light" | "dark")}
            className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-focus-ring outline-none"
            aria-label={dict.nav.theme}
          >
            <option value="system">{dict.nav.system}</option>
            <option value="light">{dict.nav.light}</option>
            <option value="dark">{dict.nav.dark}</option>
          </select>

          <Link
            href={targetPath}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring outline-none"
          >
            {dict.nav.language}
          </Link>
        </div>
      </div>
    </header>
  );
}
