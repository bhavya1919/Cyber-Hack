// src/components/dashboard/OverviewCards/OverviewCard.tsx

import { ReactNode } from "react";
import { Counter } from "./Counter";
import { TrendBadge } from "./TrendBadge";

interface OverviewCardProps {
  title: string;
  value: number | null; // null for loading/empty state
  trend?: {
    direction: "up" | "down" | "stable";
    value: number; // percentage or numeric trend
    label: string; // e.g. "vs last hour"
  };
  icon?: ReactNode;
  accentColor?: string; // CSS color string for glow/border
  subtitle?: string;
  loading?: boolean;
  isHovered?: boolean;
  isDimmed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Reusable analytics card. Pure UI – no store knowledge.
 * Handles loading placeholders, hover glow and optional trend badge.
 */
export const OverviewCard = ({
  title,
  value,
  trend,
  icon,
  accentColor = "#00bcd4",
  subtitle,
  loading = false,
  isHovered = false,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
}: OverviewCardProps) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`overview-card relative rounded-xl p-4 bg-black/35 backdrop-blur-md border cursor-pointer
        transition-all duration-300 ease-out will-change-[transform,opacity,box-shadow] ${
        isHovered ? "border-current -translate-y-1.5" : "border-white/5"
      }`}
      style={{
        boxShadow: isHovered
          ? `0 0 24px 4px ${accentColor}35, 0 8px 20px rgba(0,0,0,0.4)`
          : `0 0 8px 0px ${accentColor}08`,
        opacity: isDimmed ? 0.55 : 1.0,
      }}
    >
      {/* Icon */}
      {icon && (
        <div 
          className="icon mb-2 text-2xl transition-transform duration-300"
          style={{
            color: isHovered ? accentColor : "rgba(255, 255, 255, 0.45)",
            filter: isHovered ? `drop-shadow(0 0 6px ${accentColor}80)` : "none",
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-[10px] font-mono text-white/50 uppercase tracking-wider">{title}</h3>

      {/* Counter */}
      <div 
        className="my-2 text-3xl font-extrabold tracking-tight font-mono transition-all duration-300"
        style={{
          color: isHovered ? accentColor : "white",
          textShadow: isHovered ? `0 0 10px ${accentColor}40` : "none",
        }}
      >
        <Counter value={loading ? null : value} />
      </div>

      {/* Subtitle / Trend */}
      <div className="flex items-center justify-between min-h-[16px]">
        {subtitle && <p className="text-[9px] uppercase text-white/35 font-mono">{subtitle}</p>}
        {value === null || loading ? (
          <span className="text-[8px] text-white/20 animate-pulse font-mono uppercase tracking-wider">Synchronizing...</span>
        ) : (
          trend && <TrendBadge trend={trend.direction} value={trend.value} label={trend.label} />
        )}
      </div>
    </div>
  );
};

