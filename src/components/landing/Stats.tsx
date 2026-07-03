import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Threats Detected Today", value: 2847391, suffix: "" },
  { label: "Active Threat Campaigns", value: 1284, suffix: "" },
  { label: "Countries Monitored", value: 194, suffix: "" },
  { label: "Malware Families", value: 47823, suffix: "" },
  { label: "Data Breaches Identified", value: 9214, suffix: "" },
  { label: "High-Risk Organizations", value: 12874, suffix: "" },
];

function Counter({ value }: { value: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min((t - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

export default function Stats() {
  return (
    <section className="relative border-y border-white/5 bg-black/30 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-3xl font-bold tracking-tight md:text-4xl">
                <span className="text-gradient">
                  <Counter value={s.value} />
                </span>
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-[#A0AEC0]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}