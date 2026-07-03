// src/hooks/useAISituationReport.ts

import { useDashboardStore } from "@/core/store/dashboardStore";

/**
 * Custom React hook for fetching and refreshing the AI Situation Report.
 * Connects directly to the global dashboard store.
 */
export function useAISituationReport() {
  const aiState = useDashboardStore((state) => state.ai);
  
  // Expose the trigger action from the store
  const refreshAnalysis = useDashboardStore((state: any) => state.triggerAIAnalysis);

  return {
    ...aiState,
    refreshAnalysis,
  };
}
