import { Shield, Github, Linkedin } from "lucide-react";

export default function Footer() {
  const cols = [
    { h: "Platform", l: ["Capabilities", "Threat Map", "AI Copilot", "Pricing"] },
    { h: "Company", l: ["About", "Careers", "Press", "Security"] },
    { h: "Resources", l: ["Documentation", "API Reference", "Threat Reports", "Status"] },
    { h: "Legal", l: ["Privacy", "Terms", "Compliance", "Contact"] },
  ];
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] shadow-[0_0_20px_rgba(0,229,255,0.5)]">
                <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">AI Shadow</span>
                <span className="font-mono text-[10px] tracking-widest text-[#00E5FF]/80">INTERNET</span>
              </div>
            </a>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Autonomous cyber intelligence. Predict, analyze, and neutralize threats before they become attacks.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="font-mono text-xs uppercase tracking-widest text-white/40">{c.h}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {c.l.map((li) => (
                  <li key={li}>
                    <a href="#" className="text-white/70 transition hover:text-[#00E5FF]">{li}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <div>© 2026 AI Shadow Internet. All rights reserved.</div>
          <div className="flex items-center gap-2 font-mono">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FFC8]" />
            All systems operational · asi-net v4.12
          </div>
        </div>
      </div>
    </footer>
  );
}