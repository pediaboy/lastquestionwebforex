import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type StatCard = {
  value: string;
  delta: string;
  label: string;
};

export type DashboardStats = {
  win_rate: StatCard;
  total_trade: StatCard;
  profit_bulan: StatCard;
  kelas_selesai: StatCard;
};

const KEY = "forex_dashboard_stats";

export const DEFAULT_STATS: DashboardStats = {
  win_rate: { value: "87%", delta: "+2.3%", label: "Win Rate" },
  total_trade: { value: "156", delta: "+12", label: "Total Trade" },
  profit_bulan: { value: "+534 pips", delta: "+15%", label: "Profit Bulan Ini" },
  kelas_selesai: { value: "12/24", delta: "50%", label: "Kelas Selesai" },
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  const value = data?.value as Partial<DashboardStats> | undefined;
  if (!value) return DEFAULT_STATS;
  return {
    win_rate: { ...DEFAULT_STATS.win_rate, ...value.win_rate },
    total_trade: { ...DEFAULT_STATS.total_trade, ...value.total_trade },
    profit_bulan: { ...DEFAULT_STATS.profit_bulan, ...value.profit_bulan },
    kelas_selesai: { ...DEFAULT_STATS.kelas_selesai, ...value.kelas_selesai },
  };
}

export async function saveDashboardStats(stats: DashboardStats) {
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: stats }, { onConflict: "key" });
}
