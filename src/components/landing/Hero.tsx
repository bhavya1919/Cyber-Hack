import { motion } from "framer-motion";
import { ArrowRight, Play, Activity, ShieldAlert, Radar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28 md:pt-48 md:pb-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[#00E5FF]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
            </span>
            Live · Predictive Cyber Intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            Predict Cyber Threats
            <br />
            <span className="text-gradient">Before They Become Attacks.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#A0AEC0]"
          >
            AI Shadow Internet is an autonomous cyber intelligence platform that continuously monitors the visible web, deep web, threat intelligence feeds, vulnerability disclosures, and cyber signals to predict, analyze, and visualize emerging threats in real time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#6C63FF] px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(0,229,255,0.4)] transition hover:shadow-[0_0_45px_rgba(0,229,255,0.7)] cursor-pointer"
            >
              Launch Platform
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <button className="group flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-[#00E5FF]/50 hover:bg-white/10">
              <Play className="h-4 w-4 fill-[#00E5FF] text-[#00E5FF]" />
              Watch Demo
            </button>
          </motion.div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/40">
            <span>Trusted intelligence for</span>
            <span className="font-mono text-white/60">GOVERNMENTS</span>
            <span className="font-mono text-white/60">CERT · SOC</span>
            <span className="font-mono text-white/60">FORTUNE 500</span>
            <span className="font-mono text-white/60">DEFENSE</span>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-square w-full">
      {/* Rotating globe */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-[420px] w-[420px] max-h-[80vw] max-w-[80vw]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00E5FF]/20 via-transparent to-[#6C63FF]/20 blur-3xl" />
          <svg viewBox="0 0 400 400" className="animate-rotate-slow relative h-full w-full">
            <defs>
              <radialGradient id="globe" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#0a1628" />
                <stop offset="100%" stopColor="#05070A" />
              </radialGradient>
              <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF4D6D" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#globe)" stroke="#00E5FF" strokeOpacity="0.3" />
            {[...Array(8)].map((_, i) => (
              <ellipse
                key={i}
                cx="200"
                cy="200"
                rx="180"
                ry={180 - i * 22}
                fill="none"
                stroke="#00E5FF"
                strokeOpacity={0.12}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={200 + 180 * Math.cos((i * Math.PI) / 6)}
                y1={200 + 180 * Math.sin((i * Math.PI) / 6)}
                x2={200 - 180 * Math.cos((i * Math.PI) / 6)}
                y2={200 - 180 * Math.sin((i * Math.PI) / 6)}
                stroke="#00E5FF"
                strokeOpacity="0.1"
              />
            ))}
            {/* attack arcs */}
            {[
              [80, 140, 320, 260],
              [340, 120, 100, 300],
              [200, 60, 300, 340],
              [60, 250, 340, 180],
            ].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <path
                  d={`M${x1} ${y1} Q 200 ${100 - i * 30} ${x2} ${y2}`}
                  fill="none"
                  stroke="url(#arc)"
                  strokeWidth="1.5"
                  className="animate-dash"
                />
                <circle cx={x1} cy={y1} r="3" fill="#00E5FF" />
                <circle cx={x2} cy={y2} r="3" fill="#FF4D6D" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Floating panels */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card neon-border absolute left-0 top-8 w-56 p-4"
      >
        <div className="flex items-center gap-2 text-xs text-[#00E5FF]">
          <Activity className="h-3.5 w-3.5" />
          <span className="font-mono uppercase tracking-wider">Live Threats</span>
        </div>
        <div className="mt-2 text-3xl font-bold">12,847</div>
        <div className="mt-1 text-[10px] text-[#00FFC8]">+18.4% last hour</div>
        <div className="mt-3 flex h-8 items-end gap-1">
          {[3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 12].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-sm bg-gradient-to-t from-[#00E5FF]/40 to-[#00E5FF]"
              style={{ height: `${h * 8}%` }}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card neon-border absolute right-0 bottom-16 w-60 p-4"
      >
        <div className="flex items-center gap-2 text-xs text-[#FF4D6D]">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span className="font-mono uppercase tracking-wider">Critical Alert</span>
        </div>
        <div className="mt-2 text-sm font-semibold">APT-441 Campaign Detected</div>
        <div className="mt-1 text-xs text-white/60">Financial sector · 14 nations</div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#6C63FF]" />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-white/50">
          <span>Severity</span>
          <span className="text-[#FF4D6D]">87 · Critical</span>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card neon-border absolute right-6 top-24 flex w-44 items-center gap-3 p-3"
      >
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#6C63FF]/20">
          <Radar className="h-4 w-4 text-[#6C63FF]" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-white/50">AI Confidence</div>
          <div className="text-lg font-bold text-[#00FFC8]">98.4%</div>
        </div>
      </motion.div>
    </div>
  );
}