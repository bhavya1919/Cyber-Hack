import React from "react";
import { Threat } from "./useThreatFeed";
import { AlertTriangle, MapPin, Radio } from "lucide-react";

interface MapHUDProps {
  threats: Threat[];
}

const sevColor: Record<string, string> = {
  crit: "#FF4D6D",
  high: "#FF9F43",
  med: "#00E5FF",
  low: "#00FFC8",
};

export const MapHUD: React.FC<MapHUDProps> = ({ threats }) => {
  const activeThreats = threats.filter(t => t.status === "Active").slice(-4).reverse();
  const criticalCount = threats.filter(t => t.severity === "crit" && t.status === "Active").length;

  return (
    <>
      {/* Top Left: Coverage Telemetry (Hidden on small mobile screens to prevent clutter) */}
      <div className="absolute left-4 top-4 md:left-6 md:top-6 w-52 md:w-64 glass-card p-3 md:p-4 border border-white/10 shadow-lg pointer-events-none z-10 hidden sm:block">
        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[#FF4D6D] animate-pulse">
          <Radio className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span>Active Sensor Array</span>
        </div>
        <div className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-white">Live Intrusion Stream</div>
        <div className="mt-0.5 md:mt-1 text-[10px] md:text-[11px] text-white/50 leading-normal">
          Aggregating global deep-web sensors & public honeypots.
        </div>
        {criticalCount > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[9px] font-mono text-[#FF4D6D]">
            <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
            <span>{criticalCount} Critical breaches in progress</span>
          </div>
        )}
      </div>

      {/* Bottom Left: Legend (Only visible on medium tablets/desktops and above) */}
      <div className="absolute left-6 bottom-6 w-60 glass-card p-4 border border-white/10 shadow-lg pointer-events-none z-10 hidden md:block">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>Vector Index</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {(["crit", "high", "med", "low"] as const).map((s) => (
            <div key={s} className="flex items-center justify-between text-[11px] text-white/70">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: sevColor[s],
                    boxShadow: `0 0 10px ${sevColor[s]}`,
                  }}
                />
                <span className="uppercase font-mono text-[9px] text-white/60">{s}</span>
              </div>
              <span className="text-[9px] text-white/40 font-mono">
                {s === "crit" ? "9.0 - 10.0" : s === "high" ? "7.0 - 8.9" : s === "med" ? "4.0 - 6.9" : "0.1 - 3.9"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-white/5 pt-2 flex items-center justify-between text-[8px] font-mono text-white/30">
          <span>COORDINATES PROJ</span>
          <span>EPSG:4326 (WSG84)</span>
        </div>
      </div>

      {/* Bottom Right: Recent Transits Ticker (Hidden on small mobile screens to keep the workspace tactile) */}
      <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 w-64 md:w-80 glass-card p-3 md:p-4 border border-white/10 shadow-lg pointer-events-auto z-10 max-h-[140px] md:max-h-[170px] overflow-hidden hidden sm:block">
        <div className="flex items-center justify-between text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 md:mb-2 border-b border-white/5 pb-1 md:pb-1.5">
          <span>Recent Transits</span>
          <span className="text-[#00FFC8] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FFC8] animate-ping" />
            STREAMING
          </span>
        </div>
        {activeThreats.length === 0 ? (
          <div className="text-[9px] md:text-[10px] font-mono text-white/30 py-3 md:py-4 text-center">
            Listening for network anomalies...
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[90px] md:max-h-[125px] overflow-y-auto pr-1">
            {activeThreats.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] rounded-lg p-1.5 text-[9px] md:text-[10px] transition-all"
              >
                <div className="flex items-center gap-1.5 truncate max-w-[130px] md:max-w-[170px]">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: sevColor[t.severity] }}
                  />
                  <span className="font-mono text-white/70 font-bold uppercase shrink-0 text-[7px] md:text-[8px] border border-white/10 px-1 rounded">
                    {t.category}
                  </span>
                  <span className="text-white/85 truncate">
                    {t.sourceCountry} ➔ {t.targetCountry}
                  </span>
                </div>
                <span className="font-mono text-white/40 shrink-0 text-[8px] md:text-[9px]">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
