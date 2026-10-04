import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeScript } from "@/components/ThemeScript";
import { LOCALES, isLocale } from "@/lib/i18n";
import "../globals.css";

// Only /en and /fr exist; any other first segment is a 404.
export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Algorithm Pattern Index",
};

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    // The theme script adds a class to <html> before hydration.
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
