import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "./Section";

const items = [
  { q: "How is AI Shadow Internet different from traditional threat intel platforms?", a: "Legacy TIPs are aggregators of yesterday's indicators. AI Shadow Internet is a reasoning platform â€” it correlates raw signals from the surface, deep and dark web with vulnerability disclosures and behavioral analytics, and forecasts likely attacks before indicators exist." },
  { q: "Where is our data processed?", a: "By default in our SOC-2 Type II regions (US, EU). Enterprise and Government deployments support sovereign residency, private cloud, and air-gapped installations." },
  { q: "How accurate are the predictions?", a: "Our published F1 for 72-hour campaign forecasts is 0.87 on public benchmarks. Every prediction ships with a confidence score, evidence trail, and MITRE mapping." },
  { q: "Does the AI copilot see our raw telemetry?", a: "Only inside your tenant. All AI inference runs against tenant-scoped indexes with zero retention. No customer data is used to train shared models â€” ever." },
  { q: "Do you offer a free tier?", a: "Yes. The Community tier gives researchers and individual analysts free access to the public feed, threat map, and 5,000 IOC lookups per month." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="relative z-10 isolate py-32 bg-[#05070A]">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow="FAQ" title={<>Answers for <span className="text-gradient">the technical buyer.</span></>} />
        <div className="mt-12 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-base font-medium">{it.q}</span>
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-[#00E5FF]">
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>
                {isOpen && <div className="px-6 pb-6 text-sm leading-relaxed text-[#A0AEC0]">{it.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
