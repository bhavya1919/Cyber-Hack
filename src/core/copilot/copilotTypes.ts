import { Threat } from "../store/dashboardTypes";

export type IntentType =
  | "SUMMARY"
  | "COUNTRY_QUERY"
  | "RECOMMENDATION"
  | "RISK_ANALYSIS"
  | "EDUCATION"
  | "SIMULATION"
  | "GENERAL";

export interface Intent {
  type: IntentType;
  confidence: number;
  matchedKeywords: string[];
}

export interface AIContext {
  activeThreatCount: number;
  criticalThreatCount: number;
  highThreatCount: number;
  mediumThreatCount: number;
  lowThreatCount: number;
  selectedThreat: Threat | null;
  latestThreat: Threat | null;
  topCampaign: string;
  topSector: string;
  topCountry: string;
  topAttackVector: string;
  topAffectedAssets: string[];
  riskScore: number;
  riskTrend: string;
  velocity: number;
  countriesAffected: number;
  analyticsSummary: string;
  currentScenario: string;
  presentationMode: boolean;
  recommendations: string[];
  predictions: string;
  lastUpdated: string;
  confidence: number;
}

export interface Message {
  id: string;
  sender: "analyst" | "copilot";
  text: string;
  timestamp: string;
  isCode?: boolean;
}

export interface ConversationMemory {
  messages: Message[];
  lastIntent?: IntentType;
  lastThreatId?: string;
  lastCountry?: string;
  lastSector?: string;
  lastActor?: string;
  lastScenario?: string;
  lastRecommendations?: string[];
  timestamp: number;
}

export interface AIProviderResponse {
  text: string;
  reasoningLogs: string[];
}

export interface AIProvider {
  generate(
    context: AIContext,
    intent: Intent,
    memory: ConversationMemory
  ): Promise<AIProviderResponse>;
}
