// src/components/ThreatMap/useThreatFeed.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { countryCoordinates } from "./countryCoordinates";
import { useDashboardStore } from "@/core/store/dashboardStore";

export interface Threat {
  id: string;
  sourceCountry: string;
  sourceCity: string;
  sourceCoords: { x: number; y: number };
  targetCountry: string;
  targetCity: string;
  targetCoords: { x: number; y: number };
  category: "Ransomware" | "DDoS" | "Phishing" | "Malware" | "Exploit";
  severity: "low" | "med" | "high" | "crit";
  time: string;
  status: "Active" | "Mitigated";
  targetIndustry?: string;
  attackerActor?: string;
  summary?: string;
  confidence?: number;
  sector?: string;
  attackVector?: string;
  affectedAssets?: string[];
}

const threatCategories = ["Ransomware", "DDoS", "Phishing", "Malware", "Exploit"] as const;
const severities = ["low", "med", "high", "crit"] as const;
const industries = ["Financial Services", "Healthcare", "Government", "Energy Grid", "E-Commerce", "Defense"];
const actors = ["BlackShadow", "APT-441", "PandaKit", "NileWolf", "IronGate", "SilkRoute", "GhostFleet"];

const attackVectorsMap: Record<string, string[]> = {
  Ransomware: ["Spear-Phishing Link", "Exposed RDP Portal", "Compromised VPN Endpoint"],
  DDoS: ["Volumetric NTP Amplification", "HTTP GET Flood", "SYN TCP Flood"],
  Phishing: ["Fake Microsoft 365 Portal", "Spoofed HR Payroll Notification", "CEO Fraud Spear-Phish"],
  Malware: ["Malicious PDF Attachment", "Drive-by Exploit", "Trojanized Installer"],
  Exploit: ["SQL Injection RCE", "SCADA Modbus Hijack", "Log4Shell RCE (CVE-2021-44228)"]
};

const affectedAssetsMap: Record<string, string[]> = {
  Ransomware: ["Corporate Backup Server", "Active Directory Domain Controller", "HR File Share"],
  DDoS: ["API Load Balancers", "Edge DNS Nameservers", "Primary Web Gateways"],
  Phishing: ["Employee Email Inbox", "Okta Identity Provider Session", "Office Exchange Directory"],
  Malware: ["Executive Workstation", "Engineering Build Machine", "Financial Database Server"],
  Exploit: ["OT Engineering PLC", "Vulnerable DMZ IIS Server", "Linux Core PostgreSQL Database"]
};

const buildSeedThreats = (): Threat[] => [
  {
    id: "t-init-1",
    sourceCountry: "Russia",
    sourceCity: "Moscow",
    sourceCoords: countryCoordinates["Russia"],
    targetCountry: "Germany",
    targetCity: "Berlin",
    targetCoords: countryCoordinates["Germany"],
    category: "Exploit",
    severity: "crit",
    time: "21:55:00",
    status: "Active",
    targetIndustry: "Energy Grid",
    sector: "Energy Grid",
    attackVector: "Log4Shell RCE (CVE-2021-44228)",
    affectedAssets: ["OT Engineering PLC", "SCADA Control Panel"],
    attackerActor: "BlackShadow",
    summary: "BlackShadow has deployed a weaponized exploit targeting exposed SCADA systems in European energy grids. Lateral movement observed across 6 OT network segments. Immediate isolation of ICS endpoints recommended.",
    confidence: 97,
  },
  {
    id: "t-init-2",
    sourceCountry: "China",
    sourceCity: "Beijing",
    sourceCoords: countryCoordinates["China"],
    targetCountry: "USA",
    targetCity: "Washington D.C.",
    targetCoords: countryCoordinates["USA"],
    category: "Ransomware",
    severity: "high",
    time: "21:56:10",
    status: "Active",
    targetIndustry: "Financial Services",
    sector: "Financial Services",
    attackVector: "Compromised VPN Endpoint",
    affectedAssets: ["Active Directory Domain Controller", "Corporate Backup Server"],
    attackerActor: "PandaKit",
    summary: "PandaKit ransomware campaign targeting US financial institutions via spear-phishing. Double-extortion model detected — exfiltration preceded encryption. 3 major banking entities confirmed affected.",
    confidence: 91,
  },
  {
    id: "t-init-3",
    sourceCountry: "USA",
    sourceCity: "Washington D.C.",
    sourceCoords: countryCoordinates["USA"],
    targetCountry: "Japan",
    targetCity: "Tokyo",
    targetCoords: countryCoordinates["Japan"],
    category: "DDoS",
    severity: "med",
    time: "21:57:05",
    status: "Active",
    targetIndustry: "E-Commerce",
    sector: "E-Commerce",
    attackVector: "HTTP GET Flood",
    affectedAssets: ["API Load Balancers", "Edge DNS Nameservers"],
    attackerActor: "GhostFleet",
    summary: "Volumetric DDoS campaign peaking at 480 Gbps targeting Japanese e-commerce checkout APIs. Botnet comprised of ~14,000 compromised IoT nodes. Rate-limiting and scrubbing active.",
    confidence: 84,
  },
];

function makeNewThreat(): Threat {
  const countries = Object.keys(countryCoordinates);
  let src = countries[Math.floor(Math.random() * countries.length)];
  let dest = countries[Math.floor(Math.random() * countries.length)];
  while (src === dest) {
    dest = countries[Math.floor(Math.random() * countries.length)];
  }
  const category = threatCategories[Math.floor(Math.random() * threatCategories.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const actor = actors[Math.floor(Math.random() * actors.length)];
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];

  const avs = attackVectorsMap[category] || ["Malicious Web Request"];
  const attackVector = avs[Math.floor(Math.random() * avs.length)];
  const assets = affectedAssetsMap[category] || ["Local Host Endpoints"];
  const numAssets = Math.random() > 0.5 ? 2 : 1;
  const affectedAssets = [...assets].sort(() => 0.5 - Math.random()).slice(0, numAssets);

  return {
    id: `t-${Math.random().toString(36).substr(2, 9)}`,
    sourceCountry: src,
    sourceCity: countryCoordinates[src].label,
    sourceCoords: countryCoordinates[src],
    targetCountry: dest,
    targetCity: countryCoordinates[dest].label,
    targetCoords: countryCoordinates[dest],
    category,
    severity,
    time: timeString,
    status: "Active",
    targetIndustry: industry,
    sector: industry,
    attackerActor: actor,
    attackVector,
    affectedAssets,
    confidence: Math.floor(Math.random() * 25) + 75,
  };
}

export function useThreatFeed() {
  const threats = useDashboardStore((state) => state.threat.threats) as Threat[];
  const setThreatsInStore = useDashboardStore((state: any) => state.setThreats);
  
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expose setThreats function compatible with react-style updaters
  const setThreats = useCallback((val: Threat[] | ((prev: Threat[]) => Threat[])) => {
    const store = useDashboardStore.getState();
    const current = store.threat.threats as Threat[];
    const next = typeof val === "function" ? val(current) : val;
    setThreatsInStore(next);
  }, [setThreatsInStore]);

  // Use a ref to track pause state without re-triggering the main effect
  const pausedRef = useRef(false);

  const selectThreat = useCallback((threat: Threat) => {
    setSelectedThreat(threat);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedThreat(null);
  }, []);

  const clearSimulatedError = useCallback(() => {
    pausedRef.current = false;
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setThreats(buildSeedThreats());
      setIsLoading(false);
    }, 1600);
  }, [setThreats]);

  const triggerSimulatedError = useCallback(() => {
    pausedRef.current = true;
    setError("ERR_CONN_TIMEOUT: Connection to threat-feed server lost.");
    setThreats([]);
    setSelectedThreat(null);
  }, [setThreats]);

  // Main effect — runs once on mount, drives the simulator lifecycle
  useEffect(() => {
    // Step 1: Simulate initial load
    const loadTimer = setTimeout(() => {
      setThreats(buildSeedThreats());
      setIsLoading(false);
    }, 1800);

    // Step 2: Begin periodic updates after load completes
    const startInterval = setTimeout(() => {
      const interval = setInterval(() => {
        if (pausedRef.current) return;
        const newThreat = makeNewThreat();
        
        // Use Zustand state directly to get fresh value
        const currentThreats = useDashboardStore.getState().threat.threats as Threat[];
        
        // Age older threats into Mitigated
        const aged = currentThreats.map((t, idx) =>
          t.status === "Active" && currentThreats.length - idx > 5
            ? { ...t, status: "Mitigated" as const }
            : t
        );
        // Keep total list size bounded at 15
        const trimmed = aged.slice(-14);
        setThreats([...trimmed, newThreat]);
      }, 4000);

      return () => clearInterval(interval);
    }, 2000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(startInterval);
    };
  }, [setThreats]);

  return {
    threats,
    selectedThreat,
    isLoading,
    error,
    setThreats,
    selectThreat,
    clearSelection,
    triggerSimulatedError,
    clearSimulatedError,
  };
}
