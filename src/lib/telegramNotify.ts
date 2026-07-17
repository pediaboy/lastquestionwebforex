import "server-only";

function normalizeChatId(id: string): string {
  const trimmed = id.trim();
  // Public channel/group usernames need a leading "@" for the Bot API.
  if (/^-?\d+$/.test(trimmed)) return trimmed;
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return { ok: false, error: "Missing token or chat id" };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: normalizeChatId(chatId),
        text,
        parse_mode: "HTML",
      }),
    });
    const json = await res.json();
    if (!json.ok) console.error("Telegram sendMessage failed:", json.description);
    return json;
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
    return { ok: false, error: String(err) };
  }
}

/** Sends a message to the private admin notification chat. */
export async function notifyAdmin(text: string) {
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || "";
  return sendTelegramMessage(chatId, text);
}

/** Broadcasts a message to the community group/channel where members are. */
export async function broadcastToGroup(text: string) {
  const chatId = process.env.TELEGRAM_GROUP_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || "";
  return sendTelegramMessage(chatId, text);
}
