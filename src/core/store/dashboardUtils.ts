// src/core/store/dashboardUtils.ts

import { Threat } from './dashboardTypes';

/**
 * Calculate metrics from the list of threats.
 * Returns totals, trends placeholders, updated timestamp, severity map and country list.
 */
export function calculateMetrics(threats: Threat[]) {
  const totals = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    totalThreats: threats.length,
  };
  const severityCounts: Record<string, number> = {};
  const countrySet = new Set<string>();

  threats.forEach(t => {
    // count severity
    switch (t.severity) {
      case 'crit':
        totals.critical++;
        break;
      case 'high':
        totals.high++;
        break;
      case 'medium':
        totals.medium++;
        break;
      case 'low':
        totals.low++;
        break;
    }
    // record severity map
    severityCounts[t.severity] = (severityCounts[t.severity] ?? 0) + 1;
    // collect countries
    countrySet.add(t.targetCountry);
    countrySet.add(t.sourceCountry);
  });

  // Placeholder trends (could be calculated over time in future)
  const trends = {
    lastHour: 0,
    last24Hours: 0,
    delta: 0,
  };

  return {
    totals,
    trends,
    updatedAt: new Date(),
    severityCounts,
    countries: Array.from(countrySet),
  };
}
