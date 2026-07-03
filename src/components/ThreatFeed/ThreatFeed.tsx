import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Threat } from "../ThreatMap/useThreatFeed";
import { ThreatCard } from "./ThreatCard";
import {
  Search,
  Pin,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Bell,
  Zap,
  X,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FilterId =
  | "all"
  | "crit"
  | "high"
  | "Ransomware"
  | "Phishing"
  | "Malware"
  | "Exploit"
  | "DDoS";

interface FilterChip {
  id: FilterId;
  label: string;
  color: string;
}

// ─── Design Data ───────────────────────────────────────────────────────────────

const FILTERS: FilterChip[] = [
  { id: "all",        label: "ALL",        color: "#00E5FF" },
  { id: "crit",       label: "CRITICAL",   color: "#FF4D6D" },
  { id: "high",       label: "HIGH",       color: "#FF9F43" },
  { id: "Ransomware", label: "RANSOMWARE", color: "#FF9F43" },
  { id: "Phishing",   label: "PHISHING",   color: "#FFD93D" },
  { id: "Malware",    label: "MALWARE",    color: "#00FFC8" },
  { id: "Exploit",    label: "EXPLOIT",    color: "#FF4D6D" },
  { id: "DDoS",       label: "DDoS",       color: "#00E5FF" },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ThreatFeedProps {
  threats: Threat[];
  isLoading?: boolean;
  error?: string | null;
  onThreatSelect: (threat: Threat) => void;
  onGenerateAttack?: () => void;
  onRetry?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ThreatFeed({
  threats,
  isLoading = false,
  error = null,
  onThreatSelect,
  onGenerateAttack,
  onRetry,
}: ThreatFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newCount, setNewCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(threats.length);
  const isInitialRef = useRef(true);

  // ── Detect newly arrived threats ──────────────────────────────────────────
  useEffect(() => {
    // Skip the initial mount
    if (isInitialRef.current) {
      isInitialRef.current = false;
      prevLengthRef.current = threats.length;
      return;
    }
    const diff = threats.length - prevLengthRef.current;
    if (diff > 0) {
      setNewCount((c) => c + diff);
      setShowToast(true);
    }
    prevLengthRef.current = threats.length;
  }, [threats.length]);

  // ── Dismiss toast after 5 s ───────────────────────────────────────────────
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  const handleToastClick = useCallback(() => {
    setShowToast(false);
    setNewCount(0);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Derived views (never duplicate state) ─────────────────────────────────
  const pinnedThreats = useMemo(
    () =>
      threats.filter(
        (t) => t.severity === "crit" && t.status === "Active"
      ),
    [threats]
  );

  const pinnedIds = useMemo(
    () => new Set(pinnedThreats.map((t) => t.id)),
    [pinnedThreats]
  );

  const filteredThreats = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return threats
      .filter((t) => {
        // ── severity filter
        if (activeFilter === "crit") return t.severity === "crit";
        if (activeFilter === "high") return t.severity === "high";
        // ── category filter
        if (
          activeFilter === "Ransomware" ||
          activeFilter === "Phishing" ||
          activeFilter === "Malware" ||
          activeFilter === "Exploit" ||
          activeFilter === "DDoS"
        )
          return t.category === activeFilter;
        return true; // "all"
      })
      .filter((t) => {
        if (!q) return true;
        return (
          t.category.toLowerCase().includes(q) ||
          t.targetCountry.toLowerCase().includes(q) ||
          t.sourceCountry.toLowerCase().includes(q) ||
          (t.targetIndustry?.toLowerCase().includes(q) ?? false) ||
          (t.attackerActor?.toLowerCase().includes(q) ?? false) ||
          (t.summary?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [threats, activeFilter, searchQuery]);

  // Pinned threats are separated from the regular feed
  const regularThreats = useMemo(
    () => filteredThreats.filter((t) => !pinnedIds.has(t.id)),
    [filteredThreats, pinnedIds]
  );

  const filteredPinned = useMemo(
    () => filteredThreats.filter((t) => pinnedIds.has(t.id)),
    [filteredThreats, pinnedIds]
  );

  // ── Empty search result ───────────────────────────────────────────────────
  const isSearchEmpty =
    !isLoading && !error && filteredThreats.length === 0 && threats.length > 0;

  // ── Zero threats at all ───────────────────────────────────────────────────
  const isFeedEmpty =
    !isLoading && !error && threats.length === 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-white">Live Threat Feed</h2>
          <p className="mt-0.5 text-[10px] font-mono text-white/35 uppercase tracking-widest">
            {isLoading
              ? "Syncing..."
              : error
              ? "Feed offline"
              : `${threats.filter((t) => t.status === "Active").length} active · ${threats.length} total`}
          </p>
        </div>

        {/* Stream status indicator */}
        <div className="flex items-center gap-2">
          {onGenerateAttack && (
            <button
              onClick={onGenerateAttack}
              className="flex items-center gap-1.5 rounded-lg border border-[#FF4D6D]/30 bg-[#FF4D6D]/10
                px-2.5 py-1.5 text-[10px] font-mono text-[#FF4D6D] transition-all
                hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D]/60 cursor-pointer
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4D6D]"
              aria-label="Generate a critical attack event for the demo"
            >
              <Zap className="h-3 w-3" aria-hidden="true" />
              Generate Attack
            </button>
          )}
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#00FFC8] uppercase tracking-widest">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                error ? "bg-[#FF4D6D]" : isLoading ? "bg-[#FFD93D] animate-pulse" : "bg-[#00FFC8] animate-pulse"
              }`}
            />
            {error ? "OFFLINE" : isLoading ? "SYNCING" : "LIVE"}
          </span>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 py-3">
        <label htmlFor="threat-search" className="sr-only">
          Search threats
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <input
            id="threat-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country, category, actor, industry…"
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-4
              text-xs text-white/80 placeholder-white/25 outline-none transition-all
              focus:border-[#00E5FF]/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00E5FF]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter chips ──────────────────────────────────────────────────── */}
      <div
        className="flex gap-1.5 overflow-x-auto border-b border-white/5 px-4 py-2.5 cyber-scroll"
        role="group"
        aria-label="Filter threats by type"
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              aria-pressed={isActive}
              className="flex-shrink-0 rounded-full px-3 py-1 text-[9px] font-mono uppercase tracking-widest
                transition-all duration-200 border cursor-pointer
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1
                focus-visible:ring-offset-transparent"
              style={
                isActive
                  ? {
                      color: f.color,
                      background: `${f.color}18`,
                      borderColor: `${f.color}60`,
                      boxShadow: `0 0 10px ${f.color}22`,
                      "--tw-ring-color": f.color,
                    } as React.CSSProperties
                  : {
                      color: "rgba(255,255,255,0.35)",
                      background: "transparent",
                      borderColor: "rgba(255,255,255,0.07)",
                      "--tw-ring-color": f.color,
                    } as React.CSSProperties
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div
        ref={listRef}
        className="relative flex-1 overflow-y-auto cyber-scroll"
      >
        {/* "New threats" toast ─────────────────────────────────────────── */}
        {showToast && (
          <div className="sticky top-3 z-20 mx-4 flex justify-center">
            <button
              onClick={handleToastClick}
              className="animate-toast-enter flex items-center gap-2 rounded-full border border-[#FF4D6D]/40
                bg-[#FF4D6D]/15 px-4 py-2 text-[11px] font-semibold text-[#FF4D6D] backdrop-blur-xl
                shadow-lg hover:bg-[#FF4D6D]/25 transition-all cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
              aria-live="polite"
              aria-label={`${newCount} new threat${newCount > 1 ? "s" : ""} available — click to view`}
            >
              <Bell className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
              {newCount} new threat{newCount > 1 ? "s" : ""} detected — scroll to latest
            </button>
          </div>
        )}

        {/* ── Loading state ──────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#00E5FF]" />
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
              Pulling threat intelligence…
            </p>
          </div>
        )}

        {/* ── Error state ────────────────────────────────────────────────── */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FF4D6D]/25 bg-[#FF4D6D]/10 text-[#FF4D6D]">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                Feed Disconnected
              </p>
              <p className="mt-1 text-[10px] font-mono text-white/40 max-w-xs">{error}</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04]
                  px-3 py-1.5 text-[10px] font-mono text-[#00FFC8] transition-all
                  hover:bg-white/[0.08] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FFC8]"
              >
                <RefreshCw className="h-3 w-3" />
                Retry Connection
              </button>
            )}
          </div>
        )}

        {/* ── Global empty state (0 threats) ────────────────────────────── */}
        {isFeedEmpty && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00FFC8]/20 bg-[#00FFC8]/10 text-[#00FFC8]">
              <ShieldCheck className="h-5 w-5 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#00FFC8] font-mono uppercase tracking-wider">
                No Active Incidents
              </p>
              <p className="mt-1 text-[10px] font-mono text-white/35 max-w-xs">
                AI continues monitoring global intelligence feeds across 194 countries…
              </p>
            </div>
          </div>
        )}

        {/* ── Search empty state ─────────────────────────────────────────── */}
        {isSearchEmpty && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Search className="h-7 w-7 text-white/20" aria-hidden="true" />
            <p className="text-xs text-white/40">
              No threats match{" "}
              <span className="font-mono text-white/60">"{searchQuery}"</span>
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
              className="mt-1 text-[10px] font-mono text-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors cursor-pointer underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Threat list ────────────────────────────────────────────────── */}
        {!isLoading && !error && filteredThreats.length > 0 && (
          <div className="flex flex-col gap-0 p-4">

            {/* Pinned critical alerts */}
            {filteredPinned.length > 0 && (
              <div className="mb-4">
                <div
                  className="mb-2.5 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#FF4D6D]/70"
                  aria-label="Pinned critical alerts"
                >
                  <Pin className="h-3 w-3" aria-hidden="true" />
                  Pinned Critical
                </div>
                <div className="flex flex-col gap-3">
                  {filteredPinned.map((threat, i) => (
                    <ThreatCard
                      key={threat.id}
                      threat={threat}
                      index={i}
                      onClick={onThreatSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular feed */}
            {regularThreats.length > 0 && (
              <div>
                {filteredPinned.length > 0 && (
                  <div
                    className="mb-2.5 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-white/30"
                    aria-label="Regular threat feed"
                  >
                    <span className="h-px flex-1 bg-white/5" />
                    Feed
                    <span className="h-px flex-1 bg-white/5" />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {regularThreats.map((threat, i) => (
                    <ThreatCard
                      key={threat.id}
                      threat={threat}
                      index={filteredPinned.length + i}
                      onClick={onThreatSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Feed footer ───────────────────────────────────────────────────── */}
      {!isLoading && !error && threats.length > 0 && (
        <div className="border-t border-white/5 px-5 py-2.5 flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">
            asi-feed · relay-v3.9
          </span>
          <span className="text-[9px] font-mono text-white/25">
            {filteredThreats.length}/{threats.length} shown
          </span>
        </div>
      )}
    </div>
  );
}
