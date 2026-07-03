import { Brain, Globe2, TrendingUp, Bug, Fish, GitBranch, Zap, ShieldCheck, Bot, Gauge } from "lucide-react";
import { SectionHeader } from "./Section";

const items = [
  { icon: Brain, title: "AI Threat Intelligence", desc: "Continuously ingested signals fused by LLM-driven reasoning to surface what matters." },
  { icon: Globe2, title: "Global Threat Map", desc: "Real-time geographical view of active campaigns, attack vectors, and infrastructure." },
  { icon: TrendingUp, title: "Predictive Forecasting", desc: "Machine learning models forecast the next 72 hours of likely attack activity." },
  { icon: Bug, title: "Malware Analysis", desc: "Static, dynamic and behavioral analysis with automated YARA rule generation." },
  { icon: Fish, title: "Phishing Detection", desc: "Adversarial-trained classifiers detect novel phishing kits within seconds of registration." },
  { icon: GitBranch, title: "Threat Relationship Graph", desc: "Interactive graph linking actors, infrastructure, malware, victims and TTPs." },
  { icon: Zap, title: "Incident Response Assistant", desc: "Playbook automation and evidence collection accelerated by AI-assisted triage." },
  { icon: ShieldCheck, title: "Vulnerability Intelligence", desc: "Prioritized CVEs enriched with exploitability, weaponization and blast-radius signals." },
  { icon: Bot, title: "AI Security Copilot", desc: "Conversational analyst that queries your telemetry in natural language, 24/7." },
  { icon: Gauge, title: "Organization Risk Scoring", desc: "Continuous, external-only risk scoring across your organization and third parties." },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Platform Capabilities"
          title={<>One platform. <span className="text-gradient">Every cyber signal.</span></>}
          desc="A unified AI backbone spanning intelligence collection, analysis, prediction, and response."
        />
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#00E5FF]/30"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(400px circle at 50% 0%, rgba(0,229,255,0.15), transparent 60%)" }} />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)] transition group-hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-base font-semibold leading-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A0AEC0]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
