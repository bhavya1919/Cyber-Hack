import React from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useBootSequence } from "./useBootSequence";
import { BOOT_STEPS } from "./bootData";
import { BootStep } from "./BootStep";
import { ProgressBar } from "./ProgressBar";

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const { activeSteps, progress, loadingText } = useBootSequence(onComplete);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070A] overflow-hidden select-none">
      {/* Cinematic Cyber Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* Scan Lines Screen Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />

      {/* Outer Cyan Glow Backlight */}
      <div className="absolute h-[450px] w-[600px] rounded-full bg-[#00E5FF]/5 blur-[120px] pointer-events-none" />

      {/* Main Terminal Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 shadow-[0_20px_50px_-15px_rgba(0,229,255,0.15)] relative"
      >
        {/* Terminal Header */}
        <div className="flex flex-col items-center text-center border-b border-white/10 pb-6 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
            className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] shadow-[0_0_30px_rgba(0,229,255,0.3)] mb-4"
          >
            <Shield className="h-6 w-6 text-black" strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-sm font-extrabold tracking-[0.25em] text-white uppercase font-mono">
            AI Shadow Internet
          </h1>
          <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase mt-1">
            Global Cyber Intelligence Platform // Secure Enclave
          </span>
        </div>

        {/* Action Status Indicator */}
        <div className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider mb-4 h-4">
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {loadingText}
          </motion.span>
        </div>

        {/* Steps Checklist Grid */}
        <div className="flex flex-col gap-2.5 mb-8 border border-white/5 bg-white/[0.01] rounded-xl p-5 min-h-[200px]">
          {BOOT_STEPS.map((step) => (
            <BootStep
              key={step.id}
              label={step.label}
              isActive={activeSteps.includes(step.id)}
            />
          ))}
        </div>

        {/* Progress Bar Sync */}
        <ProgressBar progress={progress} />

        {/* Terminal Border Corner Decors */}
        <div className="absolute top-3 left-3 h-2 w-2 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-3 right-3 h-2 w-2 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-3 left-3 h-2 w-2 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-3 right-3 h-2 w-2 border-b-2 border-r-2 border-white/20" />
      </motion.div>
    </div>
  );
}
