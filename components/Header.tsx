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

export function Header({ lang, dict }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [query, setQuery] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const isLight = document.documentElement.classList.contains("light");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname && !pathname.match(/^\/(en|fr)$/)) {
      // If we are on a detail page, navigate to home with search
      router.push(`/${lang}?q=${encodeURIComponent(query)}`);
    } else {
      // If on home page, update URL
      const newUrl = new URL(window.location.href);
      if (query) newUrl.searchParams.set("q", query);
      else newUrl.searchParams.delete("q");
      router.replace(newUrl.pathname + newUrl.search);
    }
  };

  const targetLang = lang === "en" ? "fr" : "en";
  const targetPath = swapLocaleInPath(pathname || "/", targetLang);

  const isHero = pathname === `/${lang}` || pathname === "/";
  const headerClasses = isHero 
    ? "h-16 md:h-20 flex items-center justify-between px-4 md:px-8 absolute top-0 w-full z-50 gap-4 text-white"
    : "h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-surface/80 backdrop-blur-lg border-b border-border sticky top-0 w-full z-50 gap-4";

  return (
    <header className={headerClasses}>
      <Link href={`/${lang}`} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-lg shrink-0">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xl shadow-sm ${isHero ? "bg-white text-[#0a0a0a]" : "bg-text text-bg"}`}>AP</div>
        <span className={`font-semibold leading-tight text-sm tracking-wide hidden sm:block ${isHero ? "text-white" : ""}`}>Algorithm<br/>Pattern Index</span>
      </Link>

      <div className={`flex-1 max-w-md w-full ml-auto ${isHero ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : ""}`}>
        <form onSubmit={handleSearch} className="relative hidden md:block w-full">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${isHero ? "text-white/50" : "text-text-muted"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="search" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.search?.placeholder || "Search patterns..."}
            className={`w-full rounded-full pl-11 pr-4 py-2 text-sm focus:ring-2 focus:ring-focus-ring outline-none transition-shadow ${
              isHero 
                ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20" 
                : "bg-surface-muted border border-border/50 text-text"
            }`}
            aria-label={dict.search?.label || "Search"}
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
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

        {/* User Avatar Placeholder replacing with language switch */}
        <Link
          href={targetPath}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            isHero ? "bg-emerald-500 text-white" : "bg-accent text-accent-contrast"
          }`}
          title={dict.nav?.language || "Language"}
        >
          {targetLang.toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
