import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center mb-16">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E5FF]">
        <span className="h-1 w-1 rounded-full bg-[#00E5FF]" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-base text-[#A0AEC0] md:text-lg">{desc}</p>}
    </div>
  );
}