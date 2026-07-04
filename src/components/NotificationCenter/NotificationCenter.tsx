import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore, startNotificationLiveStream, initNotificationStore } from "@/core/store/notificationStore";
import { NotificationBell } from "./NotificationBell";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationCenter() {
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen);
  const closePanel = useNotificationStore((s) => s.closePanel);

  useEffect(() => {
    initNotificationStore().catch(console.error);
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
