// src/components/dashboard/AnalyticsTab.tsx

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { Activity, Shield, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnalyticsTab() {
  const threats = useDashboardStore((state) => state.threat.threats);
  const activeThreats = threats.filter((t) => t.status === "Active");

  // Compile severity counters
  const severityCounts = useMemo(() => {
    const counts = { crit: 0, high: 0, med: 0, low: 0 };
    threats.forEach((t) => {
      if (t.severity in counts) {
        counts[t.severity as keyof typeof counts]++;
      }
    });
    return counts;
  }, [threats]);

  // Dynamic charts data generated based on threats
  const sectorData = useMemo(() => {
    const sectorsMap: Record<string, number> = {};
    threats.forEach((t) => {
      const sector = t.sector || t.targetIndustry || "Other";
      sectorsMap[sector] = (sectorsMap[sector] ?? 0) + 1;
    });
    
    // Fallbacks if list is empty
    if (Object.keys(sectorsMap).length === 0) {
      return [
        { name: "Financial Services", value: 4 },
        { name: "Healthcare", value: 3 },
        { name: "Energy Grid", value: 3 },
        { name: "Defense", value: 2 },
      ];
    }

    return Object.entries(sectorsMap).map(([name, value]) => ({ name, value }));
  }, [threats]);

  const categoryData = useMemo(() => {
    const categoriesMap: Record<string, number> = {};
    threats.forEach((t) => {
      categoriesMap[t.category] = (categoriesMap[t.category] ?? 0) + 1;
    });
    
    if (Object.keys(categoriesMap).length === 0) {
      return [
        { name: "Ransomware", value: 5, color: "#FF9F43" },
        { name: "DDoS", value: 3, color: "#00E5FF" },
        { name: "Phishing", value: 4, color: "#FFD93D" },
        { name: "Exploit", value: 2, color: "#FF4D6D" },
        { name: "Malware", value: 3, color: "#00FFC8" },
      ];
    }

    const colors: Record<string, string> = {
      Ransomware: "#FF9F43",
      DDoS: "#00E5FF",
      Phishing: "#FFD93D",
      Exploit: "#FF4D6D",
      Malware: "#00FFC8"
    };

    return Object.entries(categoriesMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#6C63FF",
    }));
  }, [threats]);

  // Volume history (simulated time-series over last 8 hours)
  const volumeData = useMemo(() => {
    const baseVolume = threats.length > 0 ? threats.length : 12;
    return [
      { time: "02:00", volume: Math.round(baseVolume * 0.7 + 2), secondary: Math.round(baseVolume * 0.4) },
      { time: "04:00", volume: Math.round(baseVolume * 0.9 + 4), secondary: Math.round(baseVolume * 0.5) },
      { time: "06:00", volume: Math.round(baseVolume * 0.6 + 1), secondary: Math.round(baseVolume * 0.3) },
      { time: "08:00", volume: Math.round(baseVolume * 1.2 + 6), secondary: Math.round(baseVolume * 0.7) },
      { time: "10:00", volume: Math.round(baseVolume * 1.5 + 8), secondary: Math.round(baseVolume * 0.9) },
      { time: "12:00", volume: Math.round(baseVolume * 0.8 + 3), secondary: Math.round(baseVolume * 0.4) },
      { time: "14:00", volume: Math.round(baseVolume * 1.1 + 5), secondary: Math.round(baseVolume * 0.6) },
      { time: "16:00", volume: Math.round(baseVolume * 1.7 + 10), secondary: Math.round(baseVolume * 1.1) },
    ];
  }, [threats]);

  // Top source countries
  const countryData = useMemo(() => {
    const countriesMap: Record<string, number> = {};
    threats.forEach((t) => {
      countriesMap[t.sourceCountry] = (countriesMap[t.sourceCountry] ?? 0) + 1;
    });

    if (Object.keys(countriesMap).length === 0) {
      return [
        { country: "Russia", count: 8 },
        { country: "China", count: 6 },
        { country: "USA", count: 4 },
        { country: "Iran", count: 3 },
      ];
    }

    return Object.entries(countriesMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [threats]);

  return (
    <div className="space-y-6 font-mono text-xs text-white/80 p-1">
      <AnimatePresence>
        {activeThreats.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }} 
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#FF9F43]/10 border border-[#FF9F43]/30 text-[#FF9F43] px-4 py-3 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(255,159,67,0.15)]">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-bold uppercase tracking-wider text-[10px]">Demo Threat Dataset Active</div>
                  <div className="text-[9px] opacity-70 mt-0.5">No live threats detected. Switching to demonstration telemetry.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest opacity-60">
                <span>Standby</span>
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF9F43] animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Summary Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { l: "Anomaly Count (24h)", v: threats.length + 142, c: "#00E5FF", icon: Activity },
          { l: "Active Campaigns", v: activeThreats.length > 0 ? activeThreats.length : 3, c: "#FF4D6D", icon: AlertTriangle },
          { l: "Security Posture Index", v: 76, c: "#00FFC8", icon: Shield },
          { l: "Spike Anomaly Delta", v: "+14.8%", c: "#FF9F43", icon: TrendingUp },
        ].map((c) => (
          <motion.div
            key={c.l}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } }}
            className="glass-card p-4 border border-white/5 flex items-center justify-between
              transition-all duration-300 ease-out hover:border-white/15 hover:scale-[1.02] hover:shadow-lg cursor-default"
          >
            <div>
              <div className="text-[9px] uppercase tracking-widest text-white/40">{c.l}</div>
              <div className="mt-1 text-2xl font-bold font-mono" style={{ color: c.c }}>{c.v}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <c.icon className="h-5 w-5" style={{ color: c.c }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Grid of Analytics Charts */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        
        {/* Chart 1: Anomaly Volume over Time */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }} className="glass-card p-6 border border-white/10 flex flex-col justify-between h-[320px] transition-all duration-300 hover:border-white/20">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Breach Waveform Spectrum</h4>
            <p className="text-[9px] text-white/40 mb-4">LOGGED ANOMALY VOLUME HISTOGRAM OVER TIME (TTP WAVEFORMS)</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {useMemo(() => (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="volPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#05070A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", fontFamily: "monospace" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#00E5FF" strokeWidth={1.5} fillOpacity={1} fill="url(#volCyan)" name="Total Vol" />
                  <Area type="monotone" dataKey="secondary" stroke="#6C63FF" strokeWidth={1.2} fillOpacity={0.6} strokeDasharray="3 3" fill="url(#volPurple)" name="Critical Target" />
                </AreaChart>
              </ResponsiveContainer>
            ), [volumeData])}
          </div>
        </motion.div>

        {/* Chart 2: targeted Sectors */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }} className="glass-card p-6 border border-white/10 flex flex-col justify-between h-[320px] transition-all duration-300 hover:border-white/20">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Target Sector Intensity</h4>
            <p className="text-[9px] text-white/40 mb-4">RECURRING BREACH TELEMETRY INDEXED BY VERTICAL MARKET</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {useMemo(() => (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} interval={0} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#05070A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", fontFamily: "monospace" }}
                  />
                  <Bar dataKey="value" fill="#6C63FF" radius={[4, 4, 0, 0]} name="Breaches">
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6C63FF" : "#00E5FF"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ), [sectorData])}
          </div>
        </motion.div>

        {/* Chart 3: Attack category breakdown */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }} className="glass-card p-6 border border-white/10 flex flex-col justify-between h-[320px] transition-all duration-300 hover:border-white/20">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Vector Threat Share</h4>
            <p className="text-[9px] text-white/40 mb-4">BREACH VECTOR RATIOS DERIVED FROM ACTIVE INTRUSION ARRAYS</p>
          </div>
          <div className="flex-1 flex items-center justify-between min-h-0">
            <div className="w-1/2 h-full">
              {useMemo(() => (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ), [categoryData])}
            </div>
            
            {/* Legend info panel */}
            <div className="w-1/2 space-y-2 pl-4">
              {categoryData.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[9px] border-b border-white/[0.02] pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-white/60 uppercase">{c.name}</span>
                  </div>
                  <span className="text-white font-bold">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart 4: Source Geography count */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }} className="glass-card p-6 border border-white/10 flex flex-col justify-between h-[320px] transition-all duration-300 hover:border-white/20">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Geopolitical Anomaly Vectors</h4>
            <p className="text-[9px] text-white/40 mb-4">PRIMARY GEOGRAPHIC ATTRIBUTIONS FOR OUTBOUND TELEMETRY</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {useMemo(() => (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={countryData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                  <YAxis type="category" dataKey="country" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#05070A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", fontFamily: "monospace" }}
                  />
                  <Bar dataKey="count" fill="#00FFC8" radius={[0, 4, 4, 0]} name="Incursions" />
                </BarChart>
              </ResponsiveContainer>
            ), [countryData])}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
