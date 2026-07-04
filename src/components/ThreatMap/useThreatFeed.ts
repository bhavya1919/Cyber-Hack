// src/components/ThreatMap/useThreatFeed.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { countryCoordinates } from "./countryCoordinates";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { threatService } from "@/services/threatService";

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

const summaryMap: Record<string, string[]> = {
  Ransomware: [
    "Double-extortion ransomware campaign detected. Exfiltration preceded encryption. Backup deletion underway.",
    "Ransomware operator deployed via compromised VPN endpoint. Active directory encryption in progress.",
    "LockBit-style encryption pattern identified. Lateral movement observed across 4 network segments.",
  ],
  DDoS: [
    "Volumetric DDoS campaign peaking at 320 Gbps. Botnet of ~9,000 compromised IoT nodes active.",
    "HTTP GET flood targeting API gateway. Rate limiting engaged but thresholds exceeded.",
    "NTP amplification attack detected. DNS scrubbing active on edge nodes.",
  ],
  Phishing: [
    "Spear-phishing campaign impersonating Microsoft 365 login portal. Credential harvesting active.",
    "CEO fraud campaign targeting finance department. Payroll redirection attempt detected.",
    "Phishing emails with malicious PDF attachments distributed to 200+ enterprise mailboxes.",
  ],
  Malware: [
    "Trojanized installer deployed on executive endpoints. C2 beacon detected on port 8443.",
    "Drive-by exploit delivering remote access trojan. Process injection into svchost.exe confirmed.",
    "Malicious PDF exploit chain delivered via spear-phish. Stage-2 payload awaiting execution.",
  ],
  Exploit: [
    "SQL injection RCE exploit targeting exposed API gateway. Database exfiltration in progress.",
    "Log4Shell RCE campaign targeting unpatched Java services across OT network segments.",
    "SCADA Modbus hijack attempt detected. Industrial control system isolation recommended immediately.",
  ],
};

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

  const summaryOptions = summaryMap[category] || ["Threat activity detected. Investigation in progress."];
  const summary = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];

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
    summary,
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
    let isMounted = true;
    // Store handles in variables accessible by the cleanup closure
    let interval: ReturnType<typeof setInterval> | null = null;
    let sub: { unsubscribe: () => void } | null = null;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const loadInitialData = async () => {
      try {
        const dbThreats = await threatService.fetchThreats(14);
        if (isMounted) {
          if (dbThreats && dbThreats.length > 0) {
            setThreats(dbThreats);
          } else {
            setThreats(buildSeedThreats());
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setThreats(buildSeedThreats());
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    // Step 2: Begin periodic updates after load completes
    startTimer = setTimeout(() => {
      interval = setInterval(() => {
        if (pausedRef.current) return;
        const newThreat = makeNewThreat();

        // Use Zustand state directly to get fresh value
        const currentThreats = useDashboardStore.getState().threat.threats as Threat[];

        // Age older threats into Mitigated locally, and conditionally to DB if UUID
        const agedThreats = currentThreats.map((t, idx) => {
          if (t.status === "Active" && currentThreats.length - idx > 5) {
            // Only update DB if it's a real UUID (not a mock t-xxxx ID)
            if (!t.id.startsWith("t-")) {
              threatService.updateThreatStatus(t.id, "Mitigated");
            }
            return { ...t, status: "Mitigated" };
          }
          return t;
        });

        useDashboardStore.getState().setThreats(agedThreats as Threat[]);

        // Generate new threat and add via store (UI-only, does not save to DB)
        useDashboardStore.getState().addLocalThreat(newThreat as any);

        // Keep total list size bounded at 15 by trimming old ones
        const updatedThreats = useDashboardStore.getState().threat.threats as Threat[];
        if (updatedThreats.length > 15) {
          setThreats(updatedThreats.slice(-15));
        }
      }, 4000);

      sub = threatService.subscribeToThreats((payload) => {
        if (payload.eventType === 'INSERT') {
          const newT = payload.new;
          // Ignore duplicates to prevent feedback loops
          const exists = useDashboardStore.getState().threat.threats.some(t => t.id === newT.id);
          if (exists) return;

          const threatData: Threat = {
            id: newT.id,
            severity: newT.severity,
            category: newT.category,
            sourceCountry: newT.source_country,
            targetCountry: newT.target_country,
            sector: newT.target_industry,
            attackVector: newT.attack_vector,
            affectedAssets: newT.affected_assets || [],
            status: newT.status,
            confidence: newT.confidence,
            attackerActor: newT.attacker_actor,
            summary: newT.summary,
            time: new Date(newT.created_at).toTimeString().split(" ")[0],
          };
          useDashboardStore.getState().addLocalThreat(threatData);
        }
      });
    }, 2000);

    // THIS cleanup now correctly tears down both the interval AND the subscription
    return () => {
      isMounted = false;
      if (startTimer) clearTimeout(startTimer);
      if (interval) clearInterval(interval);
      if (sub) sub.unsubscribe();
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
