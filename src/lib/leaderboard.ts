import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type LeaderboardRow = {
  id: string;
  name: string;
  pips: number;
  trades: number;
  win_rate: number;
};

export type LeaderboardData = {
  weekly: LeaderboardRow[];
  monthly: LeaderboardRow[];
};

const KEY = "forex_leaderboard";

export const DEFAULT_LEADERBOARD: LeaderboardData = {
  weekly: [
    { id: "1", name: "Thoriq A.", pips: 234, trades: 18, win_rate: 92 },
    { id: "2", name: "Andi P.", pips: 198, trades: 22, win_rate: 88 },
    { id: "3", name: "Budi S.", pips: 176, trades: 15, win_rate: 85 },
  ],
  monthly: [
    { id: "1", name: "Thoriq A.", pips: 812, trades: 64, win_rate: 90 },
    { id: "2", name: "Andi P.", pips: 705, trades: 71, win_rate: 86 },
    { id: "3", name: "Budi S.", pips: 640, trades: 58, win_rate: 83 },
  ],
};

export async function getLeaderboard(): Promise<LeaderboardData> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  const value = data?.value as Partial<LeaderboardData> | undefined;
  if (!value) return DEFAULT_LEADERBOARD;
  return {
    weekly: Array.isArray(value.weekly) ? value.weekly : DEFAULT_LEADERBOARD.weekly,
    monthly: Array.isArray(value.monthly) ? value.monthly : DEFAULT_LEADERBOARD.monthly,
  };
}

export async function saveLeaderboard(data: LeaderboardData) {
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: data }, { onConflict: "key" });
}
