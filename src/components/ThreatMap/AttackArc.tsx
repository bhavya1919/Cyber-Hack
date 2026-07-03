import React from "react";
import { Threat } from "./useThreatFeed";

interface AttackArcProps {
  threat: Threat;
}

const sevColor: Record<string, string> = {
  crit: "#FF4D6D",
  high: "#FF9F43",
  med: "#00E5FF",
  low: "#00FFC8",
};

export const AttackArc: React.FC<AttackArcProps> = ({ threat }) => {
  const { sourceCoords, targetCoords, severity, status } = threat;
  
  if (!sourceCoords || !targetCoords) return null;

  const x1 = sourceCoords.x;
  const y1 = sourceCoords.y;
  const x2 = targetCoords.x;
  const y2 = targetCoords.y;

  // Calculate mid-point and dynamic bend height based on distance
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Create arc curvature (higher curve for longer distances)
  const arcHeight = Math.max(8, dist * 0.3);
  const cx = (x1 + x2) / 2;
  // Bends upward in Y space (Y goes down, so we subtract height)
  const cy = Math.min(y1, y2) - arcHeight;

  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const color = sevColor[severity] || "#00E5FF";

  return (
    <g>
      {/* Background soft glow path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity={status === "Active" ? "0.15" : "0.05"}
        vectorEffect="non-scaling-stroke"
      />
      {/* Active dash path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity={status === "Active" ? "0.7" : "0.2"}
        className={status === "Active" ? "animate-dash" : ""}
        style={{
          strokeDasharray: "4 4",
          animationDuration: status === "Active" ? "6s" : "20s",
        }}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};
