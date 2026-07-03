import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initialize: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  initialize: async () => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false });
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
