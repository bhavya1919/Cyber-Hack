// src/components/dashboard/OverviewCards/SyncStatus.tsx

import { useEffect, useState } from "react";
import { useOverviewMetrics } from "../../../core/store/dashboardSelectors";

/**
 * Displays a tiny synchronized status indicator.
 * Shows "Just now" for <5s, otherwise a relative time.
 */
export const SyncStatus = () => {
  const { updatedAt } = useOverviewMetrics();
  const [label, setLabel] = useState("Synchronizing...");

  const format = (date: Date) => {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds
    if (diff < 5) return "Just now";
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  useEffect(() => {
    if (updatedAt) {
      setLabel(`🟢 Synced ${format(updatedAt)}`);
    } else {
      setLabel("Synchronizing...");
    }
    const interval = setInterval(() => {
      if (updatedAt) setLabel(`🟢 Synced ${format(updatedAt)}`);
    }, 5000);
    return () => clearInterval(interval);
  }, [updatedAt]);

  return <div className="text-[9px] font-mono text-white/35 uppercase tracking-wider mb-2">{label}</div>;
};
