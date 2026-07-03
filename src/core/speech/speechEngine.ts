// src/core/speech/speechEngine.ts
// Core Web Speech API engine.
// Manages the queue, cooldown, deduplication, and utterance lifecycle.
// This is a singleton — import and call directly (no React needed).

import type { SpeechItem, SpeechPriority } from "./speechTypes";

// ─── Priority sort weight ─────────────────────────────────────
const PRIORITY_WEIGHT: Record<SpeechPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

// ─── Engine state ──────────────────────────────────────────────
let _queue: SpeechItem[] = [];
let _isSpeaking = false;
let _isMuted = false;
let _lastSpokenAt = 0;
const MIN_GAP_MS = 5_500; // minimum gap between utterances

// ─── Callbacks (wired by the store) ───────────────────────────
type StateCallback = (update: { isSpeaking?: boolean; lastSpokenText?: string | null; queue?: SpeechItem[] }) => void;
let _onStateChange: StateCallback = () => {};

export function setSpeechEngineCallback(cb: StateCallback) {
  _onStateChange = cb;
}

// ─── Mute control ─────────────────────────────────────────────
export function setEngineMuted(muted: boolean) {
  _isMuted = muted;
  if (muted) {
    window.speechSynthesis?.cancel();
    _queue = [];
    _isSpeaking = false;
    _onStateChange({ isSpeaking: false, queue: [] });
  }
}

// ─── Enqueue ──────────────────────────────────────────────────
export function enqueueSpeech(item: SpeechItem) {
  if (_isMuted) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Dedup: if same eventType already queued, skip
  const alreadyQueued = _queue.some((q) => q.eventType === item.eventType);
  if (alreadyQueued) return;

  // Limit queue depth to prevent pile-up
  if (_queue.length >= 4) {
    // Drop lowest priority item if queue full
    const lowestIdx = _queue.reduce(
      (minIdx, q, idx, arr) =>
        PRIORITY_WEIGHT[q.priority] < PRIORITY_WEIGHT[arr[minIdx].priority] ? idx : minIdx,
      0
    );
    _queue.splice(lowestIdx, 1);
  }

  _queue.push(item);
  // Sort by priority descending
  _queue.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  _onStateChange({ queue: [..._queue] });

  if (!_isSpeaking) {
    _drainQueue();
  }
}

// ─── Queue drain ──────────────────────────────────────────────
function _drainQueue() {
  if (_isMuted || _queue.length === 0) {
    _isSpeaking = false;
    _onStateChange({ isSpeaking: false });
    return;
  }

  const now = Date.now();
  const gap = now - _lastSpokenAt;

  if (gap < MIN_GAP_MS) {
    // Wait remaining time before speaking
    setTimeout(_drainQueue, MIN_GAP_MS - gap);
    return;
  }

  const item = _queue.shift()!;
  _isSpeaking = true;
  _lastSpokenAt = Date.now();
  _onStateChange({ isSpeaking: true, lastSpokenText: item.text, queue: [..._queue] });

  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.rate = item.rate ?? 0.92;   // slightly slower = more authoritative
  utterance.pitch = item.pitch ?? 0.88; // slightly lower = command center feel
  utterance.volume = 1;

  // Prefer a deep, authoritative English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("george") ||
        v.name.toLowerCase().includes("daniel") ||
        v.name.toLowerCase().includes("alex") ||
        v.name.toLowerCase().includes("guy"))
  );
  if (preferred) utterance.voice = preferred;

  utterance.onend = () => {
    _isSpeaking = false;
    // Small pause between items
    setTimeout(_drainQueue, 600);
  };

  utterance.onerror = () => {
    _isSpeaking = false;
    setTimeout(_drainQueue, 600);
  };

  window.speechSynthesis.speak(utterance);
}

// ─── Cancel current speech ────────────────────────────────────
export function cancelSpeech() {
  window.speechSynthesis?.cancel();
  _queue = [];
  _isSpeaking = false;
  _onStateChange({ isSpeaking: false, queue: [] });
}

// ─── Browser support check ────────────────────────────────────
export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
