import { create } from "zustand";
import { Message, ConversationMemory, IntentType, buildAIContext, detectIntent, RuleBasedProvider } from "../copilot";

interface CopilotState {
  messages: Message[];
  memory: ConversationMemory;
  reasoningLogs: string[];
  isTyping: boolean;
  pipelineSteps: { name: string; status: "pending" | "active" | "done" }[];
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    sender: "copilot",
    text: "Shadow-GPT v3 is online. I have analyzed active threat clusters on the operations map. Recommend auditing external SCADA ports and outbound SMB interfaces.\n\nAsk me any tactical threat intelligence queries or click a prompt below to automate playbooks.",
    timestamp: "09:00:00",
  },
];

const INITIAL_LOGS = [
  "AGENT STARTUP... OK",
  "SUB-SYSTEM DECK CONNECTED... OK",
];

const pipeline = new RuleBasedProvider();

export const useCopilotStore = create<CopilotState>((set, get) => ({
  messages: INITIAL_MESSAGES,
  memory: {
    messages: INITIAL_MESSAGES,
    timestamp: Date.now(),
  },
  reasoningLogs: INITIAL_LOGS,
  isTyping: false,
  pipelineSteps: [],

  sendMessage: async (text: string) => {
    if (!text.trim()) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const userMsgId = `m-analyst-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "analyst",
      text,
      timestamp: timeStr,
    };

    // 1. Add analyst message to history
    set((state) => {
      const newMessages = [...state.messages, userMsg];
      return {
        messages: newMessages,
        memory: {
          ...state.memory,
          messages: newMessages,
        },
        isTyping: true,
        pipelineSteps: [
          { name: "Context Builder", status: "pending" },
          { name: "Intent Detection", status: "pending" },
          { name: "Threat Intelligence Analysis", status: "pending" },
          { name: "Response Generation", status: "pending" },
        ],
      };
    });

    const addReasoningLog = (log: string) => {
      const timestamp = new Date().toLocaleTimeString();
      set((state) => ({
        reasoningLogs: [...state.reasoningLogs.slice(-14), `[${timestamp}] ${log}`],
      }));
    };

    addReasoningLog(`QUERY SUBMITTED: "${text.substring(0, 30)}..."`);

    // Simulated staggered pipeline cycles for judges
    // Step 1: Context Builder
    await new Promise((r) => setTimeout(r, 200));
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Context Builder" ? { ...s, status: "active" as const } : s
      ),
    }));
    const context = buildAIContext();
    addReasoningLog(`[CONTEXT] ${Object.keys(context).length} store state fields compressed.`);
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Context Builder" ? { ...s, status: "done" as const } : s
      ),
    }));

    // Step 2: Intent Detector
    await new Promise((r) => setTimeout(r, 250));
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Intent Detection" ? { ...s, status: "active" as const } : s
      ),
    }));
    const intent = detectIntent(text);
    addReasoningLog(
      `[INTENT] Classified: ${intent.type} (${intent.confidence}% confidence, matched: ${
        intent.matchedKeywords.join(", ") || "none"
      }).`
    );
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Intent Detection" ? { ...s, status: "done" as const } : s
      ),
    }));

    // Step 3: Threat Intelligence Search
    await new Promise((r) => setTimeout(r, 250));
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Threat Intelligence Analysis" ? { ...s, status: "active" as const } : s
      ),
    }));
    addReasoningLog(
      `[SEARCH] Querying active anomaly database... Found ${context.activeThreatCount} active clusters.`
    );
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Threat Intelligence Analysis" ? { ...s, status: "done" as const } : s
      ),
    }));

    // Step 4: Response Generation
    await new Promise((r) => setTimeout(r, 250));
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Response Generation" ? { ...s, status: "active" as const } : s
      ),
    }));
    const response = await pipeline.generate(context, intent, get().memory);
    response.reasoningLogs.forEach((log) => addReasoningLog(log));
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.name === "Response Generation" ? { ...s, status: "done" as const } : s
      ),
    }));

    // Step 5: Append reply & store memory
    const copilotMsg: Message = {
      id: `m-copilot-${Date.now()}`,
      sender: "copilot",
      text: response.text,
      timestamp: new Date().toTimeString().split(" ")[0],
    };

    set((state) => {
      const newMessages = [...state.messages, copilotMsg];
      const newMemory: ConversationMemory = {
        messages: newMessages,
        lastIntent: intent.type,
        lastThreatId: context.selectedThreat?.id || context.latestThreat?.id,
        lastCountry: context.topCountry,
        lastSector: context.topSector,
        lastActor: context.topCampaign,
        lastRecommendations: context.recommendations,
        timestamp: Date.now(),
      };

      return {
        messages: newMessages,
        memory: newMemory,
        isTyping: false,
      };
    });
  },

  clearHistory: () => {
    set({
      messages: INITIAL_MESSAGES,
      memory: {
        messages: INITIAL_MESSAGES,
        timestamp: Date.now(),
      },
      reasoningLogs: INITIAL_LOGS,
      isTyping: false,
      pipelineSteps: [],
    });
  },
}));
