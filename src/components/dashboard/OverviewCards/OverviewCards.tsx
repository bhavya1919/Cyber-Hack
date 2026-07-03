// src/components/dashboard/OverviewCards/OverviewCards.tsx

import React, { useState } from "react";
import { OverviewCard } from "./OverviewCard";
import { SyncStatus } from "./SyncStatus";
import { useOverviewMetrics } from "../../../core/store/dashboardSelectors";
import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Main container that renders the suite of overview cards.
 * It consumes only the `useOverviewMetrics` selector – no direct store access.
 */
export const OverviewCards = () => {
  const { totalThreats, severityCounts, activeCountries, updatedAt } = useOverviewMetrics();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Derive values for individual cards
  const critical = severityCounts?.crit ?? 0;
  const high = severityCounts?.high ?? 0;
  const medium = severityCounts?.med ?? 0;
  
  // Custom composites
  const riskIndex = Math.min(99, Math.max(12, Math.round((critical * 4 + high * 2 + medium) * 1.2)));
  const riskLevel = riskIndex > 75 ? "High" : riskIndex > 45 ? "Medium" : "Low";

  // Velocity - threats/hour simulated based on active count
  const velocityValue = Math.round(totalThreats / 10) + activeCountries;

  const trendThreats = { direction: "up" as const, value: 18, label: "vs last hour" };
  const trendCritical = { direction: "up" as const, value: 6, label: "vs last hour" };
  const trendCountries = { direction: "stable" as const, value: 0, label: "monitored" };
  const trendVelocity = { direction: "up" as const, value: 12, label: "vs baseline" };
  const trendRisk = { direction: riskLevel.toLowerCase() as any, value: riskIndex, label: riskLevel };

  const iconStyle = (emoji: string): ReactNode => (
    <span role="img" aria-label="icon" className="text-xl">
      {emoji}
    </span>
  );

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08, // 80ms stagger delay
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardsData = [
    {
      title: "Threats",
      value: totalThreats > 0 ? totalThreats : null,
      trend: trendThreats,
      icon: iconStyle("🚨"),
      accentColor: "#FF4D6D",
      subtitle: "Total Live",
    },
    {
      title: "Critical",
      value: totalThreats > 0 ? critical : null,
      trend: trendCritical,
      icon: iconStyle("🔥"),
      accentColor: "#FF9F43",
      subtitle: "Crit Severity",
    },
    {
      title: "Countries",
      value: totalThreats > 0 ? activeCountries : null,
      trend: trendCountries,
      icon: iconStyle("🌍"),
      accentColor: "#00E5FF",
      subtitle: "Active Spans",
    },
    {
      title: "Threat Velocity",
      value: totalThreats > 0 ? velocityValue : null,
      trend: trendVelocity,
      icon: iconStyle("⚡"),
      accentColor: "#00FFC8",
      subtitle: "Events / HR",
    },
    {
      title: "Global Risk Index",
      value: totalThreats > 0 ? riskIndex : null,
      trend: trendRisk,
      icon: iconStyle("🛡️"),
      accentColor: "#6C63FF",
      subtitle: riskLevel,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-6 shrink-0 mb-8">
      {/* Sync status */}
      <SyncStatus />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {cardsData.map((card, idx) => {
          const isHovered = hoveredIndex === idx;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;

          return (
            <motion.div key={card.title} variants={cardVariants}>
              <OverviewCard
                title={card.title}
                value={card.value}
                trend={card.trend}
                icon={card.icon}
                accentColor={card.accentColor}
                subtitle={card.subtitle}
                isHovered={isHovered}
                isDimmed={isDimmed}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
