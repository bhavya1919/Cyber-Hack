// src/components/dashboard/OverviewCards/TrendBadge.tsx

interface TrendBadgeProps {
  trend: "up" | "down" | "stable" | "high" | "medium" | "low" | string;
  value: number; // percentage value
  label: string;
}

/**
 * Visual badge showing a trend arrow, percentage and a descriptive label.
 * Uses the cyber design system palette for consistency.
 */
export const TrendBadge = ({ trend, value, label }: TrendBadgeProps) => {
  const config = {
    up: { color: "text-[#00FFC8]", bg: "bg-[#00FFC8]/8", arrow: "▲" },
    down: { color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/8", arrow: "▼" },
    stable: { color: "text-white/50", bg: "bg-white/[0.04]", arrow: "—" },
    high: { color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/8", arrow: "▲" },
    medium: { color: "text-[#FF9F43]", bg: "bg-[#FF9F43]/8", arrow: "—" },
    low: { color: "text-[#00FFC8]", bg: "bg-[#00FFC8]/8", arrow: "▼" },
  }[trend] || { color: "text-white/50", bg: "bg-white/[0.04]", arrow: "—" };

  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${config.bg} ${config.color} text-[8px] font-mono tracking-wide`}>
      <span className="leading-none">{config.arrow}</span>
      <span className="font-bold">{value}%</span>
      <span className="text-white/35 ml-0.5">{label}</span>
    </div>
  );
};
