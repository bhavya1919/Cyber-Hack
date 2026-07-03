// src/core/constants/severity.ts

export const SEVERITY_LEVELS = ['crit', 'high', 'medium', 'low'] as const;
export type Severity = typeof SEVERITY_LEVELS[number];
