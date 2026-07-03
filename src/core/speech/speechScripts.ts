// src/core/speech/speechScripts.ts
// Mission Control Voice scripts — one function per event type.
// Each returns a phrase string (or picks randomly from variants).
// Keep phrasing short, authoritative, present-tense.

import type { SpeechEventType } from "./speechTypes";

// ─── Variant pools ──────────────────────────────────────────────
const BOOT_LINES = [
  "AI Shadow Console is online. All systems nominal. Welcome, Analyst.",
  "Secure enclave initialized. Threat intelligence feed is active.",
  "Shadow Intelligence Platform is operational. Standing by.",
];

const PRESENTATION_START_LINES = [
  "Simulation mode engaged. Scenario sandbox is armed and ready.",
  "Presentation mode active. Synthetic threat generation initialized.",
];

const PRESENTATION_STOP_LINES = [
  "Simulation terminated. Console returning to passive monitoring.",
  "Scenario ended. All telemetry has been recorded.",
];

const CRITICAL_THREAT_LINES = [
  (actor: string, category: string, target: string) =>
    `Warning. Critical ${category} campaign detected. Threat actor ${actor} targeting ${target}.`,
  (actor: string, category: string, target: string) =>
    `Alert. ${actor} has initiated a ${category} attack on ${target}. Immediate response required.`,
  (_a: string, category: string, target: string) =>
    `Critical incident. ${category} activity confirmed against ${target}. AI analysis underway.`,
];

const THREAT_MITIGATED_LINES = [
  "Threat vector has been mitigated. Initiating post-incident analysis.",
  "Containment confirmed. Affected systems quarantined.",
];

const RISK_CRITICAL_LINES = [
  (score: number) =>
    `Warning. Global Risk Index has increased to ${score}. Executive attention is required.`,
  (score: number) =>
    `Critical threshold reached. Organizational risk score is now ${score}. Deploy response teams.`,
];

const RISK_ELEVATED_LINES = [
  (score: number) => `Risk level elevated. Current index is ${score}. Monitoring closely.`,
];

const RISK_NORMAL_LINES = [
  "Risk levels have returned to baseline. Operations stable.",
  "Threat pressure reduced. Risk index within acceptable range.",
];

const AI_PREDICTION_LINES = [
  (prediction: string) =>
    `AI model updated. Predicted next target: ${prediction}. Recommend proactive countermeasures.`,
  (prediction: string) =>
    `Shadow AI predicts movement toward ${prediction}. Adjusting threat posture.`,
];

const REPORT_GENERATED_LINES = [
  "Threat intelligence report compiled and ready for review.",
  "Executive briefing document generated. Recommendations attached.",
];

const SCENARIO_LINES: Record<string, string[]> = {
  Ransomware: [
    "Ransomware scenario initiated. LockBit encryption patterns detected. Isolation recommended.",
    "Warning. Critical ransomware campaign active. Healthcare infrastructure is the primary target.",
  ],
  Phishing: [
    "Phishing surge scenario active. Credential harvesting campaign in progress.",
    "Alert. Social engineering wave detected. Finance department under targeted attack.",
  ],
  Botnet: [
    "Botnet DDoS scenario launched. Volumetric flood targeting edge infrastructure.",
    "GhostFleet campaign active. Load balancers under sustained distributed attack.",
  ],
  ZeroDay: [
    "Zero-day exploit scenario running. Critical vulnerability being actively exploited.",
    "PandaKit threat actor detected. Remote code execution campaign targeting energy grid.",
  ],
};

const NOTIFICATION_CRITICAL_LINES = [
  (title: string) => `Critical security alert. ${title}. Review notification center immediately.`,
  (title: string) => `Urgent. ${title}. This event requires immediate attention.`,
];

// ─── Picker utility ─────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Public resolver ─────────────────────────────────────────────

export interface ScriptContext {
  eventType: SpeechEventType;
  actor?: string;
  category?: string;
  target?: string;
  riskScore?: number;
  prediction?: string;
  scenarioId?: string;
  notifTitle?: string;
}

export function resolveScript(ctx: ScriptContext): string {
  switch (ctx.eventType) {
    case "boot_complete":
      return pick(BOOT_LINES);

    case "presentation_start":
      return pick(PRESENTATION_START_LINES);

    case "presentation_stop":
      return pick(PRESENTATION_STOP_LINES);

    case "scenario_launched": {
      const pool = SCENARIO_LINES[ctx.scenarioId ?? ""] ?? PRESENTATION_START_LINES;
      return pick(pool);
    }

    case "critical_threat_detected": {
      const fn = pick(CRITICAL_THREAT_LINES);
      return fn(ctx.actor ?? "Unknown Actor", ctx.category ?? "threat", ctx.target ?? "unknown targets");
    }

    case "threat_mitigated":
      return pick(THREAT_MITIGATED_LINES);

    case "risk_score_critical": {
      const fn = pick(RISK_CRITICAL_LINES);
      return fn(ctx.riskScore ?? 85);
    }

    case "risk_score_elevated": {
      const fn = pick(RISK_ELEVATED_LINES);
      return fn(ctx.riskScore ?? 65);
    }

    case "risk_score_normal":
      return pick(RISK_NORMAL_LINES);

    case "ai_prediction_updated": {
      const fn = pick(AI_PREDICTION_LINES);
      return fn(ctx.prediction ?? "critical infrastructure providers");
    }

    case "report_generated":
      return pick(REPORT_GENERATED_LINES);

    case "notification_critical": {
      const fn = pick(NOTIFICATION_CRITICAL_LINES);
      return fn(ctx.notifTitle ?? "critical event");
    }

    case "copilot_response":
      return "AI Copilot analysis complete. Response is ready for review.";

    default:
      return "System event logged.";
  }
}
