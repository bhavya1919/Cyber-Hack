import React from "react";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const TOTAL_BLOCKS = 25;
  const filledBlocks = Math.round((progress / 100) * TOTAL_BLOCKS);
  const emptyBlocks = TOTAL_BLOCKS - filledBlocks;

  return (
    <div className="flex flex-col gap-1 w-full max-w-sm mx-auto font-mono text-[10px]">
      <div className="flex items-center justify-between text-white/40 mb-1">
        <span>SECURITY ENCLAVE SYNC</span>
        <span className="text-[#00E5FF] font-bold">{progress}%</span>
      </div>
      
      {/* Block Progress Bar */}
      <div className="flex items-center gap-0.5 text-xs text-[#00E5FF] tracking-tighter select-none">
        <span className="drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">
          {"█".repeat(filledBlocks)}
        </span>
        <span className="text-white/5">
          {"█".repeat(emptyBlocks)}
        </span>
      </div>
    </div>
  );
}
