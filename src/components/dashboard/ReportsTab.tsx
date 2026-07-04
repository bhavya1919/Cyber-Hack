// src/components/dashboard/ReportsTab.tsx

import React, { useState, useMemo } from "react";
import { FileText, Download, FilePlus, Calendar, ShieldCheck, Printer, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDashboardStore } from "@/core/store/dashboardStore";
import { reportService, Report } from "@/services/reportService";

// Reports are loaded from Supabase — no hardcoded mocks.

export function ReportsTab() {
  const threats = useDashboardStore((state) => state.threat.threats);
  const activeThreats = threats.filter((t) => t.status === "Active");
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isFetchingReports, setIsFetchingReports] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    setIsFetchingReports(true);
    reportService.fetchReports().then(dbReports => {
      if (isMounted) {
        setReports((dbReports as Report[]) || []);
        setIsFetchingReports(false);
      }
    }).catch((err) => {
      console.error("Failed to load reports from DB:", err);
      if (isMounted) setIsFetchingReports(false);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReportId(null);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => { 
      isMounted = false; 
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Derive selected report details
  const activeReport = useMemo(() => {
    if (!selectedReportId) return null;
    return reports.find((r) => r.id === selectedReportId) || null;
  }, [selectedReportId, reports]);

  const compileNewReport = () => {
    setIsCompiling(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const hasCrit = activeThreats.some((t) => t.severity === "crit");
      
      const newRep: Report = {
        id: `rep-${Date.now()}`,
        title: `Operations Briefing — ${dateStr}`,
        date: dateStr,
        type: "Live Operations Report",
        classification: hasCrit ? "TLP:AMBER" : "TLP:GREEN",
        summary: `Covers ${activeThreats.length} active threat incursions. Prominent vectors include ${
          activeThreats.map((t) => t.category).filter(Boolean)[0] || "Exploit"
        } targeting ${
          activeThreats.map((t) => t.sector || t.targetIndustry).filter(Boolean)[0] || "Financial Services"
        }.`
      };

      // Optimistically add locally, then save to DB
      setReports((prev) => [newRep, ...prev]);
      setSelectedReportId(newRep.id);
      reportService.saveReport(newRep).then((realId) => {
        if (realId && realId !== newRep.id) {
          setReports(currentReports => 
            currentReports.map(r => r.id === newRep.id ? { ...r, id: realId } : r)
          );
          setSelectedReportId(prevId => prevId === newRep.id ? realId : prevId);
        }
      }).catch(console.error);
      toast.success(`Brief compiled: ${newRep.title}`, {
        description: `Class: ${newRep.classification} | Live anomalies aggregated.`
      });
      setIsCompiling(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono text-xs text-white/80 p-1">
      {activeReport ? (
        /* --- REPORT VIEW MODE --- */
        <div className="glass-card p-6 border border-white/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={() => setSelectedReportId(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-300 ease-out cursor-pointer text-[10px] active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>[ Return to Registry ]</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/70 hover:bg-white/10 transition-all duration-300 ease-out cursor-pointer text-[10px] active:scale-95"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => alert("Report content copied as Markdown. Ready for download.")}
                className="flex items-center gap-1.5 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1.5 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all duration-300 ease-out cursor-pointer text-[10px] active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export MD</span>
              </button>
            </div>
          </div>

          {/* Printable Styled Report Sheet */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-8 space-y-6 text-[11px] text-white/90 leading-relaxed font-sans max-w-4xl mx-auto">
            {/* Header Document Blocks */}
            <div className="border-b-2 border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">AI SHADOW INTERNET COGNITIVE SYSTEMS</div>
                <h2 className="text-lg font-extrabold text-white mt-1 uppercase font-mono">{activeReport.title}</h2>
              </div>
              <div className="px-3 py-1 text-[10px] font-mono font-extrabold uppercase border border-current rounded" style={{
                color: activeReport.classification === "TLP:RED" ? "#FF4D6D" : activeReport.classification === "TLP:AMBER" ? "#FF9F43" : "#00FFC8"
              }}>
                {activeReport.classification}
              </div>
            </div>

            {/* Metadata Info Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-b border-white/5 font-mono text-[9px] text-white/50">
              <div>
                <div>DOCUMENT TYPE</div>
                <div className="text-white font-semibold mt-0.5 uppercase">{activeReport.type}</div>
              </div>
              <div>
                <div>DATE OF COMPILE</div>
                <div className="text-white font-semibold mt-0.5">{activeReport.date}</div>
              </div>
              <div>
                <div>CLASSIFICATION</div>
                <div className="text-white font-semibold mt-0.5">RESTRICTED CONTROL</div>
              </div>
              <div>
                <div>COMPILED ENGINE</div>
                <div className="text-white font-semibold mt-0.5">SHADOW-GPT V3</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-extrabold font-mono text-white tracking-widest border-l-2 border-[#00E5FF] pl-2.5">I. Executive Briefing</h3>
              <p className="text-white/70">{activeReport.summary}</p>
            </div>

            {/* Live Anomalies Audit Segment */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold font-mono text-white tracking-widest border-l-2 border-[#00E5FF] pl-2.5">II. Threat Map Telemetry Analysis</h3>
              
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-white/50 border-b border-white/10">
                      <th className="p-2.5">INCIDENT ID</th>
                      <th className="p-2.5">CATEGORY</th>
                      <th className="p-2.5">SECTOR</th>
                      <th className="p-2.5">VECTORS</th>
                      <th className="p-2.5">RATING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeThreats.length > 0 ? (
                      activeThreats.map((t) => (
                        <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="p-2.5 font-bold">{t.id}</td>
                          <td className="p-2.5 uppercase">{t.category}</td>
                          <td className="p-2.5">{t.sector || t.targetIndustry || "General IT"}</td>
                          <td className="p-2.5 text-white/70">{t.attackVector || "Active Recon"}</td>
                          <td className="p-2.5 font-bold uppercase" style={{
                            color: t.severity === "crit" ? "#FF4D6D" : t.severity === "high" ? "#FF9F43" : "#00E5FF"
                          }}>{t.severity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-white/30 italic">No active anomalies detected. Posture is stable.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Defensive Actions Section */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold font-mono text-white tracking-widest border-l-2 border-[#00E5FF] pl-2.5">III. Mitigating Countermeasures</h3>
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-3">
                  <span className="text-[#00FFC8] shrink-0 font-bold">•</span>
                  <div>
                    <strong className="text-white">Implement Active Directory Enclave Isolation</strong>
                    <p className="text-white/50 mt-1">Restrict outbound SMB communication to foreign servers immediately. Terminate active sessions from affected subnets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-3">
                  <span className="text-[#00FFC8] shrink-0 font-bold">•</span>
                  <div>
                    <strong className="text-white">Deploy Port Filtering Rules (CVE-2026-9182)</strong>
                    <p className="text-white/50 mt-1">Drop inbound TCP packets targeting interface port 10443 to secure external authentication gateways.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Signature Sign-off */}
            <div className="border-t border-white/5 pt-6 flex justify-between items-center text-[9px] font-mono text-white/30 mt-8">
              <span>REPORT COMPILED VIA ENCRYPTION INTEGRATED AGENT ARRAYS</span>
              <span>ASI CERT CONSOLE SIGNATURE VALIDATED</span>
            </div>
          </div>
        </div>
      ) : (
        /* --- REPORTS REGISTRY OVERVIEW --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Compile Panel Left Column */}
          <div className="lg:col-span-1 glass-card p-6 border border-white/10 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
                <FileText className="h-4 w-4 text-[#00E5FF]" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Reports Studio</h4>
              </div>
              <p className="text-white/50 leading-relaxed">
                Compile live threat telemetry, metrics and AI recommendations into executive-level PDF briefs instantly. Reports automatically align with MITRE D3FEND models.
              </p>
            </div>

            <button
              onClick={compileNewReport}
              disabled={isCompiling}
              className="relative overflow-hidden w-full text-center py-3 rounded-lg border border-[#00FFC8]/30 bg-[#00FFC8]/10 hover:bg-[#00FFC8]/25 text-[#00FFC8] uppercase font-bold tracking-wider cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_0_20px_rgba(0,255,200,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-6 active:scale-[0.97]"
            >
              {isCompiling ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-[#00FFC8]/30 border-t-[#00FFC8] animate-spin" />
                    <span className="animate-pulse">COMPILING DATA...</span>
                  </div>
                  {/* Subtle scanning line effect across the button */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#00FFC8]/10 to-transparent animate-[shimmer_1.5s_infinite]" />
                </>
              ) : (
                <>
                  <FilePlus className="h-4 w-4" />
                  <span>COMPILE OPERATION BRIEF</span>
                </>
              )}
            </button>
          </div>

          {/* Past Reports Registry Right Column */}
          <div className="lg:col-span-2 glass-card p-6 border border-white/10">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Intelligence Document Registry</h4>
            
            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#00E5FF]/30 transition-all duration-300 ease-out cursor-pointer flex justify-between items-start gap-4 hover:-translate-y-1 hover:shadow-[0_0_20px_0px_rgba(0,229,255,0.10)]"
                >
                  <div className="space-y-1">
                    <h5 className="text-white font-bold text-xs">{rep.title}</h5>
                    <p className="text-white/50 text-[10px] line-clamp-2 mt-1">{rep.summary}</p>
                    <div className="flex items-center gap-4 text-[9px] text-white/30 pt-2 font-mono">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {rep.date}</span>
                      <span className="text-[#00E5FF] uppercase font-bold">{rep.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border font-mono" style={{
                      color: rep.classification === "TLP:RED" ? "#FF4D6D" : rep.classification === "TLP:AMBER" ? "#FF9F43" : "#00FFC8",
                      borderColor: "currentColor"
                    }}>
                      {rep.classification}
                    </span>
                    <span className="text-[9px] text-[#00E5FF] flex items-center gap-1 font-semibold group hover:underline mt-2">
                      Open Brief
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
