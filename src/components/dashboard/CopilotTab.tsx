import React, { useState, useRef, useEffect } from "react";
import { Send, Terminal, Sparkles, Loader2, ArrowRight, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCopilotStore } from "@/core/store/copilotStore";
import { buildAIContext, generateSuggestedQuestions } from "@/core/copilot";

export function CopilotTab() {
  const {
    messages,
    reasoningLogs,
    isTyping,
    pipelineSteps,
    sendMessage,
    clearHistory,
  } = useCopilotStore();

  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute dynamic suggested prompts based on the current live context
  const context = buildAIContext();
  const suggestedPrompts = generateSuggestedQuestions(context);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputVal("");
    await sendMessage(text);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px] lg:h-[560px] lg:min-h-0 font-mono text-xs text-white/80 p-1">
      {/* Sidebar Agent Console Logs */}
      <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/55 p-4 flex flex-col justify-between h-[180px] shrink-0 lg:h-full">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-white/40">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Agent Reasoning Deck
              </span>
            </div>
            <button
              onClick={clearHistory}
              className="text-[9px] text-white/30 hover:text-[#FF4D6D] transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
              title="Clear memory and logs"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear Log</span>
            </button>
          </div>
          <div className="flex-1 space-y-1.5 font-mono text-[9px] text-[#00E5FF]/70 leading-relaxed overflow-y-auto pr-1 cyber-scroll">
            {reasoningLogs.map((log, idx) => (
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

                  <div
                    className={`text-[8px] mt-2.5 text-right ${
                      isCopilot ? "text-white/20" : "text-[#00E5FF]/40"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator & Pipeline Execution Steps */}
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
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[10px] text-white/40 flex flex-col gap-3 font-mono min-w-[240px]">
                  <div className="flex items-center gap-2 font-bold text-white/70">
                    <span>COPILOT ANALYSIS PIPELINE</span>
                    <span className="flex gap-1 animate-pulse">
                      <span className="h-1 w-1 bg-white/40 rounded-full" />
                      <span className="h-1 w-1 bg-white/40 rounded-full" />
                      <span className="h-1 w-1 bg-white/40 rounded-full" />
                    </span>
                  </div>

                  {/* Visual pipeline steps */}
                  <div className="flex flex-col gap-1.5 border-t border-white/5 pt-2 text-[9px]">
                    {pipelineSteps.map((step) => (
                      <div key={step.name} className="flex items-center gap-2">
                        <span
                          className={
                            step.status === "done"
                              ? "text-[#00FFC8]"
                              : step.status === "active"
                              ? "text-[#00E5FF] animate-pulse"
                              : "text-white/20"
                          }
                        >
                          {step.status === "done" ? "✓" : step.status === "active" ? "◉" : "○"}
                        </span>
                        <span
                          className={
                            step.status === "active"
                              ? "text-[#00E5FF] font-bold"
                              : step.status === "done"
                              ? "text-white/80"
                              : "text-white/30"
                          }
                        >
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Grid */}
        <div className="p-3 border-t border-white/5 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
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
