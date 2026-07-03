// src/core/store/dashboardSelectors.ts

import { useDashboardStore } from './dashboardStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Selector that returns only the overview metrics needed by the Overview Cards.
 * This keeps the UI layer completely isolated from the rest of the store.
 */
export const useOverviewMetrics = () =>
  useDashboardStore(useShallow(state => ({
    totalThreats: state.metrics.totals.totalThreats,
    severityCounts: state.metrics.severityCounts,
    activeCountries: (state.metrics.countries?.length ?? 0),
    updatedAt: state.metrics.updatedAt,
  })));

// Additional selectors can be added here following the same pattern.
