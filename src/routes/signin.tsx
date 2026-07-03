import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import ParticleBg from "@/components/landing/ParticleBg";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#05070A] text-[#F5F7FA] overflow-hidden">
      <ParticleBg />
      
      {/* Back button / Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
          <div className="relative grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] shadow-[0_0_20px_rgba(0,229,255,0.5)]">
            <Shield className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">AI Shadow</span>
            <span className="text-[10px] font-mono text-[#00E5FF]/80 tracking-widest">RETURN TO HOME</span>
          </div>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,229,255,0.2)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Initialize Session</h1>
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Enter operator credentials</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] p-3 rounded-lg text-xs font-mono">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest ml-1">
              Operator ID / Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@aishadow.net" 
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#00E5FF]/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00E5FF]/30"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest">
                Passphrase
              </label>
              <a href="#" className="text-[10px] text-white/40 hover:text-[#00E5FF] transition-colors">Reset key?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••" 
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#00E5FF]/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00E5FF]/30"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#6C63FF] px-4 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Authenticate <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/50">
            No access clearance?{" "}
            <Link to="/signup" className="text-[#00E5FF] hover:underline hover:text-white transition-colors">
              Request authorization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
