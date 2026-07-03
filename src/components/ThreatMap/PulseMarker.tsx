import React from "react";
import { Threat } from "./useThreatFeed";

interface PulseMarkerProps {
  threat: Threat;
  onClick: (threat: Threat) => void;
}

const sevColor: Record<string, string> = {
  crit: "#FF4D6D",
  high: "#FF9F43",
  med: "#00E5FF",
  low: "#00FFC8",
};

export const PulseMarker: React.FC<PulseMarkerProps> = ({ threat, onClick }) => {
  const { sourceCoords, targetCoords, severity, status, targetCountry, targetCity, category } = threat;

  if (!targetCoords) return null;

  const color = sevColor[severity] || "#00E5FF";

  return (
    <>
      {/* Target Pulse Marker */}
      <button
        onClick={() => onClick(threat)}
        className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none z-20"
        style={{ left: `${targetCoords.x}%`, top: `${targetCoords.y}%` }}
      >
        {status === "Active" && (
          <span
            className="absolute inset-0 -m-3 animate-pulse-ring rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
            }}
          />
        )}
        <span
          className="relative block h-3 w-3 rounded-full border border-black/50 transition-all duration-300 group-hover:scale-125"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 14px ${color}, 0 0 4px ${color}`,
          }}
        />
        
        {/* Hover Tooltip */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <div className="glass-card px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap border border-white/10 shadow-lg text-white">
            <span className="font-mono text-xs uppercase" style={{ color }}>
              {targetCity}, {targetCountry}
            </span>
            <div className="text-white/50 text-[9px] font-mono mt-0.5">
              Target · {category} ({severity.toUpperCase()})
            </div>
          </div>
        </div>
      </button>

      {/* Source Dot (Smaller, steady indicator) */}
      {status === "Active" && sourceCoords && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ left: `${sourceCoords.x}%`, top: `${sourceCoords.y}%` }}
        >
          <span
            className="block h-1.5 w-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        </div>
      )}
    </>
  );
};
