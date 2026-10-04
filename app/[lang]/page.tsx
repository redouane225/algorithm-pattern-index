import { getPatterns, getDictionary } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Locale } from "@/types/pattern";

type Params = Promise<{ lang: string }>;

export default async function IndexPage({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const patterns = getPatterns(lang as Locale);
  const dict = getDictionary(lang as Locale);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-text">{dict.site.title}</h1>
        <p className="text-lg text-text-muted">{dict.site.tagline}</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => {
          const badgeBg = pattern.difficulty === "beginner" ? "bg-badge-beginner-bg" : pattern.difficulty === "intermediate" ? "bg-badge-intermediate-bg" : "bg-badge-advanced-bg";
          const badgeText = pattern.difficulty === "beginner" ? "text-badge-beginner-text" : pattern.difficulty === "intermediate" ? "text-badge-intermediate-text" : "text-badge-advanced-text";

          return (
            <div key={pattern.id} className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md flex flex-col">
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
            </div>
          )
        })}
      </div>
    </main>
  );
}
