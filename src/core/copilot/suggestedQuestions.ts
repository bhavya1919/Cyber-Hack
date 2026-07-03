import { AIContext } from "./copilotTypes";

export function generateSuggestedQuestions(context: AIContext): string[] {
  // Scenario 1: Presentation Mode Active
  if (context.presentationMode) {
    return [
      "Pause the simulation controls",
      `Explain scenario: ${context.currentScenario}`,
      "Predict next target coordinates",
      "Show active scenario recommendations",
    ];
  }

  // Scenario 2: Healthcare targets targeted heavily
  if (context.topSector === "Healthcare") {
    return [
      "Why is Healthcare targeted?",
      "Draft mitigation playbook",
      "Explain LockBit ransomware threat actor",
      "What are the affected assets in Healthcare?",
    ];
  }

  // Scenario 3: Financial Services
  if (context.topSector === "Financial Services") {
    return [
      "Attribute banking malware vectors",
      "Explain SWIFT network attacks",
      "Why did our risk score change?",
      "Enforce financial gateway MFA",
    ];
  }

  // Scenario 4: Energy Grid
  if (context.topSector === "Energy Grid") {
    return [
      "Mitigate SCADA Modbus exploits",
      "Energy Grid micro-segmentation steps",
      "Explain BlackShadow campaign vectors",
      "Show OT asset vulnerability index",
    ];
  }

  // Fallback default suggestions
  return [
    "Summarize active threat status",
    "Which country is most targeted?",
    "What should we do to mitigate?",
    "Show risk posture controls",
  ];
}
