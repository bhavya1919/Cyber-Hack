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
// Seed notifications — realistic enterprise intel
// ─────────────────────────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n-001",
    title: "APT Group Activity Detected",
    message:
      "Lazarus Group TTPs matched across 3 endpoint beacons. C2 communication pattern identified on port 8443.",
    severity: "critical",
    category: "threat",
    timestamp: Date.now() - 1000 * 60 * 2,
    isRead: false,
    source: "EDR Engine",
  },
  {
    id: "n-002",
    title: "Lateral Movement Attempt",
    message:
      "Unusual SMB traversal from 192.168.1.47 → 192.168.1.201. Credential spraying pattern detected.",
    severity: "high",
    category: "anomaly",
    timestamp: Date.now() - 1000 * 60 * 8,
    isRead: false,
    source: "Network Monitor",
  },
  {
    id: "n-003",
    title: "Zero-Day CVE Ingested",
    message:
      "CVE-2025-31711 added to threat intelligence feed. CVSS Score: 9.8. Affects OpenSSL ≤ 3.1.x.",
    severity: "critical",
    category: "intel",
    timestamp: Date.now() - 1000 * 60 * 15,
    isRead: false,
    source: "Threat Feed",
  },
  {
    id: "n-004",
    title: "Compliance Drift Detected",
    message:
      "SOC 2 Type II control CA-09 is non-compliant. Encryption-at-rest disabled on 2 storage volumes.",
    severity: "medium",
    category: "compliance",
    timestamp: Date.now() - 1000 * 60 * 30,
    isRead: true,
    source: "GRC Module",
  },
  {
    id: "n-005",
    title: "Phishing Campaign Wave",
    message:
      "12 inbound emails matched Emotet lure template. Campaign targeting finance department.",
    severity: "high",
    category: "threat",
    timestamp: Date.now() - 1000 * 60 * 45,
    isRead: false,
    source: "Email Gateway",
  },
  {
    id: "n-006",
    title: "AI Copilot Model Updated",
    message:
      "Rule-based intent engine upgraded. 14 new threat patterns registered across 3 intent classes.",
    severity: "info",
    category: "system",
    timestamp: Date.now() - 1000 * 60 * 60,
    isRead: true,
    source: "AI Engine",
  },
  {
    id: "n-007",
    title: "DNS Tunneling Pattern",
    message:
      "Abnormal DNS query volume from endpoint WS-0093. Potential data exfiltration via DNS covert channel.",
    severity: "high",
    category: "anomaly",
    timestamp: Date.now() - 1000 * 60 * 90,
    isRead: true,
    source: "DNS Analyzer",
  },
  {
    id: "n-008",
    title: "Ransomware Signature Match",
    message:
      "LockBit 3.0 file encryption pattern detected on shared drive \\\\FILESRV01\\HR. Quarantine initiated.",
    severity: "critical",
    category: "threat",
    timestamp: Date.now() - 1000 * 60 * 120,
    isRead: true,
    source: "AV Engine",
  },
];

// ─────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: SEED_NOTIFICATIONS,
  isPanelOpen: false,

  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),

  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

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
