import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type BotSessionPayload = Record<string, string | undefined>;

export async function getBotSession(chatId: string): Promise<{ state: string; payload: BotSessionPayload } | null> {
  const { data } = await supabaseAdmin
    .from("bot_sessions")
    .select("state, payload")
    .eq("chat_id", chatId)
    .maybeSingle();

  if (!data) return null;
  return { state: data.state, payload: (data.payload as BotSessionPayload) || {} };
}

export async function setBotSession(chatId: string, state: string, payload: BotSessionPayload) {
  await supabaseAdmin.from("bot_sessions").upsert(
    {
      chat_id: chatId,
      state,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "chat_id" }
  );
}

export async function clearBotSession(chatId: string) {
  await supabaseAdmin.from("bot_sessions").delete().eq("chat_id", chatId);
}
