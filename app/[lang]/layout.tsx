import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { LOCALES, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/data";
import type { Locale } from "@/types/pattern";
import "../globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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

  const dict = getDictionary(lang as Locale);

  return (
    // The theme script adds a class to <html> before hydration.
    <html lang={lang} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="flex h-screen overflow-hidden bg-bg">
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header lang={lang as Locale} dict={dict} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-bg">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
