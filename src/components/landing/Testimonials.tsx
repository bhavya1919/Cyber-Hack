import { SectionHeader } from "./Section";

const items = [
  { quote: "The predictive layer surfaces campaigns two to three days before our peer feeds. It's changed how we allocate defensive budget.", name: "M. Ardagna", role: "CISO, European Central Bank (demo)" },
  { quote: "AI Shadow Internet turned our five-analyst SOC into the equivalent of a twenty-person team. The copilot is uncannily good.", name: "R. Okonkwo", role: "Head of SOC, Nation-scale Telco (demo)" },
  { quote: "The graph view alone justified the deployment. Attribution work that used to take weeks now takes an afternoon.", name: "L. Petrov", role: "Principal Threat Analyst, CERT (demo)" },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Field Notes"
          title={<>Trusted by defenders <span className="text-gradient">at the frontier.</span></>}
          desc="Testimonials shown are illustrative demo content for evaluation purposes."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8">
              <svg className="mb-4 h-6 w-6 text-[#00E5FF]/60" viewBox="0 0 24 24" fill="currentColor"><path d="M9 7H4v10h5V7zm11 0h-5v10h5V7z" /></svg>
              <blockquote className="text-base leading-relaxed text-white/85">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] text-xs font-bold text-black">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
