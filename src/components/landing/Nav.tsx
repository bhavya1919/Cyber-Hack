import { Shield, User, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "../../core/store/authStore";

export default function Nav() {
  const { user, signOut } = useAuthStore();
  
  const links = [
    ["Platform", "#capabilities"],
    ["Threat Map", "#map"],
    ["Solutions", "#solutions"],
    ["Pricing", "#pricing"],
    ["Docs", "#faq"],
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">
        <a href="#" className="flex items-center gap-2">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#6C63FF] shadow-[0_0_20px_rgba(0,229,255,0.5)]">
            <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">AI Shadow</span>
            <span className="text-[10px] font-mono text-[#00E5FF]/80 tracking-widest">INTERNET</span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-sm text-white/70 transition hover:text-[#00E5FF]">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-mono text-white/50 sm:block">{user.email}</span>
              <button 
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/signin" 
                className="hidden text-sm text-white/70 transition hover:text-white sm:block"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="hidden items-center justify-center gap-2 rounded-lg border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-4 py-2 text-sm font-medium text-[#00E5FF] transition-all hover:bg-[#00E5FF]/15 hover:border-[#00E5FF]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] sm:flex"
              >
                <User className="h-4 w-4" />
                Register
              </Link>
            </div>
          )}
          <Link
            to="/dashboard"
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#6C63FF] px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] cursor-pointer"
          >
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
}