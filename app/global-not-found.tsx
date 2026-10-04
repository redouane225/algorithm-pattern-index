import type { Metadata } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
};

// Rendered for URLs outside any language (e.g. /de). There is no locale to read,
// so this page is bilingual.
export default function GlobalNotFound(): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <main className="mx-auto max-w-2xl p-6">
          <h1 className="text-3xl font-semibold">404</h1>
        </main>
      </body>
    </html>
  );
}
