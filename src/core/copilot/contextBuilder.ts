import { useDashboardStore } from "../store/dashboardStore";
import { AIContext } from "./copilotTypes";
import { Threat } from "../store/dashboardTypes";

export function buildAIContext(): AIContext {
  const state = useDashboardStore.getState();
  const threats = (state.threat?.threats || []) as Threat[];
  const activeThreats = threats.filter((t) => t.status === "Active");

  // Severity counts
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  activeThreats.forEach((t) => {
    if (t.severity === "crit") criticalCount++;
    else if (t.severity === "high") highCount++;
    else if (t.severity === "medium" || t.severity === "med") mediumCount++;
    else if (t.severity === "low") lowCount++;
  });

  // Selected threat
  const selectedThreatId = state.threat?.selectedThreatId;
  const selectedThreat = selectedThreatId
    ? threats.find((t) => t.id === selectedThreatId) || null
    : null;

  // Latest threat
  const latestThreat = threats.length > 0 ? threats[threats.length - 1] : null;

  // Helper stats frequency calculation
  const getTopFreq = (arr: string[], fallback: string): string => {
    if (arr.length === 0) return fallback;
    const freqs: Record<string, number> = {};
    let maxCount = 0;
    let topItem = fallback;
    arr.forEach((item) => {
      freqs[item] = (freqs[item] || 0) + 1;
      if (freqs[item] > maxCount) {
        maxCount = freqs[item];
        topItem = item;
      }
    });
    return topItem;
  };

  const countries = activeThreats.map((t) => t.targetCountry).filter(Boolean);
  const sectors = activeThreats.map((t) => t.sector || t.targetIndustry || "").filter(Boolean);
  const actors = activeThreats.map((t) => t.attackerActor || "").filter(Boolean);
  const vectors = activeThreats.map((t) => t.attackVector || "").filter(Boolean);
  
  const allAssets: string[] = [];
  activeThreats.forEach((t) => {
    if (t.affectedAssets) allAssets.push(...t.affectedAssets);
  });

  const topCountry = getTopFreq(countries, "None");
  const topSector = getTopFreq(sectors, "None");
  const topCampaign = getTopFreq(actors, "None");
  const topAttackVector = getTopFreq(vectors, "None");

  // Collect top 2 affected assets
  const assetFreqs: Record<string, number> = {};
  allAssets.forEach((asset) => {
    assetFreqs[asset] = (assetFreqs[asset] || 0) + 1;
  });
  const topAffectedAssets = Object.entries(assetFreqs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([asset]) => asset);

  // Risk Score calculation matching OverviewCards
  const riskScore = Math.min(
    99,
    Math.max(12, Math.round((criticalCount * 4 + highCount * 2 + mediumCount) * 1.2))
  );
  const riskTrend = riskScore > 75 ? "HIGH" : riskScore > 45 ? "MEDIUM" : "LOW";

  // Unique countries count
  const countrySet = new Set<string>();
  threats.forEach((t) => {
    if (t.targetCountry) countrySet.add(t.targetCountry);
    if (t.sourceCountry) countrySet.add(t.sourceCountry);
  });

  const velocity = Math.round(threats.length / 10) + countrySet.size;

  return {
    activeThreatCount: activeThreats.length,
    criticalThreatCount: criticalCount,
    highThreatCount: highCount,
    mediumThreatCount: mediumCount,
    lowThreatCount: lowCount,
    selectedThreat,
    latestThreat,
    topCampaign,
    topSector,
    topCountry,
    topAttackVector,
    topAffectedAssets,
    riskScore,
    riskTrend,
    velocity,
    countriesAffected: countrySet.size,
    analyticsSummary: state.ai?.currentSituation || "No situation active.",
    currentScenario: state.presentation?.scenario || "None",
    presentationMode: state.presentation?.enabled || false,
    recommendations: state.ai?.recommendedActions || [],
    predictions: state.ai?.predictedNextTarget || "None",
    lastUpdated: new Date().toLocaleTimeString(),
    confidence: state.ai?.confidence || 90,
  };
}
