"use client";

import { useState, useMemo, useEffect } from "react";
import type { Pattern } from "@/types/pattern";
import { searchPatterns } from "@/lib/search";
import { CATEGORY_IDS, DIFFICULTIES } from "@/lib/taxonomy";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  patterns: Pattern[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  lang: string;
}

export function PatternBrowser({ patterns, dict, lang }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams?.get("q") || "";
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPatterns = useMemo(() => {
    return searchPatterns(patterns, query, category, difficulty, dict.categories);
  }, [patterns, query, category, difficulty, dict.categories]);

  const clearFilters = () => {
    setCategory("all");
    setDifficulty("all");
    if (query) {
      window.location.href = `/${lang}/patterns`;
    }
  };

  const getDifficultyStyles = (diff: string) => {
    if (diff === "beginner") return "bg-badge-beginner-bg text-badge-beginner-text";
    if (diff === "intermediate") return "bg-badge-intermediate-bg text-badge-intermediate-text";
    return "bg-badge-advanced-bg text-badge-advanced-text";
  };

  const PatternCard = ({ pattern }: { pattern: Pattern }) => (
    <Link 
      href={`/${lang}/patterns/${pattern.id}`} 
      className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/30 focus-visible:ring-2 focus-visible:ring-focus-ring outline-none"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-badge-neutral-bg text-accent">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-text truncate">{pattern.name}</h3>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${getDifficultyStyles(pattern.difficulty)}`}>
            {dict.difficulties[pattern.difficulty]}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">
          {pattern.recognize[0]}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {pattern.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center rounded-md bg-badge-neutral-bg px-2 py-0.5 text-xs font-medium text-badge-neutral-text">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex h-full items-center pl-2 text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
    </Link>
  );

  return (
    <div data-hydrated={mounted} className="max-w-6xl mx-auto py-12 px-6 md:px-12 w-full space-y-8 animate-in fade-in duration-300">
      <div id="patterns-grid" className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-text">{dict.patterns?.title || "All Patterns"}</h2>
            <p className="text-text-muted">{dict.patterns?.subtitle || "Browse all algorithmic patterns."}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="w-full sm:w-64">
               <label htmlFor="category-select" className="sr-only">{dict.filters?.category || "Category"}</label>
               <div className="relative">
                 <select
                   id="category-select"
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full appearance-none bg-surface border border-border text-text text-sm font-medium rounded-lg pl-4 pr-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-focus-ring cursor-pointer"
                 >
                   <option value="all">{dict.filters?.all || "All"}</option>
                   {CATEGORY_IDS.map((cat) => (
                     <option key={cat} value={cat}>
                       {dict.categories[cat]}
                     </option>
                   ))}
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
            </div>

            {/* Difficulty Dropdown */}
            <div className="w-full sm:w-48">
               <label htmlFor="difficulty-select" className="sr-only">{dict.filters?.difficulty || "Difficulty"}</label>
               <div className="relative">
                 <select
                   id="difficulty-select"
                   value={difficulty}
                   onChange={(e) => setDifficulty(e.target.value)}
                   className="w-full appearance-none bg-surface border border-border text-text text-sm font-medium rounded-lg pl-4 pr-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-focus-ring cursor-pointer"
                 >
                   <option value="all">{dict.filters?.all || "All"}</option>
                   {DIFFICULTIES.map((diff) => (
                     <option key={diff} value={diff}>
                       {dict.difficulties[diff]}
                     </option>
                   ))}
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
            </div>
          </div>
        </header>

        {query && (
           <div className="text-sm text-text-muted flex items-center justify-between">
              <span>{filteredPatterns.length} results for &quot;{query}&quot;</span>
              <button 
                onClick={clearFilters}
                className="text-accent hover:underline font-medium"
                data-testid="clear-search"
              >
                Clear Search
              </button>
           </div>
        )}

        {/* Results List */}
        {filteredPatterns.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredPatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border border-dashed p-16 text-center text-text-muted bg-surface/50">
            <p className="text-lg font-medium">{dict.results.empty}</p>
            <p className="mt-2 text-sm">{dict.results.emptyHint}</p>
            <button 
              onClick={clearFilters}
              className="mt-6 inline-block rounded-full bg-text px-6 py-2.5 text-bg font-bold hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring transition-opacity"
              data-testid="clear-filters"
            >
              {dict.filters.clear}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
