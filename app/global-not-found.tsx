import type { Metadata } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import Link from "next/link";
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
        <main className="mx-auto max-w-4xl p-6 text-center space-y-4 py-20">
          <h1 className="text-4xl font-bold text-text">404 - Page Not Found / Page Introuvable</h1>
          <p className="text-text-muted">The pattern or page you are looking for does not exist. / Le patron ou la page que vous recherchez n&apos;existe pas.</p>
          <div className="pt-8">
            <Link href="/" className="rounded-md bg-accent px-4 py-2 text-accent-contrast font-medium hover:opacity-90">
              Return Home / Retour à l&apos;accueil
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
