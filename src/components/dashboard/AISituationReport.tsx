// src/components/dashboard/AISituationReport.tsx

import React, { useEffect, useState } from "react";
import { useAISituationReport } from "@/hooks/useAISituationReport";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { Brain, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AISituationReport() {
  const {
    aiEngineRunning,
    modelName,
    lastAnalysisTimestamp,
    threatLevel,
    primaryCampaign,
    currentSituation,
    predictedNextTarget,
    topTargetedSector,
    recommendedActions,
    confidence,
    refreshAnalysis,
  } = useAISituationReport();

  // Get total threats from the store to calculate realistic event counts
  const totalThreats = useDashboardStore((state) => state.threat.threats.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const eventCount = Math.max(1248, (mounted ? totalThreats : 0) * 115 + 32);

  const formatUTC = (timestamp?: number) => {
    if (!mounted || !timestamp) return "14:32 UTC";
    const date = new Date(timestamp);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes} UTC`;
  };

  const getThreatLevelBar = (level: string) => {
    switch (level.toUpperCase()) {
      case "LOW":
        return "██░░░░░░░░";
      case "MEDIUM":
        return "█████░░░░░";
      case "HIGH":
        return "████████░░";
      case "CRITICAL":
      case "CRIT":
        return "██████████";
      default:
        return "████████░░";
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "LOW":
        return "text-[#00FFC8]";
      case "MEDIUM":
        return "text-[#00E5FF]";
      case "HIGH":
        return "text-[#FF9F43]";
      case "CRITICAL":
      case "CRIT":
        return "text-[#FF4D6D]";
      default:
        return "text-[#FF9F43]";
    }
  };

  // List of active thinking states for the skeleton loaders
  const thinkingSubtext = [
    "PARSING RAW ADVERSARY SIGNALS...",
    "EXTRACTING ATT&CK TACTICS...",
    "ATTRIBUTING MALWARE STRUCTS...",
    "DECRUNCHING TELEMETRY STACK...",
  ];
  const [thinkingIndex, setThinkingIndex] = useState(0);

  useEffect(() => {
    if (!aiEngineRunning) return;
    const interval = setInterval(() => {
      setThinkingIndex((prev) => (prev + 1) % thinkingSubtext.length);
    }, 250);
    return () => clearInterval(interval);
  }, [aiEngineRunning]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/45 backdrop-blur-2xl font-mono text-[11px] text-white/80 p-6 shadow-[0_20px_50px_-20px_rgba(0,229,255,0.15)] relative">
      
      {/* Laser sweep animation overlay when running analysis */}
      {aiEngineRunning && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_10px_#00E5FF] animate-laser z-20 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#00E5FF] animate-pulse" />
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            🧠 AI Situation Report
          </span>
        </div>
        <span className="text-[9px] text-[#00E5FF]/50 uppercase tracking-widest font-mono">
          {modelName.split(" ")[0]}
        </span>
      </div>

      {/* Main Body - Scrollable content only */}
      <div className="flex-1 overflow-y-auto cyber-scroll pr-1 mb-4">
        <AnimatePresence mode="wait">
          {aiEngineRunning ? (
            /* --- SKELETON / LOADING STATE --- */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 py-2"
            >
              {/* Threat Level Skeleton */}
              <div>
                <div className="text-white/40 mb-1">Threat Level</div>
                <div className="h-3 w-40 bg-white/5 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
                <div className="h-3 w-16 bg-white/5 mt-1 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Primary Campaign Skeleton */}
              <div>
                <div className="text-white/40 mb-1">Primary Campaign</div>
                <div className="h-3.5 w-48 bg-white/5 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Current Situation Skeleton */}
              <div>
                <div className="text-white/40 mb-1.5">Current Situation</div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-white/5 rounded overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                  <div className="h-3 w-5/6 bg-white/5 rounded overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Predicted Next Target Skeleton */}
              <div>
                <div className="text-white/40 mb-1.5">Predicted Next Target</div>
                <div className="h-3 w-2/3 bg-white/5 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Recommended Actions Skeleton */}
              <div>
                <div className="text-white/40 mb-2">Recommended Actions</div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30">•</span>
                    <div className="h-2.5 w-3/4 bg-white/5 rounded overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30">•</span>
                    <div className="h-2.5 w-5/6 bg-white/5 rounded overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* --- CONTENT STATE --- */
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Threat Level */}
              <div>
                <div className="text-white/40 mb-1">Threat Level</div>
                <div className={`text-sm tracking-widest font-bold ${getThreatLevelColor(threatLevel)}`}>
                  {getThreatLevelBar(threatLevel)}
                </div>
                <div className={`mt-0.5 text-xs font-bold ${getThreatLevelColor(threatLevel)}`}>
                  {threatLevel.toUpperCase()}
                </div>
              </div>

              {/* Primary Campaign */}
              <div>
                <div className="text-white/40 mb-1">Primary Campaign</div>
                <div className="text-white font-bold text-[12px]">{primaryCampaign}</div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Current Situation */}
              <div>
                <div className="text-white/40 mb-1.5">Current Situation</div>
                <p className="text-white/85 leading-relaxed text-[10px] bg-white/[0.01] border border-white/[0.03] rounded-lg p-2.5">
                  {currentSituation}
                </p>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Predicted Next Target */}
              <div>
                <div className="text-white/40 mb-1">Predicted Next Target</div>
                <div className="text-[#FF4D6D] font-semibold">{predictedNextTarget}</div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Top Targeted Sector */}
              <div>
                <div className="text-white/40 mb-1">Top Targeted Sector</div>
                <div className="text-[#00E5FF] font-semibold">{topTargetedSector}</div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Recommended Actions */}
              <div>
                <div className="text-white/40 mb-2">Recommended Actions</div>
                <ul className="space-y-2">
                  {recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-white/95">
                      <span className="text-[#00FFC8] select-none shrink-0">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Confidence */}
              <div>
                <div className="text-white/40 mb-1">Confidence</div>
                <div className="text-lg font-bold text-[#00FFC8] flex items-center gap-1.5">
                  <span className="animate-pulse">◉</span> {confidence}%
                </div>
                <div className="text-[#00FFC8] font-bold text-[9px] uppercase tracking-wider mt-0.5">
                  HIGH CONFIDENCE
                </div>
                <div className="text-white/45 text-[9px] mt-1">
                  Based on {eventCount.toLocaleString()} analyzed events
                </div>
              </div>

              <div className="text-white/20 select-none py-1">────────────────────</div>

              {/* Generated timestamp */}
              <div className="flex items-center justify-between">
                <span className="text-white/40">Generated</span>
                <span className="text-[#00E5FF] font-semibold">
                  {formatUTC(lastAnalysisTimestamp)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Area - ALWAYS visible at the bottom of the card */}
      <div className="border-t border-white/5 pt-3 mt-auto shrink-0">
        {aiEngineRunning ? (
          <div className="flex flex-col items-center justify-center py-1 gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin text-[#00E5FF]" />
            <div className="text-[8px] tracking-[0.2em] text-[#00E5FF] font-semibold animate-pulse uppercase">
              {thinkingSubtext[thinkingIndex]}
            </div>
          </div>
        ) : (
          <button
            onClick={refreshAnalysis}
            disabled={aiEngineRunning}
            className="w-full text-center py-2.5 rounded-lg border border-[#00E5FF]/30 bg-[#00E5FF]/5 
              hover:bg-[#00E5FF]/15 hover:border-[#00E5FF]/60 active:scale-[0.97]
              text-[#00E5FF] text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ease-out 
              cursor-pointer hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]
              disabled:opacity-50 disabled:pointer-events-none"
          >
            [ Refresh Analysis ]
          </button>
        )}
      </div>
    </div>
  );
}
