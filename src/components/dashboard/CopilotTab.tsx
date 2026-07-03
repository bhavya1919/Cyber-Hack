// src/components/dashboard/CopilotTab.tsx

import React, { useState, useRef, useEffect } from "react";
import { Send, Terminal, Sparkles, AlertTriangle, ShieldCheck, CornerDownLeft, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/core/store/dashboardStore";

interface Message {
  id: string;
  sender: "analyst" | "copilot";
  text: string;
  timestamp: string;
  isCode?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    sender: "copilot",
    text: "Shadow-GPT v3 is online. I have analyzed active threat clusters on the operations map. Recommend auditing external SCADA ports and outbound SMB interfaces.\n\nAsk me any tactical threat intelligence queries or click a prompt below to automate playbooks.",
    timestamp: "09:00:00",
  },
];

const SUGGESTED_PROMPTS = [
  "Draft mitigation playbook for CVE-2026-9182 Exploit",
  "Summarize LockBit Ransomware campaign patterns",
  "Attribute PandaKit threat group capabilities & infrastructure",
  "Recommend actions for outbound SMB exfiltration signals",
];

const COPILOT_REPLIES: Record<string, string> = {
  "Draft mitigation playbook for CVE-2026-9182 Exploit": `### SECURE ENCLAVE PLAYBOOK // CVE-2026-9182 MITIGATION

**Threat Vector**: Memory corruption in VPN gateway allowing remote code execution (RCE).
**Affected Assets**: Edge Ingress Gateway, Ingress Router Interfaces.

#### Recommended Actions:
1. **Immediate Port Containment**: Close external ingress port TCP/10443 on edge gateway firewalls.
2. **Session Revocation**: Force global credential and session resets on identity providers (Okta/Active Directory) for all admin roles.
3. **Deploy Detection Rule (ASI-DR-9182)**:
\`\`\`yaml
alert tcp external_net any -> internal_net 10443 (
  msg:"ASI-MALWARE-EXPLOIT CVE-2026-9182 Heap Buffer Overflow Attempt";
  flow:established,to_server;
  content:"|56 50 4e 5f 48 45 41 44 45 52|";
  fast_pattern;
  reference:cve,2026-9182;
  classtype:attempted-admin;
  sid:2026001;
  rev:1;
)
\`\`\`
4. **Isolate Compromised Segments**: Route all traffic from affected gateway subnets into secondary sandbox zones.`,

  "Summarize LockBit Ransomware campaign patterns": `### THREAT BRIEFING // LOCKBIT RANSOMWARE CAMPAIGN SUMMARY

**Attribution**: Advanced Persistence Actor (Russian Federation affinity / BlackShadow).
**Sectors Targeted**: Healthcare (Hospital networks), Energy Grid, Critical Utilities.

#### Attack Tradecraft (TTPs):
* **Initial Access**: Spear-phishing with malicious attachments containing payload droppers, or exploiting exposed SCADA ports.
* **Execution**: Double-extortion model where files are exfiltrated prior to local network encryption (volume shadow copy deletion).
* **Lateral Movement**: Heavy utilization of compromised SMB ports and Active Directory credential dumps.

#### Tactical Mitigations:
* **Increase Email Gateway Filtering**: Quarantining docx/xlsx attachments with active macros.
* **Block Outbound SMB Traffic**: Strictly deny external port tcp/445 traffic.
* **Verify Cold Backups**: Ensure daily configurations and databases are air-gapped.`,

  "Attribute PandaKit threat group capabilities & infrastructure": `### ACTOR PROFILE // PANDAKIT (APT-44)

**Country of Origin**: China (State-affiliated espionage).
**Target Verticals**: Defense contractors, Financial Institutions, Aerospace Engineering.

#### Operational Capabilities:
* **Custom Tooling**: PandaKit utilizes the specialized *PandaShell* payload gateway, featuring multi-layer encryption and dynamic command & control (C2) endpoint shifts.
* **Bypass Techniques**: Frequently integrates MFA-bypass session token stealers and browser cookie extraction scripts.
* **Infrastructure**: Primarily routes commands through commercial botnets and hijacked IoT nodes in South America and Western Europe.

#### Current Campaign Signals:
Monitoring active target coordinates pointing to US and Japanese defence suppliers. Immediate perimeter audits recommended.`,

  "Recommend actions for outbound SMB exfiltration signals": `### SOC ALERT TRACE // OUTBOUND SMB EXFILTRATION RESPONSE

**Vector Anomaly**: High volume outbound communication observed over Port tcp/445 to external unclassified IP nodes.
**Threat Level**: CRITICAL (Exfiltration in progress).

#### Tactical Immediate Actions:
1. **Firewall Drop Rule**: Inject immediate deny rules on outbound perimeter firewalls blocking tcp/445 to external destinations.
2. **Endpoint Quarantine**: Trigger automated isolation for the originating host endpoint:
\`\`\`powershell
# Automated host quarantine command
Set-NetConnectionProfile -InterfaceAlias "Corp-NIC" -NetworkCategory Public
Remove-NetRoute -NextHop "10.0.0.1" -Confirm:$false
\`\`\`
3. **Credential Revocation**: Terminate active Kerberos and NTLM sessions for accounts originating from the quarantined host.
4. **Event Triage**: Audit local security logs on domain controllers for active directories enumeration patterns.`,
};

export function CopilotTab() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Background agent thinking logs sidebar
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "AGENT STARTUP... OK",
    "SUB-SYSTEM DECK CONNECTED... OK",
  ]);

  const addAgentLog = (log: string) => {
    setAgentLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add Analyst message
    const now = new Date();
    const analystMsg: Message = {
      id: `m-analyst-${Date.now()}`,
      sender: "analyst",
      text,
      timestamp: now.toTimeString().split(" ")[0],
    };

    setMessages((prev) => [...prev, analystMsg]);
    setInputVal("");
    setIsTyping(true);

    addAgentLog(`QUERY SUBMITTED: "${text.substring(0, 20)}..."`);
    addAgentLog("QUERYING ADVERSARY THREAT DATA ARRAYS...");

    // Simulate AI thinking and reply
    setTimeout(() => {
      let replyText = "";
      
      // Match predefined query, or fallback
      const matchingPrompt = Object.keys(COPILOT_REPLIES).find(
        (key) => key.toLowerCase() === text.trim().toLowerCase()
      );

      if (matchingPrompt) {
        replyText = COPILOT_REPLIES[matchingPrompt];
        addAgentLog("CORRESPONDING PATTERN RECOGNIZED IN ARCHIVES.");
      } else {
        replyText = `### Tactical AI Intelligence Briefing

I have processed your query: **"${text}"**. 

Based on active telemetry vectors:
* **Analysis**: Outbound breaches exhibit patterns associated with standard exfiltration channels.
* **Postures Affected**: Endpoint registry and active directory boundaries.
* **Recommendations**:
  1. Audit outgoing tcp interfaces on local subnet domains.
  2. Implement micro-segmentation playbook **PB-012**.
  3. Deploy local antivirus scanners on affected hosts.

*Security-native Shadow-GPT will audit this threat vector continuously.*`;
        addAgentLog("GENERATIVE REASONING COMPILED SUCCESSFULLY.");
      }

      const copilotMsg: Message = {
        id: `m-copilot-${Date.now()}`,
        sender: "copilot",
        text: replyText,
        timestamp: new Date().toTimeString().split(" ")[0],
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsTyping(false);
      addAgentLog("RESPONSE RENDERED.");
    }, 1200);
  };

  const handleSuggestedClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[560px] font-mono text-xs text-white/80 p-1">
      
      {/* Sidebar Agent Console Logs */}
      <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/55 p-4 flex flex-col justify-between h-full hidden lg:flex">
        <div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3 text-white/40">
            <Terminal className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Agent Reasoning Deck</span>
          </div>
          <div className="space-y-1.5 font-mono text-[9px] text-[#00E5FF]/70 leading-relaxed max-h-[420px] overflow-y-auto pr-1 cyber-scroll">
            {agentLogs.map((log, idx) => (
              <div key={idx} className="border-b border-white/[0.02] py-1 select-none">
                {log}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[8px] text-white/20 select-none border-t border-white/5 pt-2 text-right">
          ASI-COPILOT LAYER V3.9.1
        </div>
      </div>

      {/* Main Terminal Chat Panel */}
      <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-black/35 flex flex-col justify-between h-full overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-black/30 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00FFC8] animate-pulse" />
            <span className="text-[11px] font-extrabold text-white tracking-wider uppercase">
              AI Security Copilot Console
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[8px] text-[#00FFC8] tracking-wider font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FFC8] animate-ping" />
            REASONING INFRASTRUCTURE ONLINE
          </span>
        </div>

        {/* Message History Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-scroll">
          {messages.map((m) => {
            const isCopilot = m.sender === "copilot";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  isCopilot ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Sender Icon */}
                <div
                  className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${
                    isCopilot
                      ? "bg-[#00FFC8]/10 border-[#00FFC8]/25 text-[#00FFC8]"
                      : "bg-[#00E5FF]/10 border-[#00E5FF]/25 text-[#00E5FF]"
                  }`}
                >
                  {isCopilot ? <Sparkles className="h-3.5 w-3.5" /> : <Terminal className="h-3.5 w-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 leading-relaxed text-[11px] border ${
                    isCopilot
                      ? "bg-white/[0.02] border-white/5 text-white/90"
                      : "bg-[#00E5FF]/5 border-[#00E5FF]/20 text-[#00E5FF]"
                  }`}
                >
                  {/* Handle block formatted replies cleanly */}
                  {isCopilot ? (
                    <div className="space-y-2 whitespace-pre-wrap select-text markdown-styling">
                      {m.text.split("```").map((chunk, index) => {
                        if (index % 2 === 1) {
                          // Code block formatting
                          const lines = chunk.trim().split("\n");
                          const lang = lines[0];
                          const code = lines.slice(1).join("\n");
                          return (
                            <pre
                              key={index}
                              className="bg-black/80 border border-white/10 rounded-xl p-3 text-[10px] text-[#00FFC8] overflow-x-auto max-w-full font-mono mt-2"
                            >
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return chunk;
                      })}
                    </div>
                  ) : (
                    <div className="select-text whitespace-pre-wrap">{m.text}</div>
                  )}
                  
                  <div className={`text-[8px] mt-2.5 text-right ${
                    isCopilot ? "text-white/20" : "text-[#00E5FF]/40"
                  }`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 max-w-[85%] mr-auto"
              >
                <div className="h-7 w-7 rounded-lg border bg-[#00FFC8]/10 border-[#00FFC8]/25 text-[#00FFC8] flex items-center justify-center shrink-0 animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[10px] text-white/40 flex items-center gap-2 font-mono">
                  <span>COPILOT ANALYSIS IN PROGRESS</span>
                  <span className="flex gap-1 animate-pulse">
                    <span className="h-1 w-1 bg-white/40 rounded-full" />
                    <span className="h-1 w-1 bg-white/40 rounded-full" />
                    <span className="h-1 w-1 bg-white/40 rounded-full" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Grid */}
        <div className="p-3 border-t border-white/5 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestedClick(prompt)}
              className="text-left px-3 py-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-[#00FFC8]/30 transition-all text-[10px] font-mono text-white/60 hover:text-white shrink-0 cursor-pointer flex items-center justify-between group"
            >
              <span>{prompt}</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FFC8]" />
            </button>
          ))}
        </div>

        {/* Input Form Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex border-t border-white/5 px-4 py-3 bg-black/40 shrink-0 relative items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type tactical security query or attribute custom campaign..."
            className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-4 pr-12
              text-xs text-white placeholder-white/20 outline-none transition-all
              focus:border-[#00FFC8]/40 focus:bg-white/[0.04] focus:ring-1 focus:ring-[#00FFC8]/20"
          />
          <button
            type="submit"
            className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#6C63FF] flex items-center justify-center text-black font-bold cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all hover:shadow-[0_0_10px_rgba(0,229,255,0.4)]"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
