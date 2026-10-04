import { getDictionary, getPatterns } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/pattern";
import Link from "next/link";

type Params = Promise<{ lang: string }>;

// Constellation: central hub + orbiting nodes (viewBox 0..400)
const HUB = { x: 200, y: 200 };
const NODES = [
  { x: 200, y: 60, r: 5, c: "#EF4444" },
  { x: 318, y: 112, r: 4, c: "#3B82F6" },
  { x: 340, y: 230, r: 6, c: "#9CA3AF" },
  { x: 290, y: 330, r: 4, c: "#EF4444" },
  { x: 170, y: 345, r: 5, c: "#3B82F6" },
  { x: 72, y: 280, r: 4, c: "#9CA3AF" },
  { x: 58, y: 150, r: 6, c: "#EF4444" },
  { x: 120, y: 80, r: 3, c: "#3B82F6" },
];
const CYCLE = 8; // seconds

export default async function IndexPage({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang as Locale);
  const count = getPatterns(lang as Locale).length;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <style>{`
        @keyframes spark { 0% { stroke-dashoffset: 1; opacity: 0; } 10% { opacity: 1; } 40% { stroke-dashoffset: 0; opacity: 1; } 55%,100% { stroke-dashoffset: 0; opacity: 0; } }
        @keyframes lit { 0%,100% { opacity: .35; transform: scale(1); } 8% { opacity: 1; transform: scale(1.7); } 20% { opacity: .35; transform: scale(1); } }
        @keyframes halo { 0%,100% { opacity: 0; transform: scale(.6); } 8% { opacity: .6; transform: scale(2.6); } 25% { opacity: 0; transform: scale(3); } }
        @keyframes orbit { to { transform: rotate(360deg); } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .spark { stroke-dasharray: 1; animation: spark ${CYCLE}s ease-in-out infinite; }
        .lit, .halo { transform-origin: center; transform-box: fill-box; }
        .lit { animation: lit ${CYCLE}s ease-in-out infinite; }
        .halo { animation: halo ${CYCLE}s ease-out infinite; }
        .orbit { transform-origin: 200px 200px; animation: orbit 90s linear infinite; }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        .fade-up { opacity: 0; animation: fadeUp .9s cubic-bezier(.2,.7,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) { .spark,.lit,.halo,.orbit,.floaty { animation: none !important; } .fade-up { opacity: 1; animation: none; } }
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
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gray-200 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]"
            >
              Browse Patterns
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>

        {/* RIGHT: animated constellation */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
          <div className="absolute inset-[15%] rounded-full bg-blue-600/15 blur-[90px]" />
          <div className="absolute inset-[30%] translate-x-[20%] rounded-full bg-red-600/10 blur-[80px]" />

          <svg viewBox="0 0 400 400" className="relative h-full w-full">
            <defs>
              <radialGradient id="hubGrad">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#6B7280" />
              </radialGradient>
            </defs>

            {/* orbit rings */}
            <circle cx="200" cy="200" r="145" fill="none" stroke="rgba(255,255,255,0.06)" />
            <circle cx="200" cy="200" r="95" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" />

            <g className="orbit">
              {/* faint ring links */}
              <polygon
                points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
              />
              {NODES.map((n, i) => {
                const delay = (i * CYCLE) / NODES.length;
                return (
                  <g key={i}>
                    <line x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} stroke="rgba(255,255,255,0.09)" />
                    <line
                      x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y}
                      pathLength={1}
                      stroke={n.c}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="spark"
                      style={{ animationDelay: `${delay - CYCLE * 0.4}s` }}
                    />
                    <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} className="halo" style={{ animationDelay: `${delay}s` }} />
                    <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} className="lit" style={{ animationDelay: `${delay}s` }} />
                  </g>
                );
              })}
            </g>

            {/* hub */}
            <circle cx="200" cy="200" r="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" />
            <circle cx="200" cy="200" r="8" fill="url(#hubGrad)" />
          </svg>

          {/* floating status chips */}
          <div className="floaty absolute left-[4%] top-[14%] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-300 backdrop-blur-md sm:text-[11px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Two Pointers &bull; O(n)
          </div>
          <div className="floaty absolute bottom-[12%] right-[2%] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-300 backdrop-blur-md sm:text-[11px]" style={{ animationDelay: "-3s" }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            BFS &bull; Graph
          </div>
        </div>
      </div>
    </div>
  );
}
