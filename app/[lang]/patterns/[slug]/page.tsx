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
    <main className="mx-auto max-w-4xl p-6 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link href={`/${lang}`} className="text-accent hover:underline inline-flex items-center gap-1">
          &larr; {dict.detail.back}
        </Link>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-text">{pattern.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={`capitalize rounded-full px-2.5 py-1 font-medium ${badgeBg} ${badgeText}`}>
            {dict.difficulties[pattern.difficulty]}
          </span>
          <span className="rounded-full bg-surface-muted border border-border px-2.5 py-1 text-text-muted font-medium">
            {dict.categories[pattern.category]}
          </span>
        </div>
      </header>

      {/* 1. When you see this... */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.recognize}</h2>
        <ul className="list-disc pl-5 space-y-2 text-text-muted">
          {pattern.recognize.map((clue, idx) => (
            <li key={idx}>{clue}</li>
          ))}
        </ul>
      </section>

      {/* 2. Core Idea */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.idea}</h2>
        <p className="text-text-muted leading-relaxed">{pattern.idea}</p>
      </section>

      {/* 3. Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.pseudocode}</h2>
        <div className="bg-surface rounded-xl border border-border p-6 overflow-x-auto shadow-sm">
          <ol className="list-decimal pl-4 space-y-2 font-mono text-sm text-text">
            {pattern.pseudocode.map((step, idx) => (
              <li key={idx} className="pl-2">{step}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Complexity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.complexity}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-surface border border-border rounded-lg p-4 shadow-sm text-center">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">{dict.detail.time}</div>
            <div className="mt-1 font-mono font-medium text-lg text-text">{pattern.time}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 shadow-sm text-center">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">{dict.detail.space}</div>
            <div className="mt-1 font-mono font-medium text-lg text-text">{pattern.space}</div>
          </div>
        </div>
      </section>

      {/* 5. Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.example}</h2>
        <div className="bg-badge-neutral-bg text-badge-neutral-text rounded-xl p-6 space-y-4">
          <div>
            <span className="font-semibold">{dict.detail.problem}</span> {pattern.example.problem}
          </div>
          <div>
            <span className="font-semibold">{dict.detail.why}</span> {pattern.example.why}
          </div>
        </div>
      </section>

      {/* 6. Related Patterns */}
      {pattern.related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text border-b border-border pb-2">{dict.detail.related}</h2>
          <div className="flex flex-wrap gap-3">
            {pattern.related.map(relId => {
              const relPattern = getPattern(lang as Locale, relId);
              if (!relPattern) return null;
              return (
                <Link 
                  key={relId} 
                  href={`/${lang}/patterns/${relId}`}
                  className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 font-medium text-accent hover:bg-surface-muted transition-colors shadow-sm"
                >
                  {relPattern.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
