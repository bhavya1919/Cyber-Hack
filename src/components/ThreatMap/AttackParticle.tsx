import React from "react";
import { Threat } from "./useThreatFeed";

interface AttackParticleProps {
  threat: Threat;
}

const sevColor: Record<string, string> = {
  crit: "#FF4D6D",
  high: "#FF9F43",
  med: "#00E5FF",
  low: "#00FFC8",
};

export const AttackParticle: React.FC<AttackParticleProps> = ({ threat }) => {
  const { sourceCoords, targetCoords, severity, status } = threat;

  if (status !== "Active" || !sourceCoords || !targetCoords) return null;

  const x1 = sourceCoords.x;
  const y1 = sourceCoords.y;
  const x2 = targetCoords.x;
  const y2 = targetCoords.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  const arcHeight = Math.max(8, dist * 0.3);
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - arcHeight;

  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const color = sevColor[severity] || "#00E5FF";

  // Dynamic animation duration based on distance so long journeys don't look ridiculously fast
  const duration = Math.max(1.5, Math.min(3.5, dist * 0.05)) + "s";

  return (
    <g>
      {/* Outer blurred glow */}
      <circle r="1" fill={color} opacity="0.8">
        <animateMotion
          dur={duration}
          repeatCount="indefinite"
          path={pathD}
        />
      </circle>
      {/* Core bright particle */}
      <circle r="0.6" fill="#FFFFFF">
        <animateMotion
          dur={duration}
          repeatCount="indefinite"
          path={pathD}
        />
      </circle>
    </g>
  );
};
