import React from "react";
import { Threat } from "./useThreatFeed";
import { X, ShieldAlert, Sparkles, Server, Clock, MapPin, Building } from "lucide-react";

interface ThreatPopupProps {
  threat: Threat;
  onClose: () => void;
}

const sevColor: Record<string, string> = {
  crit: "#FF4D6D",
  high: "#FF9F43",
  med: "#00E5FF",
  low: "#00FFC8",
};

const generateAIAnalysis = (threat: Threat) => {
  const { targetCountry, targetIndustry, category, severity, sourceCountry, attackerActor } = threat;
  
  const intensity = severity === "crit" 
    ? "critical surge of 48%" 
    : severity === "high" 
      ? "high-volume increase of 34%" 
      : "moderate anomaly spike of 18%";
  
  const actorMention = attackerActor ? ` attributed to advanced persistence group ${attackerActor}` : "";
  const sourceMention = ` originating from vectors in ${sourceCountry}`;
  
  const actions: Record<string, string> = {
    Ransomware: "Immediate isolation of exposed SMB host networks, deployment of network-wide zero-trust segmentation, and verification of air-gapped backups.",
    DDoS: "Rerouting ingress edge streams to mitigation scrubbers, activation of burst rate-limits on external gateways, and monitoring upstream interfaces.",
    Phishing: "Quarantining inbound MX gateways, forcing global session resets for exposed users, and enabling strict DNS SPF/DKIM verification policies.",
    Malware: "Triggering automated endpoint host quarantine, blocking outbound communication to known malicious IP nodes, and running payload scans.",
    Exploit: "Swift deployment of patch updates, isolating vulnerable ports in the DMZ segment, and conducting threat-hunting for lateral movement."
  };

  const actionText = actions[category] || "Conducting comprehensive log reviews and executing automated asset quarantine playbooks.";

  return `${targetIndustry || "Infrastructure"} organizations in ${targetCountry} have experienced a ${intensity} in ${category} events over the last 6 hours${sourceMention}${actorMention}. Recommendations: ${actionText}`;
};

export const ThreatPopup: React.FC<ThreatPopupProps> = ({ threat, onClose }) => {
  const {
    sourceCountry,
    sourceCity,
    targetCountry,
    targetCity,
    category,
    severity,
    time,
    targetIndustry,
    attackerActor,
    status
  } = threat;

  const color = sevColor[severity];
  const severityScore = { crit: "9.8 CRIT", high: "7.8 HIGH", med: "5.4 MED", low: "2.1 LOW" }[severity];
  const aiParagraph = generateAIAnalysis(threat);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-4 md:top-4 md:bottom-4 md:left-auto md:w-80 glass-card p-5 border border-white/10 shadow-2xl flex flex-col justify-between z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-right-8 duration-200 max-h-[85%] md:max-h-none overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" style={{ color }} />
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">Intelligence File</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close threat details"
            className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-md cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Threat Title */}
        <div className="mt-4">
          <span
            className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
            style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}
          >
            {category}
          </span>
          <h4 className="text-sm md:text-base font-bold text-white mt-2">
            {category} Activity in {targetCountry}
          </h4>
        </div>

        {/* Details Grid */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-3 text-[11px] md:text-xs">
            <Clock className="h-3.5 w-3.5 text-white/40" />
            <div className="flex-1 text-white/60">Observed Time</div>
            <div className="font-mono text-white/80">{time} UTC</div>
          </div>

          <div className="flex items-start gap-3 text-[11px] md:text-xs">
            <MapPin className="h-3.5 w-3.5 text-white/40 mt-0.5" />
            <div className="flex-1 text-white/60">Source Vector</div>
            <div className="text-right text-white/80">
              {sourceCity}, {sourceCountry}
            </div>
          </div>

          <div className="flex items-start gap-3 text-[11px] md:text-xs">
            <Server className="h-3.5 w-3.5 text-white/40 mt-0.5" />
            <div className="flex-1 text-white/60">Target Asset</div>
            <div className="text-right text-white/80">
              {targetCity}, {targetCountry}
            </div>
          </div>

          {targetIndustry && (
            <div className="flex items-center gap-3 text-[11px] md:text-xs">
              <Building className="h-3.5 w-3.5 text-white/40" />
              <div className="flex-1 text-white/60">Affected Sector</div>
              <div className="text-white/80 text-right">{targetIndustry}</div>
            </div>
          )}

          {attackerActor && (
            <div className="flex items-center gap-3 text-[11px] md:text-xs border-t border-white/5 pt-2">
              <div className="flex-1 text-white/40 font-mono text-[9px] uppercase">Threat Actor</div>
              <div className="font-semibold text-right" style={{ color }}>
                {attackerActor}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] md:text-xs border-t border-white/5 pt-2">
            <div className="text-white/40 font-mono text-[9px] uppercase">Severity Rating</div>
            <span className="font-bold text-xs md:text-sm" style={{ color }}>
              {severityScore}
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Footer */}
      <div className="border-t border-white/5 pt-3 mt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00FFC8]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Copilot Analysis</span>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-white/70 bg-[#00FFC8]/5 border border-[#00FFC8]/10 rounded-xl p-2.5">
          {aiParagraph}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[8px] font-mono text-white/30">
          <span>STATUS</span>
          <span className="font-semibold" style={{ color: status === "Active" ? "#FF4D6D" : "#00FFC8" }}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
