import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type JournalEntry = {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  exit_price: string;
  profit_loss: string;
  notes?: string;
  trade_date: string;
  created_at: string;
};

const KEY = "forex_journal";

export async function getAllJournals(): Promise<Record<string, JournalEntry[]>> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  return (data?.value as Record<string, JournalEntry[]>) || {};
}

export async function getUserJournal(userId: string): Promise<JournalEntry[]> {
  const all = await getAllJournals();
  return all[userId] || [];
}

export async function saveUserJournal(userId: string, entries: JournalEntry[]) {
  const all = await getAllJournals();
  all[userId] = entries;
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: all }, { onConflict: "key" });
}
