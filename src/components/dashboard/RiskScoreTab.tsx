// src/components/dashboard/RiskScoreTab.tsx

import React, { useState, useMemo } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/core/store/dashboardStore";

interface Safeguard {
  id: string;
  name: string;
  category: string;
  cost: string;
  impact: number; // impact on risk score reduction
  status: "Active" | "Inactive";
  description: string;
}

const DEFAULT_SAFEGUARDS: Safeguard[] = [
  { id: "sg-1", name: "Multi-Factor Authentication (MFA)", category: "IAM", cost: "Low", impact: 15, status: "Active", description: "Enforces hardware keys or authenticator apps for all corporate and infrastructure console logins." },
  { id: "sg-2", name: "Network Micro-segmentation", category: "Network", cost: "High", impact: 12, status: "Inactive", description: "Isolates SCADA and OT environments from general IT networks with strict zero-trust ACLs." },
  { id: "sg-3", name: "Email Gateway Sandbox Filtering", category: "Email", cost: "Medium", impact: 10, status: "Active", description: "Inspects attachments and executes suspicious links in a secure cloud virtual environment before delivery." },
  { id: "sg-4", name: "Endpoint Detection & Response (EDR)", category: "Endpoint", cost: "High", impact: 14, status: "Inactive", description: "Deploys active behavior monitoring agents on all servers, virtual hosts, and workstations." },
  { id: "sg-5", name: "Automated Daily Cold Backups", category: "Data", cost: "Medium", impact: 11, status: "Active", description: "Maintains offline, air-gapped, and encrypted copies of core customer databases and configurations." },
  { id: "sg-6", name: "External Port Audit & IPS Routing", category: "Perimeter", cost: "Low", impact: 8, status: "Inactive", description: "Restricts ingress interfaces and routes public traffic through intrusion prevention scrubbing gateways." },
];

export function RiskScoreTab() {
  const threats = useDashboardStore((state) => state.threat.threats);
  const activeThreats = threats.filter((t) => t.status === "Active");
  
  // Calculate dynamic baseline threat severity penalty
  const threatPenalty = useMemo(() => {
    let penalty = 0;
    activeThreats.forEach((t) => {
      if (t.severity === "crit") penalty += 9;
      else if (t.severity === "high") penalty += 5;
      else if (t.severity === "medium") penalty += 2;
    });
    return Math.min(45, penalty); // max penalty of 45 points
  }, [activeThreats]);

  // Track active safeguards interactively
  const [safeguards, setSafeguards] = useState<Safeguard[]>(DEFAULT_SAFEGUARDS);

  const toggleSafeguard = (id: string) => {
    setSafeguards((prev) =>
      prev.map((sg) =>
        sg.id === id ? { ...sg, status: sg.status === "Active" ? "Inactive" : "Active" } : sg
      )
    );
  };

  // Derive dynamic security score
  // Starting base is 100.
  // Add values for active safeguards (max 70 points contribution)
  // Subtract threat penalty (max 45 points deduction)
  const scoreData = useMemo(() => {
    const activeMitigationsScore = safeguards
      .filter((sg) => sg.status === "Active")
      .reduce((acc, curr) => acc + curr.impact, 0);
      
    // Max theoretical mitigations contribution is sum of all impacts (70)
    // Map this to a baseline posture score of 30-100 before active threats
    const basePosture = 30 + activeMitigationsScore;
    const finalScore = Math.max(12, Math.min(99, basePosture - threatPenalty));

    let tier: "POOR" | "FAIR" | "SECURE" = "FAIR";
    let color = "text-[#FF9F43]";
    let strokeColor = "#FF9F43";
    let bgColor = "bg-[#FF9F43]/10";

    if (finalScore >= 80) {
      tier = "SECURE";
      color = "text-[#00FFC8]";
      strokeColor = "#00FFC8";
      bgColor = "bg-[#00FFC8]/10";
    } else if (finalScore < 50) {
      tier = "POOR";
      color = "text-[#FF4D6D]";
      strokeColor = "#FF4D6D";
      bgColor = "bg-[#FF4D6D]/10";
    }

    return {
      score: finalScore,
      tier,
      color,
      strokeColor,
      bgColor,
      basePosture,
      mitigationsCount: safeguards.filter((sg) => sg.status === "Active").length,
    };
  }, [safeguards, threatPenalty]);

  // Dynamic status rings
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (scoreData.score / 100) * circumference;

  return (
    <div className="space-y-6 font-mono text-xs text-white/80 p-1">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Meter Display */}
        <div className="glass-card p-6 border border-white/10 flex flex-col items-center justify-center text-center md:col-span-1 min-h-[300px]">
          <h4 className="text-white/40 uppercase tracking-widest text-[10px] mb-4">Organizational Health Meter</h4>
          
          <div className="relative h-40 w-40 flex items-center justify-center">
            {/* SVG Progress Arc */}
            <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke={scoreData.strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-4xl font-extrabold tracking-tighter ${scoreData.color}`}>
                {scoreData.score}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-white/45 mt-1">POSTURE INDEX</span>
            </div>
          </div>

          <div className={`mt-4 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest ${scoreData.bgColor} ${scoreData.color} border border-current/20`}>
            {scoreData.tier} POSTURE
          </div>
        </div>

        {/* Dynamic Threat Posture Context */}
        <div className="glass-card p-6 border border-white/10 flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <ShieldAlert className="h-4 w-4 text-[#FF4D6D]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Breach Susceptibility Analysis</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-white/40">Active Intrusion Penalties</span>
                <span className="text-[#FF4D6D] font-bold">-{threatPenalty} Posture Points</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-white/40">Active Threats Monitored</span>
                <span className="text-white font-bold">{activeThreats.length} Active Nodes</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-white/40">Mitigations Deployed</span>
                <span className="text-[#00FFC8] font-bold">{scoreData.mitigationsCount} / {safeguards.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">Static Posture Baseline</span>
                <span className="text-white/70">{scoreData.basePosture} Posture Points</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-[10px] leading-relaxed text-white/50 flex items-start gap-2.5 mt-4">
            <Info className="h-4 w-4 shrink-0 text-[#00E5FF] mt-0.5" />
            <p>
              Your risk index calculates threat proximity from live map clusters minus implemented security countermeasures. Toggle mitigations below to simulate network audits and upgrade organizational resilience.
            </p>
          </div>
        </div>
      </div>

      {/* Safeguards Interactive Control Panel */}
      <div className="glass-card p-6 border border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00FFC8]" />
            <span className="text-sm font-bold tracking-tight text-white uppercase">Resilience Safeguards Registry</span>
          </div>
          <span className="text-[10px] text-white/35 font-mono">MITRE D3FEND ALIGNED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeguards.map((sg) => {
            const isActive = sg.status === "Active";
            return (
              <div
                key={sg.id}
                onClick={() => toggleSafeguard(sg.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between
                  hover:-translate-y-1 active:scale-95 ${
                  isActive
                    ? "bg-[#00FFC8]/5 border-[#00FFC8]/30 shadow-[0_0_15px_rgba(0,255,200,0.05)] hover:shadow-[0_0_20px_0px_rgba(0,229,255,0.10)]"
                    : "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100 hover:border-white/15 hover:shadow-[0_0_20px_0px_rgba(0,229,255,0.10)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isActive ? "bg-[#00FFC8]/10 text-[#00FFC8]" : "bg-white/5 text-white/40"
                      }`}>
                        {sg.category}
                      </span>
                      <h4 className="text-white font-bold mt-2 text-[11px]">{sg.name}</h4>
                    </div>
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-[#00FFC8] shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-2">{sg.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-3 text-[9px] text-white/40">
                  <span>Audit Impact: <strong className="text-[#00FFC8] font-bold">+{sg.impact} Posture</strong></span>
                  <span>Cost: <strong className="text-white/60">{sg.cost}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
