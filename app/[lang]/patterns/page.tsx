import { getPatterns, getDictionary } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/pattern";
import { PatternBrowser } from "@/components/PatternBrowser";

type Params = Promise<{ lang: string }>;

export default async function PatternsPage({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const patterns = getPatterns(lang as Locale);
  const dict = getDictionary(lang as Locale);

  return (
    <PatternBrowser patterns={patterns} dict={dict} lang={lang} />
  );
}
