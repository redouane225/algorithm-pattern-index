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
      {/* Cool Algorithm/Data Structure SVG Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Abstract Nodes and Edges */}
          <circle cx="20" cy="30" r="1.5" fill="#10B981" />
          <circle cx="40" cy="15" r="1" fill="#3B82F6" />
          <circle cx="60" cy="40" r="2" fill="#8B5CF6" />
          <circle cx="80" cy="25" r="1.5" fill="#10B981" />
          <circle cx="30" cy="70" r="2" fill="#F59E0B" />
          <circle cx="50" cy="85" r="1" fill="#3B82F6" />
          <circle cx="70" cy="65" r="1.5" fill="#EF4444" />
          
          <path d="M 20 30 L 40 15 L 60 40 L 80 25 L 70 65 L 50 85 L 30 70 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
          <path d="M 20 30 L 30 70 L 60 40 L 50 85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.1" />
          <path d="M 40 15 L 80 25 L 60 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#10B981]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-screen pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl px-6 space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16">
        <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 tracking-widest uppercase backdrop-blur-sm border border-white/10">
          Learn &bull; Recognize &bull; Solve
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm pb-2">
          {dict.site.title}
        </h1>
        
        <div className="space-y-4">
           <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl leading-relaxed">
             {dict.site.tagline}
           </p>
        </div>
        
        <div className="pt-12">
          <Link 
            href={`/${lang}/patterns`}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:border-emerald-500/50"
          >
            <span>Browse Patterns</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 transition-transform group-hover:translate-x-1 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
