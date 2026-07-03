import { SectionHeader } from "./Section";
import { AlertTriangle, ShieldAlert, CheckCircle2, Sparkles, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Command Center"
          title={<>Every signal, <span className="text-gradient">one pane of glass.</span></>}
        />
        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-2 shadow-[0_30px_90px_-30px_rgba(0,229,255,0.35)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF4D6D]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9F43]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#00FFC8]/70" />
            </div>
            <div className="ml-4 flex-1 text-center font-mono text-[11px] text-white/40">
              asi-console Â· console.aishadow.net/threats
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[220px_1fr_260px]">
            <aside className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">Workspace</div>
              <div className="mt-3 space-y-1 text-sm">
                {["Overview", "Threat Graph", "Campaigns", "Actors", "Assets", "Playbooks", "Reports"].map((s, i) => (
                  <div key={s} className={`rounded-lg px-3 py-2 ${i === 1 ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-white/70 hover:bg-white/5"}`}>{s}</div>
                ))}
              </div>
            </aside>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Active Threats", v: "1,284", c: "#00E5FF" },
                  { l: "Critical", v: "42", c: "#FF4D6D" },
                  { l: "Mitigated", v: "9,812", c: "#00FFC8" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-widest text-white/40">{s.l}</div>
                    <div className="mt-1 text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold">Threat Volume Â· 24h</div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#00FFC8]">
                    <Activity className="h-3 w-3" /> Live
                  </div>
                </div>
                <svg viewBox="0 0 400 120" className="h-32 w-full">
                  <defs>
                    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 40, 60, 80, 100].map((y) => (
                    <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.05" />
                  ))}
                  <path d="M0 90 L 30 80 L 60 85 L 90 60 L 120 65 L 150 40 L 180 55 L 210 30 L 240 45 L 270 25 L 300 40 L 330 20 L 360 35 L 400 15 L 400 120 L 0 120 Z" fill="url(#area)" />
                  <path d="M0 90 L 30 80 L 60 85 L 90 60 L 120 65 L 150 40 L 180 55 L 210 30 L 240 45 L 270 25 L 300 40 L 330 20 L 360 35 L 400 15" fill="none" stroke="#00E5FF" strokeWidth="1.8" />
                  <path d="M0 110 L 30 100 L 60 105 L 90 90 L 120 95 L 150 75 L 180 88 L 210 70 L 240 82 L 270 65 L 300 78 L 330 60 L 360 72 L 400 55" fill="none" stroke="#6C63FF" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-semibold">Risk Heatmap Â· Sectors Ã— Vectors</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">Last 7d</div>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 72 }).map((_, i) => {
                    const seeds = [0.9, 0.2, 0.6, 0.4, 0.85, 0.15, 0.55, 0.32, 0.78, 0.44, 0.65, 0.28];
                    const v = seeds[(i * 7) % 12] * (0.7 + ((i * 13) % 10) / 30);
                    const c = v > 0.75 ? "#FF4D6D" : v > 0.5 ? "#FF9F43" : v > 0.25 ? "#00E5FF" : "#1a2740";
                    return <div key={i} className="aspect-square rounded-[3px]" style={{ background: c, opacity: 0.3 + v * 0.7 }} />;
                  })}
                </div>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-xl border border-[#FF4D6D]/30 bg-[#FF4D6D]/5 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF4D6D]">
                  <AlertTriangle className="h-3.5 w-3.5" /> Critical Alert
                </div>
                <div className="mt-2 text-sm font-semibold">Zero-day exploit CVE-2026-4471</div>
                <div className="mt-1 text-xs text-white/60">Weaponized by BlackShadow Â· 6 orgs targeted</div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <span>severity</span>
                  <span className="text-[#FF4D6D]">9.7 Â· CRIT</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00FFC8]">
                  <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Isolate 3 exposed hosts and deploy detection rule <span className="font-mono text-[#00E5FF]">ASI-DR-4471</span>. Estimated dwell reduction: 84%.
                </p>
                <button className="mt-3 w-full rounded-lg border border-[#00FFC8]/40 bg-[#00FFC8]/10 py-1.5 text-xs font-semibold text-[#00FFC8]">Apply Playbook</button>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="text-xs font-semibold">Recent Activity</div>
                <ul className="mt-3 space-y-2 text-xs">
                  {[
                    { i: ShieldAlert, t: "APT-441 infra spun up", c: "#FF9F43" },
                    { i: CheckCircle2, t: "Playbook PB-021 executed", c: "#00FFC8" },
                    { i: ShieldAlert, t: "Phishing kit registered", c: "#00E5FF" },
                  ].map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <a.i className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: a.c }} />
                      <span className="text-white/70">{a.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
