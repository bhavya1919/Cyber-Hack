import { Landmark, Banknote, HeartPulse, Factory, Sword, Building2, Users } from "lucide-react";
import { SectionHeader } from "./Section";

const items = [
  { icon: Landmark, title: "Governments", desc: "Sovereign-grade intelligence for national cyber commands." },
  { icon: Banknote, title: "Financial Institutions", desc: "Fraud, ransomware and supply-chain visibility across markets." },
  { icon: HeartPulse, title: "Healthcare", desc: "Protect patient data and connected medical infrastructure." },
  { icon: Factory, title: "Critical Infrastructure", desc: "OT/ICS threat coverage for energy, water and transport." },
  { icon: Sword, title: "Defense", desc: "Air-gapped deployments with mission-classified feeds." },
  { icon: Building2, title: "Enterprises", desc: "Continuous external risk monitoring for the extended attack surface." },
  { icon: Users, title: "SOC Teams", desc: "Turn analysts into force multipliers with AI copilots." },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Enterprise Solutions"
          title={<>Built for those who <span className="text-gradient">cannot be breached.</span></>}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all hover:-translate-y-1 hover:border-[#6C63FF]/40">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-[#6C63FF]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[#A0AEC0]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
