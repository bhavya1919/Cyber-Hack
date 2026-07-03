// src/routes/dashboard.tsx

import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Shield, Brain, Activity, ShieldAlert, FileText, User, ArrowLeft, Radio, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import tabs
import ThreatMap from "@/components/ThreatMap/ThreatMap";
import { ThreatFeedSection } from "@/components/ThreatFeed/ThreatFeedSection";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { CopilotTab } from "@/components/dashboard/CopilotTab";
import { RiskScoreTab } from "@/components/dashboard/RiskScoreTab";
import { ReportsTab } from "@/components/dashboard/ReportsTab";
import { PresentationControls } from "@/components/dashboard/PresentationControls";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { OverviewCards } from "@/components/dashboard/OverviewCards/OverviewCards";

function DashboardConsole() {
  const [activeTab, setActiveTab] = useState<"cc" | "analytics" | "copilot" | "risk" | "reports">("cc");
  const threats = useDashboardStore((state) => state.threat.threats);
  const activeThreats = threats.filter((t) => t.status === "Active");

  // Client side mount check
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center font-mono text-xs text-white/50 gap-3">
        <LoaderComponent />
      </div>
    );
  }

  const tabs = [
    { id: "cc", label: "Command Center", icon: Radio },
    { id: "analytics", label: "Analytics Suite", icon: Activity },
    { id: "copilot", label: "AI Copilot", icon: Brain },
    { id: "risk", label: "Organization Risk", icon: Network },
    { id: "reports", label: "Threat Intelligence", icon: FileText },
  ] as const;

  return (
    <div className="relative min-h-screen bg-[#05070A] text-[#F5F7FA] font-mono select-none overflow-x-hidden">
      
      {/* Dynamic Background Matrix Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none z-0" />

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] shadow-[0_0_20px_rgba(0,229,255,0.5)] group-hover:scale-[1.02] transition-transform">
              <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#00E5FF] transition-colors">AI Shadow Console</span>
              <span className="text-[9px] font-mono text-[#00E5FF]/80 tracking-widest mt-0.5">OPERATIONAL NET // SECURE</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {/* Live status feed */}
            <div className="hidden sm:flex items-center gap-4 text-[10px] text-white/40">
              <span className="flex items-center gap-1.5 text-[#00FFC8] font-bold">
                <span className="h-2 w-2 rounded-full bg-[#00FFC8] animate-pulse" />
                {activeThreats.length} ACTIVE ANOMALIES
              </span>
              <span className="h-4 w-px bg-white/10" />
              <span>STATION: OP-CENTRAL // ANALYST_4812</span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white transition-all duration-300 ease-out cursor-pointer border border-white/5 bg-white/[0.02] px-2.5 py-1.5 rounded-lg
                focus-visible:ring-2 focus-visible:ring-[#00E5FF]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#05070A] outline-none active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Disconnect Console</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Top Level Overview Cards */}
      <OverviewCards />

      {/* Main Console Workspace */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-60 shrink-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 space-y-1">
            <span className="text-[9px] text-white/30 uppercase tracking-wider px-3 pb-2 block border-b border-white/5 mb-2">Workspace Navigation</span>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left text-xs transition-all duration-300 ease-out cursor-pointer active:scale-[0.97] ${
                    isActive
                      ? "bg-gradient-to-r from-[#00E5FF]/10 to-[#6C63FF]/5 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.08)]"
                      : "border border-transparent text-white/60 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#00E5FF]" : "text-white/45"}`} />
                  <span className="font-semibold tracking-wide uppercase text-[10px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 text-[10px] leading-relaxed text-white/35">
            <span className="font-bold text-white/50 block mb-1">AUDIT LOGGING LOG4</span>
            All console events are logged under cryptographic hashes on local enclaves. Unauthorized actions trigger interface quarantines.
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <section className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {activeTab === "cc" && (
                <div className="space-y-8">
                  {/* Visual operations segment */}
                  <div className="glass-card border border-white/10 p-2 overflow-hidden shadow-2xl relative">
                    <ThreatMap />
                  </div>
                  {/* Intel Stream Grid Section */}
                  <div>
                    <ThreatFeedSection />
                  </div>
                </div>
              )}

              {activeTab === "analytics" && <AnalyticsTab />}

              {activeTab === "copilot" && <CopilotTab />}

              {activeTab === "risk" && <RiskScoreTab />}

              {activeTab === "reports" && <ReportsTab />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Persistent Floating Presentation Mode Sandbox Bar */}
      <footer className="sticky bottom-4 z-50 max-w-5xl mx-auto px-6 shrink-0 mt-8">
        <PresentationControls />
      </footer>
    </div>
  );
}

function LoaderComponent() {
  return (
    <>
      <div className="relative h-10 w-10 flex items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-30" />
        <div className="h-6 w-6 rounded border-t-2 border-[#00E5FF] animate-spin" />
      </div>
      <div className="uppercase tracking-[0.2em] animate-pulse text-[9px] text-[#00E5FF] font-semibold mt-2">
        INITIALIZING SECURE LINK ARRAY...
      </div>
    </>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardConsole,
});
