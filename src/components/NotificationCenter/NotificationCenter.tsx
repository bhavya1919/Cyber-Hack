// src/components/NotificationCenter/NotificationCenter.tsx
// Root orchestrator — renders bell + panel together

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/core/store/notificationStore";
import { startNotificationLiveStream } from "@/core/store/notificationStore";
import { NotificationBell } from "./NotificationBell";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationCenter() {
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen);
  const closePanel = useNotificationStore((s) => s.closePanel);

  // Kick off live alert stream once on mount
  useEffect(() => {
    startNotificationLiveStream();
  }, []);

  return (
    <div className="relative" id="notification-center">
      <NotificationBell />
      <AnimatePresence>
        {isPanelOpen && <NotificationPanel onClose={closePanel} />}
      </AnimatePresence>
    </div>
  );
}
