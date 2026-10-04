"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { swapLocaleInPath } from "@/lib/i18n";
import type { Locale } from "@/types/pattern";

interface Props {
  lang: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const RECENT_KEY = "recent-searches";

export function Header({ lang, dict }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [query, setQuery] = useState(searchParams?.get("q") || "");

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [desktopFocus, setDesktopFocus] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setRecent(saved.filter((s) => typeof s === "string").slice(0, 2));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const runSearch = (raw: string) => {
    const q = raw.trim();
    if (q) {
      const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 2);
      setRecent(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
    }
    setQuery(q);
    setMobileOpen(false);
    setDesktopFocus(false);
    const searchString = q ? `?q=${encodeURIComponent(q)}` : "";
    if (pathname && !pathname.match(/^\/(en|fr)\/patterns$/)) {
      router.push(`/${lang}/patterns${searchString}`);
    } else {
      router.replace(`${pathname || `/${lang}/patterns`}${searchString}`);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    runSearch((formData.get("q") as string) ?? query);
  };

  const recentLabel = lang === "fr" ? "Recherches récentes" : "Recent searches";
  const renderRecent = (dark: boolean) =>
    recent.length > 0 ? (
      <div className="mt-3">
        <p className={`px-1 text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-white/50" : "text-text-muted"}`}>{recentLabel}</p>
        <ul className="mt-1">
          {recent.map((r) => (
            <li key={r}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => runSearch(r)}
                className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-2 text-left text-sm transition-colors ${dark ? "text-white/90 hover:bg-white/10" : "text-text hover:bg-surface-muted"}`}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="truncate">{r}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const targetLang = lang === "en" ? "fr" : "en";
  const targetPath = swapLocaleInPath(pathname || "/", targetLang);

  const isHero = pathname === `/${lang}` || pathname === "/";
  const headerClasses = isHero 
    ? "h-16 md:h-20 flex items-center justify-between px-4 md:px-8 absolute top-0 w-full z-50 gap-4 text-white"
    : "h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-surface/80 backdrop-blur-lg border-b border-border sticky top-0 w-full z-50 gap-4";

  return (
    <header className={headerClasses}>
      <Link href={`/${lang}`} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-full shrink-0 transition-transform hover:scale-105">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm tracking-tighter shadow-sm border ${isHero ? "bg-black/40 text-white border-white/20 backdrop-blur-md" : "bg-black text-white border-black"}`}>
          AP.
        </div>
      </Link>

      <div className={`flex-1 max-w-md w-full ml-auto ${isHero ? "invisible pointer-events-none" : ""}`} aria-hidden={isHero || undefined}>
        <form onSubmit={handleSearch} className="relative hidden md:block w-full">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${isHero ? "text-white/50" : "text-text-muted"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="search" 
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setDesktopFocus(true)}
            onBlur={() => setDesktopFocus(false)}
            placeholder={dict.search?.placeholder || "Search patterns..."}
            className={`w-full rounded-full pl-11 pr-4 py-2 text-sm focus:ring-2 focus:ring-focus-ring outline-none transition-shadow ${
              isHero 
                ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:bg-white/10" 
                : "bg-surface-muted border border-border/50 text-text"
            }`}
            aria-label={dict.search?.label || "Search"}
          />
          {desktopFocus && recent.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border p-2 shadow-xl ${isHero ? "border-white/10 bg-black/90 backdrop-blur-md" : "border-border bg-surface"}`}>
              {renderRecent(isHero)}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile search button (content pages only) */}
        {!isHero && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring text-text-muted hover:text-text hover:bg-surface-muted"
          aria-label={dict.search?.label || "Search"}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        )}
        {/* Theme Toggle (Moon / Sun icon) */}
        {!isHero && (
          <button
            onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-text-muted hover:text-text rounded-full hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={dict.nav?.theme || "Theme"}
          >
            {theme === "dark" ? (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        )}

        {/* Language switch */}
        <Link
          href={targetPath}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            isHero ? "bg-black/60 text-white border border-white/20 backdrop-blur-sm" : "bg-black text-white"
          }`}
          title={dict.nav?.language || "Language"}
        >
          {targetLang.toUpperCase()}
        </Link>
      </div>

      {/* Mobile search overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.search?.label || "Search"}
            className="mx-3 mt-3 rounded-2xl border border-border bg-surface p-3 text-text shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  autoFocus
                  type="search"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={dict.search?.placeholder || "Search patterns..."}
                  aria-label={dict.search?.label || "Search"}
                  enterKeyHint="search"
                  className="h-11 w-full rounded-full border border-border/50 bg-surface-muted pl-10 pr-4 text-base outline-none focus:ring-2 focus:ring-focus-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-11 rounded-full px-3 text-sm font-medium text-text-muted hover:text-text"
              >
                {lang === "fr" ? "Annuler" : "Cancel"}
              </button>
            </form>
            {renderRecent(false)}
          </div>
        </div>
      )}
    </header>
  );
}
