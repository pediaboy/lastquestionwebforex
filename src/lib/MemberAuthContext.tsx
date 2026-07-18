"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { isVipStatus } from "@/lib/constants";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  vip_status: string;
};

type MemberAuthState = {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  isVip: boolean;
  accessToken: string | null;
  refreshProfile: () => Promise<void>;
};

const MemberAuthContext = createContext<MemberAuthState | null>(null);

// Fetches the session + member profile ONCE when the dashboard section mounts,
// and keeps it in context so every page inside /dashboard-member/* reuses it
// instead of each page re-doing its own sequential auth + profile round trips
// (that duplicate work on every navigation was the main cause of slow loads).
export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const mounted = useRef(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("forex_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (mounted.current) setProfile((data as Profile) || null);
  }

  useEffect(() => {
    mounted.current = true;

    async function init() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        router.replace("/login");
        return;
      }

      if (!mounted.current) return;
      setSession(currentSession);
      await loadProfile(currentSession.user.id);
      if (!mounted.current) return;
      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted.current) return;
      setSession(nextSession);
      if (!nextSession) router.replace("/login");
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: MemberAuthState = {
    loading,
    session,
    profile,
    isVip: isVipStatus(profile?.vip_status),
    accessToken: session?.access_token || null,
    refreshProfile: async () => {
      if (session) await loadProfile(session.user.id);
    },
  };

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useMemberAuth() {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) {
    throw new Error("useMemberAuth must be used inside <MemberAuthProvider>");
  }
  return ctx;
}
