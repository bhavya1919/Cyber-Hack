// src/core/store/notificationStore.ts
// Notification Center — Zustand store
// Manages live security alerts, read state, and filtering

import { create } from "zustand";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

export type NotifSeverity = "critical" | "high" | "medium" | "low" | "info";
export type NotifCategory =
  | "threat"
  | "anomaly"
  | "compliance"
  | "intel"
  | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotifSeverity;
  category: NotifCategory;
  timestamp: number;
  isRead: boolean;
  source: string;
}

interface NotificationState {
  notifications: Notification[];
  isPanelOpen: boolean;

  // Actions
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notif: Omit<Notification, "id" | "isRead">) => void;
  clearAll: () => void;

  // Selectors (computed)
  unreadCount: () => number;
}

// ─────────────────────────────────────────────────
// Seed notifications — moving to DB
// ─────────────────────────────────────────────────
import { notificationService } from "../../services/notificationService";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isPanelOpen: false,

  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  markAsRead: (id) => {
    notificationService.markAsRead(id).catch(console.error);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    notificationService.markAllAsRead().catch(console.error);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  dismissNotification: (id) => {
    notificationService.dismissNotification(id).catch(console.error);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      isRead: false,
    };
    set((s) => ({
      notifications: [newNotif, ...s.notifications],
    }));
  },

  clearAll: () => set({ notifications: [] }),

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));

// ─────────────────────────────────────────────────
// Live stream simulator
// Fires realistic alerts every 45–90 seconds
// ─────────────────────────────────────────────────

const LIVE_ALERTS: Array<Omit<Notification, "id" | "isRead" | "timestamp">> = [
  {
    title: "Brute Force Attempt Blocked",
    message: "185 failed SSH login attempts from IP 45.33.32.156. Geo: Russia. Auto-blocked via firewall rule.",
    severity: "high",
    category: "threat",
    source: "Firewall",
  },
  {
    title: "Threat Intel IOC Match",
    message: "Outbound connection to known C2 domain mal-update[.]biz. Process: chrome.exe (PID 4812).",
    severity: "critical",
    category: "intel",
    source: "Threat Feed",
  },
  {
    title: "Privileged Account Anomaly",
    message: "Admin account SVC_DB logged in from unrecognized geolocation (Frankfurt, DE) at 03:17 UTC.",
    severity: "high",
    category: "anomaly",
    source: "UEBA Engine",
  },
  {
    title: "Compliance Scan Complete",
    message: "PCI-DSS quarterly scan completed. Score: 87/100. 3 medium findings require remediation.",
    severity: "medium",
    category: "compliance",
    source: "GRC Module",
  },
  {
    title: "Cryptominer Detected",
    message: "XMRig process launched on server SRV-PROD-07. CPU at 97%. Process killed. Forensics initiated.",
    severity: "critical",
    category: "threat",
    source: "EDR Engine",
  },
];

let _liveStreamStarted = false;

export function startNotificationLiveStream() {
  if (_liveStreamStarted) return;
  _liveStreamStarted = true;

  const fire = () => {
    const pick = LIVE_ALERTS[Math.floor(Math.random() * LIVE_ALERTS.length)];
    useNotificationStore.getState().addNotification({
      ...pick,
      timestamp: Date.now(),
    });

    // Narrate critical live alerts via Mission Commander
    if (pick.severity === "critical") {
      // Lazy import to avoid circular deps
      import("../speech").then(({ speechManager }) => {
        speechManager.speak({
          eventType: "notification_critical",
          notifTitle: pick.title,
        });
      });
    }

    const nextIn = 45_000 + Math.random() * 45_000;
    setTimeout(fire, nextIn);
  };

  // First alert in 20–35 seconds after load
  setTimeout(fire, 20_000 + Math.random() * 15_000);
}

// Initialize store with DB and subscribe
export const initNotificationStore = async () => {
  // Fetch initial
  const initialNotifs = await notificationService.fetchNotifications();
  useNotificationStore.setState({ notifications: initialNotifs });

  // Subscribe
  notificationService.subscribeToNotifications(
    (notif) => {
      useNotificationStore.setState((state) => {
        if (state.notifications.some(n => n.id === notif.id)) return state;
        return { notifications: [notif, ...state.notifications] };
      });
    },
    (notifPartial) => {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notifPartial.id ? { ...n, ...notifPartial } : n
        )
      }));
    },
    (id) => {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }
  );
};

