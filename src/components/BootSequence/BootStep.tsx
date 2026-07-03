import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface BootStepProps {
  label: string;
  isActive: boolean;
}

export function BootStep({ label, isActive }: BootStepProps) {
  return (
    <div className="h-6 flex items-center">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="flex items-center gap-2 text-xs font-mono"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-[#00FFC8]/10 border border-[#00FFC8]/30 text-[#00FFC8] shadow-[0_0_8px_rgba(0,255,200,0.2)]">
              <Check className="h-3 w-3 stroke-[2.5]" />
            </span>
            <span className="text-white/80">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";
