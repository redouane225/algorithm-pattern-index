import { getPatterns, getPattern, getDictionary } from "@/lib/data";
import { isLocale, LOCALES } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/pattern";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    const patterns = getPatterns(lang as Locale);
    for (const p of patterns) {
      params.push({ lang, slug: p.id });
    }
  }
  return params;
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const pattern = getPattern(lang as Locale, slug);
  if (!pattern) return {};
  return { title: pattern.name };
}

export default async function PatternPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const pattern = getPattern(lang as Locale, slug);
  if (!pattern) notFound();

  const dict = getDictionary(lang as Locale);

  const badgeBg = pattern.difficulty === "beginner" ? "bg-badge-beginner-bg" : pattern.difficulty === "intermediate" ? "bg-badge-intermediate-bg" : "bg-badge-advanced-bg";
  const badgeText = pattern.difficulty === "beginner" ? "text-badge-beginner-text" : pattern.difficulty === "intermediate" ? "text-badge-intermediate-text" : "text-badge-advanced-text";

  return (
    <main className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6 md:px-12 w-full space-y-8 md:space-y-10">
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
        <Link href={`/${lang}#all`} className="text-text-muted hover:text-text font-medium inline-flex items-center gap-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring outline-none rounded-md px-1 py-0.5">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to all patterns
        </Link>
      </nav>

      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#10B981] text-white shadow-sm">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 sm:h-8 sm:w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight break-words">{pattern.name}</h1>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeBg} ${badgeText}`}>
                {dict.difficulties[pattern.difficulty]}
              </span>
            </div>
            <p className="text-text-muted text-sm max-w-xl">{pattern.idea}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {pattern.tags.map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full bg-badge-neutral-bg px-3 py-1 text-xs font-medium text-badge-neutral-text">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-4 shrink-0 mt-2 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col rounded-lg border border-border bg-surface px-4 py-2 text-center min-w-[100px]">
             <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{dict.detail.time}</span>
             <span className="font-mono font-medium text-text text-xs sm:text-sm mt-1 truncate">{pattern.time}</span>
          </div>
          <div className="flex flex-col rounded-lg border border-border bg-surface px-4 py-2 text-center min-w-[100px]">
             <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{dict.detail.space}</span>
             <span className="font-mono font-medium text-text text-xs sm:text-sm mt-1 truncate">{pattern.space}</span>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 md:gap-10 pt-4 border-t border-border/50">
        <div className="md:col-span-2 space-y-10 md:space-y-12">
          {/* When to recognize it */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <span className="text-warning">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </span>
              {dict.detail.recognize}
            </h2>
            <div className="text-text-muted text-sm space-y-2 pl-0 sm:pl-7">
              <p>Look for:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                {pattern.recognize.map((clue, idx) => (
                  <li key={idx}>{clue}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Core Idea */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <span className="text-accent">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </span>
              {dict.detail.idea}
            </h2>
            <p className="text-text-muted text-sm pl-0 sm:pl-7 leading-relaxed">{pattern.idea}</p>
          </section>

          {/* Pseudocode */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <span className="text-text">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </span>
              {dict.detail.pseudocode}
            </h2>
            <div className="bg-[#1E293B] text-[#F8FAFC] rounded-xl p-4 sm:p-5 overflow-x-auto shadow-inner ml-0 sm:ml-7">
               <div className="flex justify-end mb-2">
                 <button className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Copy
                 </button>
               </div>
              <ol className="font-mono text-sm space-y-1.5" style={{ counterReset: 'line' }}>
                {pattern.pseudocode.map((step, idx) => {
                  const isComment = step.trim().startsWith('#') || step.trim().startsWith('//');
                  return (
                    <li key={idx} className="relative pl-6 leading-relaxed before:absolute before:left-0 before:text-[#475569] before:content-[counter(line)]" style={{ counterIncrement: 'line' }}>
                      <span className={isComment ? "text-[#94A3B8]" : "text-[#E2E8F0]"}>{step}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </section>
        </div>
        
        {/* Sidebar info */}
        <div className="space-y-8">
          {/* Example Problem */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-wide">
              <span className="text-accent">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              {dict.detail.example}
            </h2>
            <div className="bg-badge-neutral-bg text-badge-neutral-text rounded-xl p-5 space-y-3 text-sm border border-border/50 shadow-sm">
              <div>
                <span className="font-semibold block text-text mb-1">{pattern.example.problem}</span>
              </div>
              <div className="text-text-muted">
                {pattern.example.why}
              </div>
            </div>
          </section>

          {/* Related Patterns */}
          {pattern.related.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-wide">
                <span className="text-accent">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </span>
                {dict.detail.related}
              </h2>
              <div className="flex flex-col gap-2">
                {pattern.related.map(relId => {
                  const relPattern = getPattern(lang as Locale, relId);
                  if (!relPattern) return null;
                  return (
                    <Link 
                      key={relId} 
                      href={`/${lang}/patterns/${relId}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-text hover:bg-surface-muted transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-focus-ring outline-none"
                    >
                      <div className="w-6 h-6 rounded-md bg-badge-neutral-bg text-accent flex items-center justify-center shrink-0">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      {relPattern.name}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
