import { FileText, UserSearch, MessageSquare, TrendingUp, Target, Fingerprint, Wand2 } from "lucide-react";
import { SectionHeader } from "./Section";

const items = [
  { icon: FileText, title: "AI Threat Summarization", desc: "Analyst-grade briefs generated from raw evidence in seconds." },
  { icon: UserSearch, title: "Threat Actor Profiling", desc: "Attribution built from behavior, infrastructure and language." },
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask your data in natural language. Answers with evidence." },
  { icon: TrendingUp, title: "Risk Prediction", desc: "Forward-looking scores for likely targets and TTPs." },
  { icon: Target, title: "MITRE ATT&CK Mapping", desc: "Auto-mapping of every alert to the ATT&CK matrix." },
  { icon: Fingerprint, title: "IOC Extraction", desc: "Structured indicators pulled from documents, chats, PCAPs." },
  { icon: Wand2, title: "Automated Response", desc: "Recommended actions with confidence & rationale." },
];

export default function AIFeatures() {
  return (
    <section className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="AI Core"
          title={<>Trained on the <span className="text-gradient">adversary's playbook.</span></>}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-[#6C63FF]/30 bg-gradient-to-br from-[#6C63FF]/15 via-[#00E5FF]/5 to-transparent p-8 lg:col-span-1 lg:row-span-2">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00E5FF]/20 blur-3xl" />
            <div className="text-xs font-mono uppercase tracking-widest text-[#00FFC8]">Shadow-GPT Â· v3</div>
            <h3 className="mt-4 text-3xl font-bold leading-tight">A security-native<br />reasoning engine.</h3>
            <p className="mt-4 text-sm text-[#A0AEC0]">Fine-tuned on 12+ years of threat reports, incident timelines, malware corpora, and adversary tradecraft â€” sealed behind zero-retention inference.</p>
            <div className="mt-6 space-y-2 font-mono text-xs">
              {[
                ["Reasoning tokens", "48.2 B"],
                ["Context window", "1.2 M"],
                ["Latency p95", "312 ms"],
                ["Hallucination rate", "0.4%"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/5 py-1.5">
                  <span className="text-white/50">{k}</span>
                  <span className="text-[#00E5FF]">{v}</span>
                </div>
              ))}
            </div>
          </div>
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#00FFC8]/30 hover:bg-white/[0.05]">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#00FFC8]/30 bg-[#00FFC8]/10 text-[#00FFC8]">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#A0AEC0]">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
