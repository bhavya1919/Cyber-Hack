import { createFileRoute } from "@tanstack/react-router";
import { ThreatCard } from "@/components/ThreatFeed/ThreatCard";
import type { Threat } from "@/components/ThreatMap/useThreatFeed";
import { countryCoordinates } from "@/components/ThreatMap/countryCoordinates";

/** Quick visual preview of the ThreatCard component at all severity levels. */
const previewThreats: Threat[] = [
  {
    id: "p-1",
    sourceCountry: "Russia",
    sourceCity: "Moscow",
    sourceCoords: countryCoordinates["Russia"],
    targetCountry: "Germany",
    targetCity: "Berlin",
    targetCoords: countryCoordinates["Germany"],
    category: "Exploit",
    severity: "crit",
    time: "22:14:07",
    status: "Active",
    targetIndustry: "Energy Grid",
    attackerActor: "BlackShadow",
    summary:
      "BlackShadow has deployed a weaponized zero-day exploit targeting exposed SCADA systems in European energy grids. Lateral movement observed across 6 OT network segments. Immediate isolation of ICS endpoints recommended.",
    confidence: 97,
  },
  {
    id: "p-2",
    sourceCountry: "China",
    sourceCity: "Beijing",
    sourceCoords: countryCoordinates["China"],
    targetCountry: "USA",
    targetCity: "Washington D.C.",
    targetCoords: countryCoordinates["USA"],
    category: "Ransomware",
    severity: "high",
    time: "22:11:52",
    status: "Active",
    targetIndustry: "Financial Services",
    attackerActor: "PandaKit",
    summary:
      "PandaKit ransomware campaign targeting US financial institutions via spear-phishing. Double-extortion model detected — data exfiltration preceded encryption. 3 banking entities confirmed affected.",
    confidence: 91,
  },
  {
    id: "p-3",
    sourceCountry: "Nigeria",
    sourceCity: "Lagos",
    sourceCoords: countryCoordinates["Nigeria"],
    targetCountry: "United Kingdom",
    targetCity: "London",
    targetCoords: countryCoordinates["United Kingdom"],
    category: "Phishing",
    severity: "med",
    time: "22:08:30",
    status: "Active",
    targetIndustry: "Healthcare",
    attackerActor: "NileWolf",
    summary:
      "NileWolf credential-harvesting campaign targeting NHS staff via fake Microsoft 365 login pages. Over 400 phishing emails intercepted; 23 accounts potentially compromised.",
    confidence: 76,
  },
  {
    id: "p-4",
    sourceCountry: "Iceland",
    sourceCity: "Reykjavik",
    sourceCoords: countryCoordinates["Iceland"],
    targetCountry: "Canada",
    targetCity: "Ottawa",
    targetCoords: countryCoordinates["Canada"],
    category: "DDoS",
    severity: "low",
    time: "22:02:15",
    status: "Mitigated",
    targetIndustry: "Government",
    summary: undefined,  // tests graceful fallback
    confidence: undefined,
  },
];

function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#05070A] px-8 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E5FF]">
            <span className="h-1 w-1 rounded-full bg-[#00E5FF]" />
            Component Preview
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">ThreatCard</h1>
          <p className="mt-2 text-sm text-white/50">
            All four severity levels — Critical, High, Medium, Low
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {previewThreats.map((t, i) => (
            <ThreatCard
              key={t.id}
              threat={t}
              index={i}
              onClick={(threat) => alert(`Clicked: ${threat.category} — ${threat.targetCountry}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/preview")({
  component: PreviewPage,
});
