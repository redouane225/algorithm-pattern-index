import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl p-6 text-center space-y-4 py-20">
      <h1 className="text-4xl font-bold text-text">Page Not Found / Page Introuvable</h1>
      <p className="text-text-muted">The pattern or page you are looking for does not exist. / Le patron ou la page que vous recherchez n&apos;existe pas.</p>
      <div className="pt-8">
        <Link href="/" className="rounded-md bg-accent px-4 py-2 text-accent-contrast font-medium hover:opacity-90">
          Return Home / Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
