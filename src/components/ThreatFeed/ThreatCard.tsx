import React, { useId } from "react";
import { Threat } from "../ThreatMap/useThreatFeed";
import { Sparkles, ArrowRight, Shield, Globe, Clock, Building2, User } from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────

interface SeverityToken {
  color: string;
  bg: string;
  border: string;
  glow: string;
  label: string;
  icon: string;
}

const SEV: Record<string, SeverityToken> = {
  crit: {
    color: "#FF4D6D",
    bg: "rgba(255,77,109,0.08)",
    border: "rgba(255,77,109,0.35)",
    glow: "0 0 20px 0px rgba(255,77,109,0.20)",
    label: "CRITICAL",
    icon: "🔴",
  },
  high: {
    color: "#FF9F43",
    bg: "rgba(255,159,67,0.08)",
    border: "rgba(255,159,67,0.30)",
    glow: "0 0 20px 0px rgba(255,159,67,0.20)",
    label: "HIGH",
    icon: "🟠",
  },
  med: {
    color: "#FFD93D",
    bg: "rgba(255,217,61,0.08)",
    border: "rgba(255,217,61,0.25)",
    glow: "0 0 20px 0px rgba(255,217,61,0.20)",
    label: "MEDIUM",
    icon: "🟡",
  },
  low: {
    color: "#00FFC8",
    bg: "rgba(0,255,200,0.06)",
    border: "rgba(0,255,200,0.20)",
    glow: "0 0 20px 0px rgba(0,255,200,0.20)",
    label: "LOW",
    icon: "🟢",
  },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ThreatCardProps {
  threat: Threat;
  onClick?: (threat: Threat) => void;
  /** Index used to stagger the entrance animation delay */
  index?: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const ThreatCard: React.FC<ThreatCardProps> = ({
  threat,
  onClick,
  index = 0,
}) => {
  const labelId = useId();
  const sev = SEV[threat.severity] ?? SEV.low;
  const isCritical = threat.severity === "crit";

  // Derive display values with graceful fallbacks
  const title =
    threat.attackerActor
      ? `${threat.attackerActor} — ${threat.category} Campaign`
      : `${threat.category} Campaign`;
  const location = [threat.targetIndustry, threat.targetCountry]
    .filter(Boolean)
    .join(" • ");
  const summary =
    threat.summary ?? "AI is analyzing this threat pattern…";
  const confidence =
    threat.confidence !== undefined ? `${threat.confidence}%` : "—";
  const isVerified = threat.status === "Active" && (threat.confidence ?? 0) >= 80;

  // Staggered entrance (max 500ms delay for long lists)
  const delayMs = Math.min(index * 60, 500);

  const handleClick = () => onClick?.(threat);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(threat);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-labelledby={labelId}
      aria-label={`${sev.label} threat: ${title} in ${threat.targetCountry}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="animate-card-enter group relative flex flex-col gap-0 overflow-hidden rounded-2xl border outline-none
        transition-all duration-300 ease-out cursor-pointer
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A]
        hover:-translate-y-1 hover:shadow-2xl active:scale-[0.995]"
      style={{
        animationDelay: `${delayMs}ms`,
        borderColor: sev.border,
        background: `linear-gradient(145deg, ${sev.bg}, rgba(5,7,10,0.95))`,
        "--tw-ring-color": sev.color,
        boxShadow: `0 2px 12px rgba(0,0,0,0.4)`,
      } as React.CSSProperties}
      // Hover shadow upgraded via inline style approach
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = sev.glow + ", 0 8px 32px rgba(0,0,0,0.6)";
        (e.currentTarget as HTMLElement).style.borderColor = sev.color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.4)";
        (e.currentTarget as HTMLElement).style.borderColor = sev.border;
      }}
    >
      {/* ── Critical border trace (neon line travels once around top edge) ── */}
      {isCritical && (
        <div
          aria-hidden="true"
          className="animate-border-trace pointer-events-none absolute inset-x-0 top-0 h-[1.5px]"
        />
      )}

      {/* ── Left accent bar ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl"
        style={{ background: sev.color, opacity: 0.85 }}
      />

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3.5 px-5 pt-5 pb-4 pl-7">

        {/* Level 1 — Severity badge */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="animate-badge-pulse-once inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-widest font-mono"
            style={{
              color: sev.color,
              background: sev.bg,
              border: `1px solid ${sev.border}`,
            }}
            aria-label={`Severity: ${sev.label}`}
          >
            <span aria-hidden="true">{sev.icon}</span>
            {sev.label}
          </span>

          {/* Verified badge */}
          {isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-[#00FFC8]/10 border border-[#00FFC8]/20 px-2 py-[2px] text-[9px] font-mono uppercase tracking-wider text-[#00FFC8]">
              <Shield className="h-2.5 w-2.5" aria-hidden="true" />
              AI Verified
            </span>
          )}
        </div>

        {/* Level 2 — Threat title */}
        <h3
          id={labelId}
          className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-white/90 transition-colors"
        >
          {title}
        </h3>

        {/* Level 3 — Metadata row */}
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50"
          aria-label="Threat metadata"
        >
          {threat.targetIndustry && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" aria-hidden="true" />
              {threat.targetIndustry}
            </span>
          )}
          {threat.targetCountry && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" aria-hidden="true" />
              {threat.targetCountry}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {threat.time}
          </span>
          {threat.attackerActor && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              {threat.attackerActor}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" aria-hidden="true" />

        {/* Level 4 — AI Summary */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles
              className="animate-ai-icon-enter h-3.5 w-3.5 shrink-0"
              style={{ color: "#00FFC8" }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00FFC8]">
              AI Summary
            </span>
          </div>
          <p className="line-clamp-3 text-[11px] leading-relaxed text-white/65">
            {summary}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" aria-hidden="true" />

        {/* Level 5 — Footer: confidence + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/35">
              Confidence
            </span>
            <span
              className="text-sm font-bold font-mono"
              style={{ color: sev.color }}
              aria-label={`AI confidence: ${confidence}`}
            >
              {confidence}
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onClick?.(threat); }}
            className="group/cta flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-semibold
              transition-all duration-200 hover:gap-2 focus-visible:outline-none
              focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            style={{
              color: sev.color,
              borderColor: sev.border,
              background: sev.bg,
              "--tw-ring-color": sev.color,
            } as React.CSSProperties}
            aria-label={`View intelligence for ${title}`}
          >
            View Intelligence
            <ArrowRight
              className="h-3 w-3 transition-transform duration-200 group-hover/cta:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
};
