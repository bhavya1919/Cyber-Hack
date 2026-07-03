import { Check } from "lucide-react";
import { SectionHeader } from "./Section";

const plans = [
  {
    name: "Community",
    price: "Free",
    tag: "For researchers & individual analysts",
    features: ["Public threat feed access", "Basic threat map", "IOC lookups (5k/mo)", "Community support"],
    accent: "#00FFC8",
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    tag: "For SOCs & security teams",
    features: ["Full platform capabilities", "Predictive forecasting", "AI Copilot & summarization", "MITRE ATT&CK mapping", "SLA & 24/7 support", "SSO, SCIM, audit logs"],
    accent: "#00E5FF",
    cta: "Start Enterprise Trial",
    highlight: true,
  },
  {
    name: "Government",
    price: "Sovereign",
    tag: "For national defense & agencies",
    features: ["On-prem / air-gapped deploy", "Classified feed integration", "Sovereign data residency", "Dedicated intelligence team", "FedRAMP High / IL5 ready"],
    accent: "#6C63FF",
    cta: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Deploy at <span className="text-gradient">any scale.</span></>}
          desc="Transparent tiers designed for individual analysts, enterprise SOCs, and sovereign agencies."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 ${
                p.highlight
                  ? "border-[#00E5FF]/40 bg-gradient-to-b from-[#00E5FF]/10 to-transparent shadow-[0_20px_60px_-20px_rgba(0,229,255,0.4)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {p.highlight && (
                <div className="absolute right-6 top-6 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
                  Most chosen
                </div>
              )}
              <div className="font-mono text-xs uppercase tracking-widest" style={{ color: p.accent }}>
                {p.name}
              </div>
              <div className="mt-4 text-4xl font-bold">{p.price}</div>
              <div className="mt-1 text-xs text-white/50">{p.tag}</div>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.accent }} />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-gradient-to-r from-[#00E5FF] to-[#6C63FF] text-black shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.7)]"
                    : "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
