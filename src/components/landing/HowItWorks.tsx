import { SectionHeader } from "./Section";
import { Database, Cpu, Sparkles, ListChecks, Rocket } from "lucide-react";

const steps = [
  { icon: Database, title: "Collect", desc: "Ingest telemetry from surface web, deep web, dark web, feeds & sensors." },
  { icon: Cpu, title: "Analyze", desc: "Correlate signals through LLM-driven reasoning and graph analytics." },
  { icon: Sparkles, title: "Predict", desc: "Forecast likely attacks, victims, and TTPs before they materialize." },
  { icon: ListChecks, title: "Prioritize", desc: "Rank threats by exploitability, blast radius, and business impact." },
  { icon: Rocket, title: "Respond", desc: "Automate playbooks, patching guidance, and analyst handoffs." },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="How It Works"
          title={<>An autonomous cycle, <span className="text-gradient">running 24/7.</span></>}
          desc="Five continuous phases that transform raw signal into decisive intelligence."
        />
        <div className="relative mt-20">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent md:block" />
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#00E5FF]/30 bg-[#05070A] text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.25)]">
                  <s.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Step 0{i + 1}
                </div>
                <h3 className="mt-2 text-center text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-center text-sm text-[#A0AEC0]">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}