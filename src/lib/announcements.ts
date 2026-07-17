import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

const KEY = "forex_announcements";

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  const value = (data?.value as Announcement[]) || [];
  return Array.isArray(value) ? value : [];
}

export async function saveAnnouncements(items: Announcement[]) {
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: items }, { onConflict: "key" });
}
