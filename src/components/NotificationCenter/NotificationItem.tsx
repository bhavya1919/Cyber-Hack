// src/components/NotificationCenter/NotificationItem.tsx
// A single notification row

import React from "react";
import { motion } from "framer-motion";
import { X, Zap, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { Notification, NotifSeverity } from "@/core/store/notificationStore";
import { useNotificationStore } from "@/core/store/notificationStore";
import { formatDistanceToNowStrict } from "date-fns";

// ─── Severity config ───────────────────────────────────────────

interface SeverityStyle {
  badge: string;
  icon: React.ElementType;
  border: string;
  glow: string;
  label: string;
}

const SEVERITY_STYLES: Record<NotifSeverity, SeverityStyle> = {
  critical: {
    badge: "bg-[#FF3B5C]/15 text-[#FF3B5C] border border-[#FF3B5C]/30",
    icon: Zap,
    border: "border-l-[#FF3B5C]",
    glow: "shadow-[inset_0_0_20px_rgba(255,59,92,0.04)]",
    label: "CRITICAL",
  },
  high: {
    badge: "bg-[#FF8C42]/15 text-[#FF8C42] border border-[#FF8C42]/30",
    icon: AlertTriangle,
    border: "border-l-[#FF8C42]",
    glow: "shadow-[inset_0_0_20px_rgba(255,140,66,0.04)]",
    label: "HIGH",
  },
  medium: {
    badge: "bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30",
    icon: AlertTriangle,
    border: "border-l-[#FFD166]",
    glow: "",
    label: "MEDIUM",
  },
  low: {
    badge: "bg-[#00FFC8]/15 text-[#00FFC8] border border-[#00FFC8]/30",
    icon: CheckCircle2,
    border: "border-l-[#00FFC8]",
    glow: "",
    label: "LOW",
  },
  info: {
    badge: "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30",
    icon: Info,
    border: "border-l-[#6C63FF]",
    glow: "",
    label: "INFO",
  },
};

interface Props {
  notification: Notification;
}

export function NotificationItem({ notification: n }: Props) {
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const dismiss = useNotificationStore((s) => s.dismissNotification);
  const style = SEVERITY_STYLES[n.severity];
  const Icon = style.icon;

  const timeAgo = formatDistanceToNowStrict(n.timestamp, { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95, height: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => !n.isRead && markAsRead(n.id)}
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl border-l-2 border border-white/5
        ${style.border} ${style.glow}
        ${n.isRead ? "bg-white/[0.01]" : "bg-white/[0.04]"}
        cursor-pointer group hover:bg-white/[0.06] transition-colors duration-200`}
    >
      {/* Severity icon */}
      <div className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center mt-0.5 ${style.badge}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-white/90 leading-tight">{n.title}</span>
            {!n.isRead && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] shrink-0 mt-0.5" />
            )}
          </div>
        </div>
        <p className="text-[10px] text-white/45 leading-relaxed line-clamp-2 mb-2">{n.message}</p>
        <div className="flex items-center gap-2">
          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${style.badge}`}>
            {style.label}
          </span>
          <span className="text-[9px] text-white/25 font-mono">{n.source}</span>
          <span className="ml-auto text-[9px] text-white/25 font-mono">{timeAgo}</span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        id={`dismiss-notif-${n.id}`}
        onClick={(e) => {
          e.stopPropagation();
          dismiss(n.id);
        }}
        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
