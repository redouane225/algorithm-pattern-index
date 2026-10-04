import { getDictionary, getPatterns } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/pattern";
import Link from "next/link";
import { HeroGraph3D } from "@/components/HeroGraph3D";

type Params = Promise<{ lang: string }>;

export default async function IndexPage({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang as Locale);
  const count = getPatterns(lang as Locale).length;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <style>{`
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 28px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.25); } 50% { box-shadow: 0 0 44px rgba(59,130,246,0.55), 0 0 0 1px rgba(59,130,246,0.4); } }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        .fade-up { opacity: 0; animation: fadeUp .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .blue-glow { animation: glowPulse 4s ease-in-out infinite; }
        .blue-glow:hover { box-shadow: 0 0 60px rgba(59,130,246,0.7), 0 0 0 1px rgba(59,130,246,0.6); }
        @media (prefers-reduced-motion: reduce) { .floaty,.blue-glow { animation: none !important; } .blue-glow { box-shadow: 0 0 32px rgba(59,130,246,0.45); } .fade-up { opacity: 1; animation: none; } }
      `}</style>

      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-20">
        {/* LEFT: copy */}
        <div className="flex flex-col items-start text-left">
          <Link
            href={`/${lang}/patterns`}
            className="fade-up group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-gray-300 backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.08]"
          >
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white">{count}</span>
            <span>Learn &bull; Recognize &bull; Solve</span>
            <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>

          <h1
            className="fade-up mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            {dict.site.title}
          </h1>

          <p
            className="fade-up mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl"
            style={{ animationDelay: "240ms" }}
          >
            {dict.site.tagline}
          </p>

          <div className="fade-up mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "360ms" }}>
            <Link
              href={`/${lang}/patterns`}
              className="blue-glow group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Browse Patterns
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>

        {/* RIGHT: 3D animated graph */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden>
          <div className="absolute inset-[15%] rounded-full bg-blue-600/20 blur-[90px]" />
          <div className="absolute inset-[30%] translate-x-[20%] rounded-full bg-red-600/10 blur-[80px]" />
          <div className="relative h-full w-full">
            <HeroGraph3D />
          </div>

          <div className="floaty absolute left-[2%] top-[12%] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-300 backdrop-blur-md sm:text-[11px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Two Pointers &bull; O(n)
          </div>
          <div className="floaty absolute bottom-[10%] right-[2%] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-300 backdrop-blur-md sm:text-[11px]" style={{ animationDelay: "-3s" }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            BFS &bull; Graph
          </div>
        </div>
      </div>
    </div>
  );
}
