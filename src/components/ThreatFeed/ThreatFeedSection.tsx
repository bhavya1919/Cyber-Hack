import React, { useCallback } from "react";
import { ThreatFeed } from "./ThreatFeed";
import { SectionHeader } from "../landing/Section";
import { useThreatFeed, Threat } from "../ThreatMap/useThreatFeed";
import { countryCoordinates } from "../ThreatMap/countryCoordinates";
import { AISituationReport } from "../dashboard/AISituationReport";

const DEMO_ATTACKS: Partial<Threat>[] = [
  {
    category: "Ransomware",
    severity: "crit",
    sourceCountry: "Russia",
    targetCountry: "India",
    targetIndustry: "Healthcare",
    attackerActor: "BlackShadow",
    summary:
      "LockBit 3.0 ransomware detected targeting hospital networks. Encrypted patient record systems across 4 facilities. Exfiltration of 2.3 TB confirmed prior to payload deployment.",
    confidence: 99,
  },
  {
    category: "Exploit",
    severity: "crit",
    sourceCountry: "China",
    targetCountry: "USA",
    targetIndustry: "Defense",
    attackerActor: "PandaKit",
    summary:
      "Zero-day exploit (CVE-2026-9182) weaponized against US DoD contractor networks. Memory corruption in VPN gateway allowing remote code execution. Patch not yet available.",
    confidence: 96,
  },
  {
    category: "Phishing",
    severity: "high",
    sourceCountry: "Nigeria",
    targetCountry: "United Kingdom",
    targetIndustry: "Financial Services",
    attackerActor: "NileWolf",
    summary:
      "Credential-harvesting campaign targeting UK bank employees via spoofed internal HR portals. 127 credential sets compromised. MFA bypass kits observed in attack chain.",
    confidence: 88,
  },
];

let demoIndex = 0;

interface ThreatFeedSectionProps {
  /** Called when a threat card is clicked — for dashboard coordination */
  onThreatSelect?: (threat: Threat) => void;
}

export function ThreatFeedSection({ onThreatSelect }: ThreatFeedSectionProps) {
  const {
    threats,
    isLoading,
    error,
    setThreats,
    clearSimulatedError,
    selectThreat,
  } = useThreatFeed();

  const handleGenerateAttack = useCallback(() => {
    const template = DEMO_ATTACKS[demoIndex % DEMO_ATTACKS.length];
    demoIndex++;

    const srcCoords =
      countryCoordinates[template.sourceCountry!] ??
      countryCoordinates["Russia"];
    const destCoords =
      countryCoordinates[template.targetCountry!] ??
      countryCoordinates["India"];

    const now = new Date();
    
    // Map vector and assets for simulated attacks
    const vector = template.category === "Ransomware" 
      ? "LockBit 3.0 Ransomware Payload" 
      : template.category === "Exploit" 
        ? "CVE-2026-9182 VPN Gateway RCE" 
        : "Spear-Phishing Credential Harvest";
        
    const assets = template.category === "Ransomware"
      ? ["Hospital Patient Record System", "Active Directory Server"]
      : template.category === "Exploit"
        ? ["Defense Gateway Network Routing Infrastructure"]
        : ["Employee Mailboxes", "Identity Verification Service"];

    const newThreat: Threat = {
      id: `demo-${Date.now()}`,
      sourceCountry: template.sourceCountry!,
      sourceCity: srcCoords.label,
      sourceCoords: srcCoords,
      targetCountry: template.targetCountry!,
      targetCity: destCoords.label,
      targetCoords: destCoords,
      category: template.category!,
      severity: template.severity!,
      time: now.toTimeString().split(" ")[0],
      status: "Active",
      targetIndustry: template.targetIndustry,
      sector: template.targetIndustry,
      attackerActor: template.attackerActor,
      summary: template.summary,
      confidence: template.confidence,
      attackVector: vector,
      affectedAssets: assets,
    };

    setThreats((prev) => [newThreat, ...prev.slice(0, 19)]);
  }, [setThreats]);

  const handleThreatSelect = useCallback(
    (threat: Threat) => {
      selectThreat(threat);
      onThreatSelect?.(threat);
    },
    [selectThreat, onThreatSelect]
  );

  return (
    <section className="relative z-10 isolate py-24 pb-32">
      {/* Feed Header */}
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Operational Intelligence Feed"
          title={
            <>
              Every attack,<span className="text-gradient">instantly surfaced.</span>
            </>
          }
          desc="Real-time cyber event stream processed by AI. Click any threat card to open the full intelligence report and trigger coordinated dashboard responses."
        />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 h-[680px] lg:h-[750px]">
            <ThreatFeed
              threats={threats}
              isLoading={isLoading}
              error={error}
              onThreatSelect={handleThreatSelect}
              onGenerateAttack={handleGenerateAttack}
              onRetry={clearSimulatedError}
            />
          </div>
          <div className="lg:col-span-4 h-[680px] lg:h-[750px]">
            <AISituationReport />
          </div>
        </div>
      </div>
    </section>
  );
}
