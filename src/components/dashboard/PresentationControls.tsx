// src/components/dashboard/PresentationControls.tsx

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, FastForward, Film, Power, ShieldAlert, Zap } from "lucide-react";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { countryCoordinates } from "../ThreatMap/countryCoordinates";
import { Threat } from "../ThreatMap/useThreatFeed";

const SCENARIOS = [
  { id: "Ransomware", name: "Ransomware Attack (LockBit)", actor: "BlackShadow", category: "Ransomware" },
  { id: "Phishing", name: "Phishing Surge (NileWolf)", actor: "NileWolf", category: "Phishing" },
  { id: "Botnet", name: "Botnet DDoS Flood (GhostFleet)", actor: "GhostFleet", category: "DDoS" },
  { id: "ZeroDay", name: "Zero-Day Exploit (PandaKit)", actor: "PandaKit", category: "Exploit" },
];

export function PresentationControls() {
  const presentation = useDashboardStore((state) => state.presentation);
  const setEnabled = useDashboardStore((state: any) => state.setPresentationEnabled);
  const setScenario = useDashboardStore((state: any) => state.setPresentationScenario);
  const setSpeed = useDashboardStore((state: any) => state.setPresentationSpeed);
  const setAutoplay = useDashboardStore((state: any) => state.setPresentationAutoplay);
  
  // store threats update action
  const setThreatsInStore = useDashboardStore((state: any) => state.setThreats);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to generate threats specific to a scenario
  const makeScenarioThreat = (scenarioType: string): Threat => {
    const countries = Object.keys(countryCoordinates);
    let src = countries[Math.floor(Math.random() * countries.length)];
    let dest = countries[Math.floor(Math.random() * countries.length)];
    while (src === dest) {
      dest = countries[Math.floor(Math.random() * countries.length)];
    }
    
    const now = new Date();
    const timeString = now.toTimeString().split(" ")[0];
    const id = `sim-${Math.random().toString(36).substr(2, 9)}`;

    switch (scenarioType) {
      case "Ransomware":
        return {
          id,
          sourceCountry: "Russia",
          sourceCity: countryCoordinates["Russia"].label,
          sourceCoords: countryCoordinates["Russia"],
          targetCountry: dest,
          targetCity: countryCoordinates[dest].label,
          targetCoords: countryCoordinates[dest],
          category: "Ransomware",
          severity: Math.random() > 0.3 ? "crit" : "high",
          time: timeString,
          status: "Active",
          targetIndustry: "Healthcare",
          sector: "Healthcare",
          attackerActor: "BlackShadow",
          attackVector: "Spear-Phishing Payload Dropper",
          affectedAssets: ["Active Directory Server", "Patient Database Share"],
          summary: "Simulated LockBit 3.0 ransomware deployment. Shadow copies deleted. Network exfiltration active.",
          confidence: 99,
        };
      case "Phishing":
        return {
          id,
          sourceCountry: "Nigeria",
          sourceCity: countryCoordinates["Nigeria"].label,
          sourceCoords: countryCoordinates["Nigeria"],
          targetCountry: dest,
          targetCity: countryCoordinates[dest].label,
          targetCoords: countryCoordinates[dest],
          category: "Phishing",
          severity: "high",
          time: timeString,
          status: "Active",
          targetIndustry: "Financial Services",
          sector: "Financial Services",
          attackerActor: "NileWolf",
          attackVector: "Fake Okta OAuth Endpoint",
          affectedAssets: ["Office Exchange Directory", "Identity Provider Session"],
          summary: "Simulated credential harvesting credential surge targeting banking employee logons.",
          confidence: 88,
        };
      case "Botnet":
        return {
          id,
          sourceCountry: src,
          sourceCity: countryCoordinates[src].label,
          sourceCoords: countryCoordinates[src],
          targetCountry: "USA",
          targetCity: countryCoordinates["USA"].label,
          targetCoords: countryCoordinates["USA"],
          category: "DDoS",
          severity: "med",
          time: timeString,
          status: "Active",
          targetIndustry: "E-Commerce",
          sector: "E-Commerce",
          attackerActor: "GhostFleet",
          attackVector: "Volumetric NTP Amplification",
          affectedAssets: ["API Load Balancers", "Edge DNS Nameservers"],
          summary: "Simulated volumetric DDoS campaign peaking at 480 Gbps against shopping interfaces.",
          confidence: 91,
        };
      case "ZeroDay":
      default:
        return {
          id,
          sourceCountry: "China",
          sourceCity: countryCoordinates["China"].label,
          sourceCoords: countryCoordinates["China"],
          targetCountry: "USA",
          targetCity: countryCoordinates["USA"].label,
          targetCoords: countryCoordinates["USA"],
          category: "Exploit",
          severity: "crit",
          time: timeString,
          status: "Active",
          targetIndustry: "Energy Grid",
          sector: "Energy Grid",
          attackerActor: "PandaKit",
          attackVector: "CVE-2026-9182 VPN Gateway RCE",
          affectedAssets: ["OT Engineering PLC", "SCADA Control Panel"],
          summary: "Simulated remote code execution exploit targeting core critical utility interfaces.",
          confidence: 97,
        };
    }
  };

  // Run autoplay threat generator loop
  useEffect(() => {
    if (!presentation.enabled || !isPlaying || !presentation.scenario) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const intervalTime = Math.max(500, 4000 / presentation.speed);

    intervalRef.current = setInterval(() => {
      const newThreat = makeScenarioThreat(presentation.scenario!);
      
      const current = useDashboardStore.getState().threat.threats;
      
      // Age older active threats to mitigated
      const aged = current.map((t, idx) =>
        t.status === "Active" && current.length - idx > 5
          ? { ...t, status: "Mitigated" as const }
          : t
      );
      
      const trimmed = aged.slice(-14);
      setThreatsInStore([...trimmed, newThreat]);
      
      // Automatically trigger AI Situation Report updates in the background during play
      const triggerAI = (useDashboardStore.getState() as any).triggerAIAnalysis;
      if (triggerAI && Math.random() > 0.6) {
        triggerAI();
      }
    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [presentation.enabled, isPlaying, presentation.scenario, presentation.speed]);

  const handleToggleEnable = () => {
    const nextEnabled = !presentation.enabled;
    setEnabled(nextEnabled);
    if (!nextEnabled) {
      setIsPlaying(false);
      setAutoplay(false);
      setScenario(null);
    } else {
      // default scenario to first
      setScenario("Ransomware");
    }
  };

  const handleTogglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    setAutoplay(nextPlaying);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/75 p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(108,99,255,0.2)] font-mono text-xs w-full">
      
      {/* Active Switch */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleToggleEnable}
          className={`h-9 w-9 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-300 ease-out active:scale-90 ${
            presentation.enabled
              ? "bg-[#6C63FF]/15 border-[#6C63FF] text-[#6C63FF] shadow-[0_0_10px_rgba(108,99,255,0.3)] animate-pulse"
              : "bg-white/5 border-white/10 text-white/40 hover:text-white"
          }`}
          title="Toggle Presentation Mode"
        >
          <Power className="h-4 w-4" />
        </button>
        <div>
          <div className="font-bold text-white flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-[#6C63FF]" />
            <span>PRESENTATION MODE</span>
          </div>
          <div className="text-[9px] text-white/30 uppercase mt-0.5">
            {presentation.enabled ? "Simulation Sandbox Armed" : "Console In Passive Monitored State"}
          </div>
        </div>
      </div>

      {presentation.enabled && (
        <>
          {/* Controls Segment */}
          <div className="flex flex-wrap items-center gap-4 justify-center">
            
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-[9px] uppercase">Scenario:</span>
              <select
                value={presentation.scenario || ""}
                onChange={(e) => setScenario(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:border-[#6C63FF] outline-none cursor-pointer"
              >
                {SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`h-8 px-4 rounded-lg border flex items-center gap-2 font-bold cursor-pointer transition-all duration-300 ease-out active:scale-95 ${
                isPlaying
                  ? "bg-[#FF4D6D]/15 border-[#FF4D6D]/40 text-[#FF4D6D]"
                  : "bg-[#00FFC8]/10 border-[#00FFC8]/30 text-[#00FFC8]"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>PAUSE SIM</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>RUN SCENARIO</span>
                </>
              )}
            </button>
          </div>

          {/* Speed slider segment */}
          <div className="flex items-center gap-3 w-full md:w-48 shrink-0">
            <span className="text-white/40 text-[9px] uppercase">Speed:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={presentation.speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="flex-1 accent-[#6C63FF] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[#6C63FF] font-bold text-right w-10 flex items-center gap-0.5 justify-end">
              <FastForward className="h-3.5 w-3.5" /> {presentation.speed}x
            </span>
          </div>
        </>
      )}

      {!presentation.enabled && (
        <div className="hidden md:flex items-center gap-2 text-white/20 select-none text-[10px] uppercase font-mono">
          <Zap className="h-3.5 w-3.5" /> Launch scenario sandbox for board briefings
        </div>
      )}
    </div>
  );
}
