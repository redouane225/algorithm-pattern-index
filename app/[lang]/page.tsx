import { getDictionary } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/pattern";
import Link from "next/link";

type Params = Promise<{ lang: string }>;

export default async function IndexPage({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang as Locale);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#0a0a0a] text-white w-full">
      <style>{`
        @keyframes trace {
          0% { stroke-dashoffset: 300; }
          100% { stroke-dashoffset: 0; }
        }
        .anim-trace {
          stroke-dasharray: 20 280;
          animation: trace 6s linear infinite;
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
          20% { opacity: 1; transform: scale(1.8); filter: brightness(1.5); }
        }
        .node { transform-origin: center; transform-box: fill-box; }
      `}</style>
      {/* Cool Algorithm/Data Structure SVG Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Base faint lines */}
          <path d="M 20 30 L 40 15 L 60 40 L 80 25 L 70 65 L 50 85 L 30 70 Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
          <path d="M 20 30 L 30 70 L 60 40 L 50 85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
          <path d="M 40 15 L 80 25 L 60 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />

          {/* Animated trace line */}
          <path d="M 20 30 L 40 15 L 60 40 L 80 25 L 70 65 L 50 85 L 30 70 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.4" className="anim-trace" strokeLinecap="round" />

          {/* Abstract Nodes - delay matches line arrival */}
          <circle cx="20" cy="30" r="1.5" fill="#EF4444" className="node" style={{ animation: 'glow 6s linear infinite 0s' }} />
          <circle cx="40" cy="15" r="1" fill="#3B82F6" className="node" style={{ animation: 'glow 6s linear infinite 0.7s' }} />
          <circle cx="60" cy="40" r="2" fill="#9CA3AF" className="node" style={{ animation: 'glow 6s linear infinite 1.4s' }} />
          <circle cx="80" cy="25" r="1.5" fill="#EF4444" className="node" style={{ animation: 'glow 6s linear infinite 2.1s' }} />
          <circle cx="70" cy="65" r="1.5" fill="#EF4444" className="node" style={{ animation: 'glow 6s linear infinite 2.8s' }} />
          <circle cx="50" cy="85" r="1" fill="#9CA3AF" className="node" style={{ animation: 'glow 6s linear infinite 3.5s' }} />
          <circle cx="30" cy="70" r="2" fill="#3B82F6" className="node" style={{ animation: 'glow 6s linear infinite 4.2s' }} />
        </svg>
      </div>

      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-red-500/10 rounded-full blur-[80px] md:blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen pointer-events-none animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 md:w-[400px] md:h-[400px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-screen pointer-events-none animate-[pulse_10s_ease-in-out_infinite_2s]"></div>
      
      <div className="relative z-10 max-w-4xl px-4 md:px-6 space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-12 md:mt-16">
        <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-widest uppercase backdrop-blur-sm border border-white/10 text-center">
          <span className="bg-gradient-to-r from-red-400 via-gray-400 to-blue-400 bg-clip-text text-transparent">Learn &bull; Recognize &bull; Solve</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-sm pb-2 break-words">
          {dict.site.title}
        </h1>
        
        <div className="space-y-4">
           <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
             {dict.site.tagline}
           </p>
        </div>
        
        <div className="pt-12">
          <Link 
            href={`/${lang}/patterns`}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] hover:border-red-500/40"
          >
            <span>Browse Patterns</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 transition-transform group-hover:translate-x-1 text-blue-400 group-hover:text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
