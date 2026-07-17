import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type Signal = {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  tp: string;
  sl: string;
  note?: string;
  status: "active" | "closed";
  created_at: string;
};

const SETTINGS_KEY = "forex_signals";

export async function getSignals(): Promise<Signal[]> {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  const value = (data?.value as Signal[]) || [];
  return Array.isArray(value) ? value : [];
}

export async function saveSignals(signals: Signal[]) {
  await supabaseAdmin.from("settings").upsert(
    { key: SETTINGS_KEY, value: signals },
    { onConflict: "key" }
  );
}
