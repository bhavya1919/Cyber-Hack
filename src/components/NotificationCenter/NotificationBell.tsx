// src/components/NotificationCenter/NotificationBell.tsx
// The animated bell icon with unread badge

import React from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/core/store/notificationStore";

export function NotificationBell() {
  const togglePanel = useNotificationStore((s) => s.togglePanel);
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen);
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  const hasCritical = useNotificationStore((s) =>
    s.notifications.some((n) => !n.isRead && n.severity === "critical")
  );

  return (
    <button
      id="notification-bell-btn"
      onClick={togglePanel}
      aria-label={`Open notifications (${unreadCount} unread)`}
      className={`relative flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-300 ease-out cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-[#00E5FF]/50 active:scale-95
        ${
          isPanelOpen
            ? "border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]"
            : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:border-white/20"
        }`}
    >
      {/* Shake bell when critical unread alerts exist */}
      <motion.div
        animate={hasCritical ? { rotate: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 4 }}
      >
        <Bell className="h-4 w-4" />
      </motion.div>

      {/* Unread badge */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className={`absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold px-1 font-mono
              ${hasCritical
                ? "bg-[#FF3B5C] text-white shadow-[0_0_8px_rgba(255,59,92,0.6)]"
                : "bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]"
              }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Critical pulse ring */}
      {hasCritical && (
        <span className="absolute inset-0 rounded-lg animate-ping border border-[#FF3B5C]/40 pointer-events-none" />
      )}
    </button>
  );
}
