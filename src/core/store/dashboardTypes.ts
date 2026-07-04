// src/core/store/dashboardTypes.ts

// Core Threat definition (minimal fields used across the app)
export type Threat = {
  id: string;
  severity: 'crit' | 'high' | 'medium' | 'low';
  status: string; // e.g., 'Active', 'Resolved'
  category: string;
  targetCountry: string;
  sourceCountry: string;
  targetIndustry?: string;
  attackerActor?: string;
  summary?: string;
  sector?: string;
  attackVector?: string;
  affectedAssets?: string[];
  confidence?: number;
};

// Threat domain state
export interface ThreatState {
  threats: Threat[];
  selectedThreatId: string | null;
  hoveredThreatId: string | null;
  undoStack: string[]; // previous selections for undo/back navigation
}

// AI context state
export interface AIContext {
  activeThreatId: string | null;
  summary: string;
  recommendations: string[]; // placeholder for recommendation objects
  confidence: number; // 0-100
  status: 'idle' | 'generating' | 'ready' | 'error';
  generatedAt?: Date;
  
  // AI Engine State
  aiEngineRunning: boolean;
  modelName: string;
  lastAnalysisTimestamp?: number;
  
  // Situation Report Fields
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryCampaign: string;
  currentSituation: string;
  predictedNextTarget: string;
  topTargetedSector: string;
  recommendedActions: string[];
}

// Metrics state – totals, trends, timestamps, and auxiliary data
export interface MetricsState {
  totals: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    totalThreats: number;
  };
  trends: {
    lastHour: number;
    last24Hours: number;
    delta: number;
  };
  updatedAt?: Date; // last time metrics were recalculated
  severityCounts?: Record<string, number>; // optional map for future extensions
  countries?: string[]; // list of unique countries present in threats
}

// UI / notification state (max 3 toasts)
export interface UIState {
  toastQueue: Toast[]; // limited to a maximum of 3 entries
}

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number; // ms
}

// Presentation mode (formerly DemoMode)
export interface PresentationMode {
  enabled: boolean;
  scenario: 'Ransomware' | 'Phishing' | 'Botnet' | 'ZeroDay' | null;
  speed: number; // 1 = normal speed
  autoplay: boolean;
}

// Root store state
export interface DashboardState {
  version: number;
  threat: ThreatState;
  ai: AIContext;
  metrics: MetricsState;
  ui: UIState;
  presentation: PresentationMode;

  // Actions
  addThreat: (threat: Threat) => void;
  addLocalThreat: (threat: Threat) => void;
  removeThreat: (id: string) => void;
  selectThreat: (id: string) => void;
  hoverThreat: (id: string | null) => void;
  undoSelection: () => void;
  clearUndoStack: () => void;
  enqueueToast: (toast: Toast) => void;
  dequeueToast: (id: string) => void;
  setPresentationEnabled: (enabled: boolean) => void;
  setPresentationScenario: (scenario: PresentationMode['scenario']) => void;
  setPresentationSpeed: (speed: number) => void;
  setPresentationAutoplay: (autoplay: boolean) => void;
  setAIStatus: (status: AIContext['status']) => void;
  setAISummary: (summary: string) => void;
  setAIRecommendations: (recs: string[]) => void;
  setAIConfidence: (conf: number) => void;
  setAIGeneratedAt: (date: Date) => void;
  setThreats: (threats: Threat[]) => void;
  setAIEngineRunning: (aiEngineRunning: boolean) => void;
  updateAISituationReport: (report: Partial<AIContext>) => void;
  triggerAIAnalysis: () => void;
}
