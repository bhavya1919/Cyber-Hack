// src/core/speech/speechTypes.ts
// All types for the Mission Control Voice system

// ─── Priority Levels ──────────────────────────────────────────
// Higher = spoken first when queue drains
export type SpeechPriority = "critical" | "high" | "normal" | "low";

// ─── Named Events ─────────────────────────────────────────────
export type SpeechEventType =
  | "boot_complete"
  | "presentation_start"
  | "presentation_stop"
  | "scenario_launched"
  | "critical_threat_detected"
  | "threat_mitigated"
  | "risk_score_critical"
  | "risk_score_elevated"
  | "risk_score_normal"
  | "ai_prediction_updated"
  | "report_generated"
  | "copilot_response"
  | "notification_critical";

// ─── A single queued utterance ─────────────────────────────────
export interface SpeechItem {
  id: string;
  text: string;
  priority: SpeechPriority;
  eventType: SpeechEventType;
  timestamp: number;
  /** Rate multiplier: 0.5 (slow) – 2 (fast). Default 1.0 */
  rate?: number;
  /** Pitch: 0.1 – 2. Default 1.0 */
  pitch?: number;
}

// ─── Store shape ───────────────────────────────────────────────
export interface SpeechState {
  isMuted: boolean;
  isSupported: boolean;
  isSpeaking: boolean;
  lastSpokenText: string | null;
  lastEventType: SpeechEventType | null;
  queue: SpeechItem[];
}
