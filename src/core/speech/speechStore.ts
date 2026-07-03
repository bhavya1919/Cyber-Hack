// src/core/speech/speechStore.ts
// Zustand store — bridges React UI with the singleton engine.
// Exposes the `speak()` action as the single entry point for all callers.

import { create } from "zustand";
import type { SpeechState, SpeechItem, SpeechEventType } from "./speechTypes";
import {
  enqueueSpeech,
  setEngineMuted,
  setSpeechEngineCallback,
  isSpeechSupported,
  cancelSpeech,
} from "./speechEngine";
import { resolveScript, ScriptContext } from "./speechScripts";

// ─── Extended store interface ──────────────────────────────────

interface SpeechStore extends SpeechState {
  /** Main entry point — builds the script, enqueues it */
  speak: (ctx: ScriptContext) => void;
  /** Mute / unmute toggle */
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  /** Cancel and clear queue */
  stop: () => void;
  /** Internal: engine calls this to push updates back into React */
  _engineUpdate: (update: Partial<SpeechState>) => void;
}

// ─── Store ────────────────────────────────────────────────────

export const useSpeechStore = create<SpeechStore>((set, get) => {
  const store: SpeechStore = {
    isMuted: false,
    isSupported: isSpeechSupported(),
    isSpeaking: false,
    lastSpokenText: null,
    lastEventType: null,
    queue: [],

    speak(ctx) {
      if (get().isMuted) return;
      if (!get().isSupported) return;

      const text = resolveScript(ctx);

      const priorityMap: Record<SpeechEventType, SpeechItem["priority"]> = {
        critical_threat_detected: "critical",
        risk_score_critical: "critical",
        notification_critical: "critical",
        risk_score_elevated: "high",
        scenario_launched: "high",
        presentation_start: "high",
        presentation_stop: "normal",
        boot_complete: "normal",
        threat_mitigated: "normal",
        ai_prediction_updated: "normal",
        report_generated: "low",
        copilot_response: "low",
        risk_score_normal: "low",
      };

      const item: SpeechItem = {
        id: `speech-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text,
        priority: priorityMap[ctx.eventType] ?? "normal",
        eventType: ctx.eventType,
        timestamp: Date.now(),
        rate: ctx.eventType === "critical_threat_detected" ? 0.95 : 0.90,
        pitch: ctx.eventType === "critical_threat_detected" ? 0.82 : 0.88,
      };

      set({ lastEventType: ctx.eventType });
      enqueueSpeech(item);
    },

    toggleMute() {
      const next = !get().isMuted;
      set({ isMuted: next });
      setEngineMuted(next);
    },

    setMuted(muted) {
      set({ isMuted: muted });
      setEngineMuted(muted);
    },

    stop() {
      cancelSpeech();
    },

    _engineUpdate(update) {
      set(update as Partial<SpeechStore>);
    },
  };

  // Wire engine state updates back into this store
  setSpeechEngineCallback((update) => {
    useSpeechStore.getState()._engineUpdate(update);
  });

  return store;
});

// ─── Convenience shortcut ─────────────────────────────────────
// Use this anywhere outside React: speechManager.speak({ eventType: ... })

export const speechManager = {
  speak: (ctx: ScriptContext) => useSpeechStore.getState().speak(ctx),
  stop: () => useSpeechStore.getState().stop(),
};
