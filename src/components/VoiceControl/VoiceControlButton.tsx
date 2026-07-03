// src/components/VoiceControl/VoiceControlButton.tsx
// Mute/unmute toggle for the Mission Control Voice.
// Lives in the dashboard header, near the notification bell.

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { useSpeechStore } from "@/core/speech";

export function VoiceControlButton() {
  const isMuted = useSpeechStore((s) => s.isMuted);
  const isSupported = useSpeechStore((s) => s.isSupported);
  const isSpeaking = useSpeechStore((s) => s.isSpeaking);
  const toggleMute = useSpeechStore((s) => s.toggleMute);
  const lastSpokenText = useSpeechStore((s) => s.lastSpokenText);

  // Auto-dismiss the tooltip after 4s of showing
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  useEffect(() => {
    if (isSpeaking && lastSpokenText) {
      setShowTooltip(true);
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 4000);
    }
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, [isSpeaking, lastSpokenText]);

  // Don't render if browser doesn't support speech
  if (!isSupported) return null;

  return (
    <div className="relative flex items-center gap-2">
      {/* Currently speaking indicator */}
      <AnimatePresence>
        {showTooltip && lastSpokenText && !isMuted && (
          <motion.div
            key="speech-tooltip"
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-60 rounded-xl border border-[#00E5FF]/20 bg-black/80 backdrop-blur-xl p-3 shadow-[0_8px_30px_rgba(0,229,255,0.1)] pointer-events-none z-50"
          >
            {/* Speaker animation bars */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <Radio className="h-3 w-3 text-[#00E5FF]" />
              <span className="text-[8px] font-mono font-bold text-[#00E5FF] uppercase tracking-widest">
                Mission Commander
              </span>
              <div className="ml-auto flex items-end gap-0.5 h-3">
                {[2, 4, 3, 5, 2, 4, 3].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#00E5FF] rounded-full"
                    animate={{ height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + i * 0.07,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2 font-mono">
              "{lastSpokenText}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        id="voice-control-btn"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute mission commander voice" : "Mute mission commander voice"}
        title={isMuted ? "Voice: OFF — click to enable" : "Voice: ON — click to mute"}
        className={`relative flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-300 ease-out cursor-pointer outline-none
          focus-visible:ring-2 focus-visible:ring-[#00E5FF]/50 active:scale-95
          ${
            isMuted
              ? "border-white/10 bg-white/[0.02] text-white/30 hover:text-white/60"
              : isSpeaking
              ? "border-[#00FFC8]/50 bg-[#00FFC8]/10 text-[#00FFC8] shadow-[0_0_12px_rgba(0,255,200,0.2)]"
              : "border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#00E5FF]/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/40"
          }`}
      >
        {isMuted ? (
          <VolumeX className="h-3.5 w-3.5" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}

        {/* Speaking pulse ring */}
        {isSpeaking && !isMuted && (
          <span className="absolute inset-0 rounded-lg animate-ping border border-[#00FFC8]/30 pointer-events-none" />
        )}
      </button>
    </div>
  );
}
