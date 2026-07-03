// src/components/NotificationCenter/NotificationPanel.tsx
// The slide-in dropdown panel containing the full feed

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Trash2,
  Filter,
  ShieldAlert,
  Activity,
  AlertCircle,
  Info,
  Server,
} from "lucide-react";
import { useNotificationStore } from "@/core/store/notificationStore";
import type { NotifCategory } from "@/core/store/notificationStore";
import { NotificationItem } from "./NotificationItem";

// ─── Category filter tabs ─────────────────────────────────────

type FilterOption = "all" | NotifCategory;

const FILTER_TABS: Array<{ id: FilterOption; label: string; icon: React.ElementType }> = [
  { id: "all", label: "All", icon: Activity },
  { id: "threat", label: "Threat", icon: ShieldAlert },
  { id: "anomaly", label: "Anomaly", icon: AlertCircle },
  { id: "intel", label: "Intel", icon: Info },
  { id: "compliance", label: "Compliance", icon: CheckCheck },
  { id: "system", label: "System", icon: Server },
];

// ─── Panel ───────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: Props) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  const [filter, setFilter] = useState<FilterOption>("all");
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside and ESC to close
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("#notification-bell-btn")
      ) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  const categoryCount = (cat: FilterOption) =>
    cat === "all"
      ? notifications.length
      : notifications.filter((n) => n.category === cat).length;

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] max-h-[580px] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_rgba(0,229,255,0.05)] z-50 flex flex-col overflow-hidden"
      style={{ maxHeight: "80vh" }}
    >
      {/* Terminal corner accents */}
      <div className="absolute top-2 left-2 h-2 w-2 border-t border-l border-white/15 pointer-events-none" />
      <div className="absolute top-2 right-2 h-2 w-2 border-t border-r border-white/15 pointer-events-none" />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 shrink-0">
        <div>
          <h2 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
            Alert Feed
          </h2>
          <p className="text-[9px] text-white/35 font-mono mt-0.5 tracking-wider">
            {unreadCount > 0 ? `${unreadCount} UNREAD` : "ALL CLEAR"} · LIVE INTEL STREAM
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-[#00E5FF] transition-colors px-2 py-1 rounded border border-transparent hover:border-white/10 cursor-pointer"
              title="Mark all read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark all</span>
            </button>
          )}
          <button
            id="clear-all-notif-btn"
            onClick={clearAll}
            aria-label="Clear all notifications"
            className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-[#FF3B5C] transition-colors px-2 py-1 rounded border border-transparent hover:border-white/10 cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Category Filter Bar ─────────────────────────── */}
      <div className="flex gap-1 px-4 py-3 border-b border-white/5 overflow-x-auto shrink-0 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const count = categoryCount(tab.id);
          const isActive = filter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`notif-filter-${tab.id}`}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0
                ${
                  isActive
                    ? "bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF]"
                    : "border border-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                }`}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`ml-0.5 text-[8px] px-1 rounded-full ${
                    isActive ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "bg-white/10 text-white/40"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Notification Feed ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-14 gap-3 text-white/25"
            >
              <CheckCheck className="h-8 w-8" />
              <p className="text-[10px] font-mono tracking-widest uppercase">No alerts in this category</p>
            </motion.div>
          ) : (
            filtered.map((n) => <NotificationItem key={n.id} notification={n} />)
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2 text-[9px] font-mono text-white/20">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FFC8] animate-pulse" />
          <span>LIVE STREAM ACTIVE · AUTO-REFRESH 45S</span>
        </div>
      </div>
    </motion.div>
  );
}
