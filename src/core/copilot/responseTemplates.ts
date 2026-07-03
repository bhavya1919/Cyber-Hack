import { AIContext } from "./copilotTypes";

export function summaryTemplate(context: AIContext): string {
  return `### 🚨 Security Status Executive Briefing

Our sensors are currently monitoring **${context.activeThreatCount}** active threat vectors globally.
* **Critical severity**: \`${context.criticalThreatCount}\` events active
* **High severity**: \`${context.highThreatCount}\` events active
* **Risk Score**: \`${context.riskScore}/100\` (${context.riskTrend} risk tier)

#### Core Activity Clusters:
* **Top Targeted Sector**: \`${context.topSector}\`
* **Top Target Country**: \`${context.topCountry}\`
* **Primary Adversary**: \`${context.topCampaign}\`
* **Dominant Attack Vector**: \`${context.topAttackVector}\`

#### AI Situation Summary:
*${context.analyticsSummary}*

*Next Target Prediction*: **${context.predictions}** (Intelligence confidence: \`${context.confidence}%\`)`;
}

export function countryTemplate(context: AIContext): string {
  return `### 🌍 Geopolitical Attack Vectors Briefing

Active threat clusters currently span across **${context.countriesAffected}** different countries.
* **Most Affected Target**: \`${context.topCountry}\`
* **Attributed Origin**: Our intelligence points primarily to nodes linked to the **${context.topCampaign}** campaign.

#### Geographic Heat Map Breakdown:
${
  context.selectedThreat
    ? `* **Selected Threat Target**: ${context.selectedThreat.targetCountry} (${context.selectedThreat.targetCity}) was targeted from source city ${context.selectedThreat.sourceCity}, ${context.selectedThreat.sourceCountry}.`
    : `* **Latest Active Vector**: Target: ${context.latestThreat?.targetCountry || "None"} from Source: ${context.latestThreat?.sourceCountry || "None"}.`
}

We recommend implementing outbound geo-blocking rules on firewall interfaces communicating with high-density anomaly origins.`;
}

export function recommendationTemplate(context: AIContext): string {
  const recs = context.recommendations.length > 0 
    ? context.recommendations 
    : ["Isolate infected network segments", "Patch external-facing VPN gateways", "Block outbound port 445 (SMB) traffic", "Enforce MFA for administrative logins"];

  return `### 🛡️ Recommended Mitigations & Containment Playbook

Based on the active threat landscape (focusing on \`${context.topSector}\` targets utilizing \`${context.topAttackVector}\`):

${recs.map((rec, i) => `${i + 1}. **${rec}**\n   Audit system configurations immediately to prevent lateral traversal.`).join("\n\n")}

#### Target Specific Countermeasures:
* Run localized endpoint scans on affected assets: \`${context.topAffectedAssets.join(", ") || "Corporate Host Endpoints"}\`.
* Implement micro-segmentation playbook **PB-012** across vulnerable OT segments.`;
}

export function riskTemplate(context: AIContext): string {
  return `### 📈 Security Posture & Risk Score Analysis

* **Current Global Risk Index**: \`${context.riskScore}/100\`
* **Assessment Rating**: **${context.riskTrend} POSTURE**
* **Threat Velocity**: \`${context.velocity} events / hour\`

The risk index is compiled dynamically based on active severity clusters (Critical: \`${context.criticalThreatCount}\`, High: \`${context.highThreatCount}\`) subtracted against your active defenses.

#### Dynamic Mitigation Impact:
To lower the risk score, access the **Organization Risk** tab and toggle inactive safeguards (like EDR or Network Micro-segmentation) to simulate post-audit posture increases.`;
}

export function educationTemplate(context: AIContext, query: string): string {
  const lower = query.toLowerCase();
  
  if (lower.includes("lockbit") || lower.includes("blackshadow")) {
    return `### 👤 Adversary Profile: BlackShadow (LockBit 3.0 Syndicate)

**Country of Origin**: Russian Federation affinity (State-tolerated cybercrime).
**Primary Target Verticals**: Healthcare (Hospital networks), Energy Grid, Critical Utilities.

#### Attack Tradecraft (TTPs):
* **Initial Access**: Spear-phishing with malicious attachments containing payload droppers, or exploiting exposed SCADA ports.
* **Execution**: Double-extortion model where files are exfiltrated prior to local network encryption (volume shadow copy deletion).
* **Lateral Movement**: Heavy utilization of compromised SMB ports and Active Directory credential dumps.

#### Tactical Mitigations:
* **Block Outbound SMB Traffic**: Strictly deny external port tcp/445 traffic.
* **Verify Cold Backups**: Ensure daily configurations and databases are air-gapped.`;
  }

  if (lower.includes("pandakit") || lower.includes("apt-44")) {
    return `### 👤 Adversary Profile: PandaKit (APT-44)

**Country of Origin**: East Asia (State-affiliated espionage).
**Target Verticals**: Defense contractors, Financial Institutions, Aerospace Engineering.

#### Operational Capabilities:
* **Custom Tooling**: PandaKit utilizes the specialized *PandaShell* payload gateway, featuring multi-layer encryption and dynamic command & control (C2) endpoint shifts.
* **Bypass Techniques**: Frequently integrates MFA-bypass session token stealers and browser cookie extraction scripts.
* **Infrastructure**: Primarily routes commands through commercial botnets and hijacked IoT nodes in South America and Western Europe.

#### Current Campaign Signals:
Monitoring active target coordinates pointing to US and Japanese defence suppliers. Immediate perimeter audits recommended.`;
  }

  if (lower.includes("nilewolf")) {
    return `### 👤 Adversary Profile: NileWolf

**Country of Origin**: Middle East affinity.
**Target Verticals**: Telecommunications, Government portals, Identity providers.

#### Attack Tradecraft (TTPs):
* **Initial Access**: Social engineering campaigns targeting IT administrators with spoofed OAuth access links.
* **Execution**: Token hijacking, bypassing MFA requirements by copying active browser sessions.
* **Target assets**: Identity databases and Active Directory logs.`;
  }

  if (lower.includes("ghostfleet")) {
    return `### 👤 Adversary Profile: GhostFleet

**Nature**: Cyber mercenary group specializing in volumetric DDoS botnets.
**Capability**: Commands a globally distributed botnet comprised of over ~14,000 compromised IoT nodes.
**Impact**: Volumetric HTTP GET Floods peaking at 480 Gbps, targeting checkout APIs and load balancers to disrupt transaction flow.
**Recommended Actions**: Reroute inbound DNS traffic through scrubbing gateways and enforce rate-limiting constraints.`;
  }

  return `### 📚 Security Concept: Threat Vectors & Mitigations

You queried about threat vectors or actors. Here is an overview of active categorizations in the console:

1. **Ransomware (e.g. LockBit)**: Double-extortion campaigns targeting Backup Servers and Active Directory. Mitigation: Enforce air-gapped cold backups.
2. **Exploit (e.g. CVE-2026-9182)**: Memory corruption vulnerabilities allowing Remote Code Execution (RCE). Mitigation: Patch edge ingress gateways immediately.
3. **DDoS (e.g. GhostFleet Botnet)**: Volumetric web floods targeting web host gateways and DNS services. Mitigation: Scrub incoming traffic.
4. **Phishing**: Fake identity credential harvesting. Mitigation: Block malicious emails and train employee awareness.

Please query a specific adversary (e.g. *PandaKit*, *LockBit*, *NileWolf*) for targeted attribution briefs.`;
}

export function simulationTemplate(context: AIContext): string {
  return `### 🎮 Presentation Simulation Console Sandbox

* **Simulation Sandbox State**: ${context.presentationMode ? "⚠️ ARMED & SIMULATING" : "◉ INACTIVE / MONITORING LIVE INLETS"}
* **Active Scenario**: \`${context.currentScenario || "None"}\`
* **Threat Injection Speed**: \`${context.velocity} baseline metrics\`

#### Simulation Operator Guidelines:
1. Turn on **Presentation Mode** via the floating controls bar at the bottom of the screen.
2. Select an attack scenario (e.g., *Ransomware Attack*, *Botnet DDoS Flood*, *Zero-Day Exploit*) to trigger themed threat arcs on the map.
3. Speed up threat injection up to 10x using the speed slider to demonstrate high-stress alert responses.`;
}

export function generalTemplate(context: AIContext): string {
  return `### 🧠 Cyber Intelligence AI Copilot

Hello operator. I am **Shadow-GPT v3**, online and tracking indicators of compromise (IoC) across your networks.

I can assist you with:
1. **Status Briefings** (Ask: *"Give me a summary of active threats"*)
2. **Adversary Attribution** (Ask: *"Tell me about PandaKit or LockBit"*)
3. **Geopolitical Analysis** (Ask: *"Which countries are targeted?"*)
4. **Mitigation Playbooks** (Ask: *"What mitigations do you recommend?"*)
5. **Risk Audits** (Ask: *"Explain our current risk index"*)

Select a dynamic prompt below or query active nodes directly.`;
}
