import { Intent, IntentType } from "./copilotTypes";

const KEYWORD_MAP: Record<IntentType, string[]> = {
  SUMMARY: [
    "summarize",
    "summary",
    "overview",
    "brief",
    "briefing",
    "what happened",
    "status",
    "report",
    "incident log",
    "feed",
    "current state",
  ],
  COUNTRY_QUERY: [
    "country",
    "countries",
    "geography",
    "location",
    "locations",
    "map",
    "affect",
    "targeted country",
    "source country",
    "china",
    "russia",
    "usa",
    "india",
    "germany",
    "japan",
    "nigeria",
    "geopolitical",
    "origin",
    "destinations",
  ],
  RECOMMENDATION: [
    "mitigate",
    "mitigation",
    "recommendation",
    "recommend",
    "steps",
    "remediation",
    "action",
    "actions",
    "do next",
    "what should we do",
    "playbook",
    "contain",
    "quarantine",
    "fix",
    "patch",
    "safeguard",
  ],
  RISK_ANALYSIS: [
    "risk",
    "score",
    "index",
    "posture",
    "increase",
    "decrease",
    "health",
    "susceptibility",
    "resilience",
    "safeguard impact",
  ],
  EDUCATION: [
    "explain",
    "what is",
    "about",
    "threat group",
    "lockbit",
    "pandakit",
    "actor",
    "actors",
    "blackshadow",
    "ghostfleet",
    "nilewolf",
    "cve",
    "concept",
    "define",
    "understand",
    "who is",
    "ddos",
    "phishing",
    "ransomware",
    "exploit",
    "malware",
  ],
  SIMULATION: [
    "pause",
    "play",
    "speed",
    "simulation",
    "scenario",
    "presentation",
    "autoplay",
    "start",
    "stop",
    "demo",
    "sandbox",
    "run scenario",
  ],
  GENERAL: ["hello", "hi", "hey", "who are you", "help", "greet", "clearance"],
};

export function detectIntent(query: string): Intent {
  const normalized = query.toLowerCase();
  const scores: Record<IntentType, { count: number; matched: string[] }> = {
    SUMMARY: { count: 0, matched: [] },
    COUNTRY_QUERY: { count: 0, matched: [] },
    RECOMMENDATION: { count: 0, matched: [] },
    RISK_ANALYSIS: { count: 0, matched: [] },
    EDUCATION: { count: 0, matched: [] },
    SIMULATION: { count: 0, matched: [] },
    GENERAL: { count: 0, matched: [] },
  };

  let maxCount = 0;
  let detectedType: IntentType = "GENERAL";

  // Check keyword matches
  (Object.keys(KEYWORD_MAP) as IntentType[]).forEach((type) => {
    KEYWORD_MAP[type].forEach((kw) => {
      if (normalized.includes(kw)) {
        scores[type].count += 1;
        scores[type].matched.push(kw);
      }
    });

    if (scores[type].count > maxCount) {
      maxCount = scores[type].count;
      detectedType = type;
    }
  });

  // Calculate confidence based on matches count
  let confidence = 70;
  if (maxCount === 1) confidence = 87;
  else if (maxCount === 2) confidence = 94;
  else if (maxCount >= 3) confidence = 98;
  else {
    // If no keywords matched, classify as GENERAL with default confidence
    detectedType = "GENERAL";
    confidence = 90;
  }

  return {
    type: detectedType,
    confidence,
    matchedKeywords: scores[detectedType].matched,
  };
}
