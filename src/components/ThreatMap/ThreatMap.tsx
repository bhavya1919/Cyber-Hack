import React, { useState } from "react";
import { useThreatFeed } from "./useThreatFeed";
import { AttackArc } from "./AttackArc";
import { AttackParticle } from "./AttackParticle";
import { PulseMarker } from "./PulseMarker";
import { ThreatPopup } from "./ThreatPopup";
import { MapHUD } from "./MapHUD";
import { SectionHeader } from "../landing/Section";
import { Loader2, RefreshCw, AlertTriangle, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function ThreatMap() {
  const {
    threats,
    selectedThreat,
    isLoading,
    error,
    selectThreat,
    clearSelection,
    triggerSimulatedError,
    clearSimulatedError,
    setThreats
  } = useThreatFeed();

  const [showDebug, setShowDebug] = useState(false);

  const triggerEmptyState = () => {
    setThreats([]);
    clearSelection();
  };

  const activeThreats = threats.filter((t) => t.status === "Active");

  return (
    <section className="relative z-10 isolate py-24 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-6">
      <div className="relative">
      {/* Map Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl md:p-6 shadow-[0_20px_50px_-20px_rgba(0,229,255,0.2)] relative group">
          
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#040810] via-[#05070A] to-[#090514] flex items-center justify-center">
            
            {/* Layer 1: Dotted Matrix World Projection Mask */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 h-full w-full opacity-30 select-none pointer-events-none">
              <defs>
                <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.2" fill="#00E5FF" fillOpacity="0.4" />
                </pattern>
                <mask id="worldmask">
                  <rect width="1000" height="500" fill="black" />
                  {/* North America */}
                  <ellipse cx="200" cy="180" rx="140" ry="75" fill="white" />
                  {/* Eurasia & Europe */}
                  <ellipse cx="500" cy="200" rx="190" ry="95" fill="white" />
                  {/* East Asia / Japan */}
                  <ellipse cx="780" cy="210" rx="150" ry="85" fill="white" />
                  {/* South America */}
                  <ellipse cx="230" cy="340" rx="100" ry="85" fill="white" />
                  {/* Africa */}
                  <ellipse cx="540" cy="350" rx="100" ry="75" fill="white" />
                  {/* Australia */}
                  <ellipse cx="840" cy="370" rx="90" ry="60" fill="white" />
                </mask>
              </defs>
              <rect width="1000" height="500" fill="url(#dots)" mask="url(#worldmask)" />
            </svg>

            {/* Layer 2: Gridlines Background */}
            <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

            {/* LOADING STATE COVER */}
            {isLoading && (
              <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-[#00E5FF] animate-spin" />
                <div className="text-xs font-mono tracking-widest text-white/70 uppercase animate-pulse">
                  Syncing threat intelligence arrays...
                </div>
                <div className="text-[10px] font-mono text-white/30">
                  ESTABLISHING SECURE HANDSHAKE (V4.1.2)
                </div>
              </div>
            )}

            {/* ERROR STATE COVER */}
            {error && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="h-12 w-12 rounded-full bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 flex items-center justify-center text-[#FF4D6D]">
                  <AlertTriangle className="h-6 w-6 animate-bounce" />
                </div>
                <div className="max-w-md">
                  <h5 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Feed Handshake Timeout</h5>
                  <p className="mt-2 text-xs text-white/60 font-mono leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearSimulatedError}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-mono text-[#00FFC8] hover:bg-white/10 transition-all duration-300 ease-out cursor-pointer active:scale-95"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reconnect Feed</span>
                </button>
              </div>
            )}

            {/* EMPTY STATE SCANNING EFFECT */}
            {!isLoading && !error && activeThreats.length === 0 && (
              <>
                {/* Radar sweep lines */}
                <svg viewBox="0 0 1000 500" className="absolute inset-0 h-full w-full pointer-events-none opacity-30">
                  <circle cx="500" cy="250" r="100" stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
                  <circle cx="500" cy="250" r="200" stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
                  <circle cx="500" cy="250" r="300" stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.05" fill="none" />
                  <line
                    x1="500"
                    y1="250"
                    x2="850"
                    y2="120"
                    stroke="#00E5FF"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    className="animate-rotate-slow"
                    style={{ transformOrigin: "500px 250px", animationDuration: "12s" }}
                  />
                </svg>

                {/* Status indicator overlay */}
                <div className="absolute z-20 flex flex-col items-center justify-center gap-2.5 pointer-events-none">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FFC8]/10 border border-[#00FFC8]/20">
                    <ShieldCheck className="h-3 w-3 text-[#00FFC8] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-mono text-[#00FFC8] uppercase tracking-widest font-semibold">
                      Security Perimeter Cleared
                    </div>
                    <div className="text-[10px] font-mono text-white/40 mt-1">
                      No active threat clusters observed in last 60 seconds. Scanning network interfaces...
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Map Layers (Only draw if no error) */}
            {!error && (
              <>
                {/* Layer 3: Dynamic SVG Attack Vectors and particles */}
                <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full pointer-events-none select-none" preserveAspectRatio="none">
                  {threats.map((threat) => (
                    <g key={`group-${threat.id}`}>
                      <AttackArc threat={threat} />
                      <AttackParticle threat={threat} />
                    </g>
                  ))}
                </svg>

                {/* Layer 4: Pulse Markers */}
                {threats.map((threat) => (
                  <PulseMarker
                    key={`marker-${threat.id}`}
                    threat={threat}
                    onClick={selectThreat}
                  />
                ))}

                {/* Layer 5: HUD Overlays */}
                <MapHUD threats={threats} />

                {/* Layer 6: Sliding glass information panel */}
                {selectedThreat && (
                  <ThreatPopup threat={selectedThreat} onClose={clearSelection} />
                )}
              </>
            )}

          </div>

          {/* Footer stats bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] text-white/40">
            <div className="flex items-center gap-3">
              <span className={`flex h-2 w-2 rounded-full ${error ? "bg-[#FF4D6D]" : activeThreats.length === 0 ? "bg-[#00FFC8] animate-pulse" : "bg-[#FF9F43] animate-pulse"}`} />
              <span className="font-mono">
                {error 
                  ? "SYSTEM ALERT // INTELLIGENCE INLETS DISCONNECTED" 
                  : activeThreats.length === 0 
                    ? "STATUS NORMAL // SENSORS AGGREGATING QUIET FLUIDITY" 
                    : `OPERATIONS ONLINE // ${activeThreats.length} ACTIVE ANOMALIES`}
              </span>
            </div>
            
            {/* Live Controller Dashboard Debug Option on hover */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-[10px] font-mono text-white/30 hover:text-white/70 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {showDebug ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{showDebug ? "Hide Controls" : "Show Demo HUD"}</span>
              </button>
              <span className="font-mono hidden sm:inline">asi-map · cluster-v4.1.2 · sensor-inlets: 4,812</span>
            </div>
          </div>

          {/* Floating Demo Control panel */}
          {showDebug && (
            <div className="mt-4 border-t border-white/5 pt-4 flex flex-wrap gap-2.5 items-center justify-center z-50 relative">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2">Demo Controls:</span>
              <button
                onClick={clearSimulatedError}
                className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] px-2.5 py-1.5 rounded-lg font-mono text-[9px] hover:bg-[#00E5FF]/20 transition-all duration-300 ease-out cursor-pointer active:scale-95"
              >
                Trigger Loading State
              </button>
              <button
                onClick={triggerSimulatedError}
                className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] px-2.5 py-1.5 rounded-lg font-mono text-[9px] hover:bg-[#FF4D6D]/20 transition-all duration-300 ease-out cursor-pointer active:scale-95"
              >
                Trigger Error state
              </button>
              <button
                onClick={triggerEmptyState}
                className="bg-[#00FFC8]/10 border border-[#00FFC8]/30 text-[#00FFC8] px-2.5 py-1.5 rounded-lg font-mono text-[9px] hover:bg-[#00FFC8]/20 transition-all duration-300 ease-out cursor-pointer active:scale-95"
              >
                Trigger Empty State
              </button>
            </div>
          )}
        </div>
      </div>

      </div>
    </section>
  );
}
