"use client";

import { useState, useMemo } from "react";
import { Pattern } from "@/types/pattern";
import { searchPatterns } from "@/lib/search";
import { CATEGORY_IDS, DIFFICULTIES } from "@/lib/taxonomy";
import Link from "next/link";

interface Props {
  patterns: Pattern[];
  dict: any;
  lang: string;
}

export function SearchAndFilter({ patterns, dict, lang }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const filteredPatterns = useMemo(() => {
    return searchPatterns(patterns, query, category, difficulty, dict.categories);
  }, [patterns, query, category, difficulty, dict.categories]);

  const hasFilters = query !== "" || category !== "all" || difficulty !== "all";

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setDifficulty("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">{dict.search.label}</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.search.placeholder}
            className="w-full rounded-md border border-border bg-surface px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:w-48">
          <label htmlFor="category" className="sr-only">{dict.filters.category}</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
          >
            <option value="all">{dict.filters.all} ({dict.filters.category})</option>
            {CATEGORY_IDS.map((cat) => (
              <option key={cat} value={cat}>{dict.categories[cat]}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="sm:w-48">
          <label htmlFor="difficulty" className="sr-only">{dict.filters.difficulty}</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
          >
            <option value="all">{dict.filters.all} ({dict.filters.difficulty})</option>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>{dict.difficulties[diff]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header & Clear Button */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <div aria-live="polite">
          {filteredPatterns.length === 1 
            ? dict.results.count.one 
            : dict.results.count.other.replace("{count}", filteredPatterns.length)}
        </div>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-accent hover:underline focus-visible:underline"
          >
            {dict.filters.clear}
          </button>
        )}
      </div>

      {/* Results Grid */}
      {filteredPatterns.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatterns.map((pattern) => {
            const badgeBg = pattern.difficulty === "beginner" ? "bg-badge-beginner-bg" : pattern.difficulty === "intermediate" ? "bg-badge-intermediate-bg" : "bg-badge-advanced-bg";
            const badgeText = pattern.difficulty === "beginner" ? "text-badge-beginner-text" : pattern.difficulty === "intermediate" ? "text-badge-intermediate-text" : "text-badge-advanced-text";

            return (
              <Link href={`/${lang}/patterns/${pattern.id}`} key={pattern.id} className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md flex flex-col focus-visible:ring-2 focus-visible:ring-focus-ring outline-none">
                <h2 className="text-xl font-semibold text-text">{pattern.name}</h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                  <span className={`capitalize rounded-full px-2 py-0.5 font-medium ${badgeBg} ${badgeText}`}>
                    {dict.difficulties[pattern.difficulty]}
                  </span>
                  <span>&bull;</span>
                  <span>{pattern.time}</span>
                  <span>&bull;</span>
                  <span>{pattern.space}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pattern.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-muted border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border border-dashed p-12 text-center text-text-muted">
          <p className="text-lg">{dict.results.empty}</p>
          <p className="mt-2">{dict.results.emptyHint}</p>
          <button 
            onClick={clearFilters}
            className="mt-6 rounded-md bg-accent px-4 py-2 text-accent-contrast font-medium hover:opacity-90 focus-visible:opacity-90"
          >
            {dict.filters.clear}
          </button>
        </div>
      )}
    </div>
  );
}
