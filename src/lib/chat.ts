import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type ChatMessage = {
  id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

const KEY = "forex_chat";

export async function getAllChats(): Promise<Record<string, ChatMessage[]>> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  return (data?.value as Record<string, ChatMessage[]>) || {};
}

export async function getUserChat(userId: string): Promise<ChatMessage[]> {
  const all = await getAllChats();
  return all[userId] || [];
}

export async function appendUserChat(userId: string, msg: ChatMessage) {
  const all = await getAllChats();
  const thread = all[userId] || [];
  thread.push(msg);
  all[userId] = thread;
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: all }, { onConflict: "key" });
}
