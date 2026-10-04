import { getPatterns, getDictionary } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Locale } from "@/types/pattern";
import { SearchAndFilter } from "@/components/SearchAndFilter";

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

      <SearchAndFilter patterns={patterns} dict={dict} />
    </main>
  );
}
