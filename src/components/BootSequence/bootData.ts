export interface BootStepItem {
  id: number;
  label: string;
  delay: number; // milliseconds delay from sequence start
}

export const BOOT_STEPS: BootStepItem[] = [
  { id: 1, label: "Satellite Intelligence Network Connected", delay: 300 },
  { id: 2, label: "Threat Anomaly Sensors Online", delay: 700 },
  { id: 3, label: "AI Copilot Core Engine Initialized", delay: 1000 },
  { id: 4, label: "Threat Intelligence Database Synced", delay: 1300 },
  { id: 5, label: "Global Telemetry Streams Active", delay: 1600 },
  { id: 6, label: "Security Operations Center Ready", delay: 1900 },
];
