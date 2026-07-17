import "server-only";
import { Telegraf, Markup } from "telegraf";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSignals, saveSignals, Signal } from "@/lib/signals";
import { getBotSession, setBotSession, clearBotSession, BotSessionPayload } from "@/lib/botSession";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;

function getAdminIds(): string[] {
  return (process.env.TELEGRAM_ADMIN_CHAT_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAdmin(chatId: string): boolean {
  return getAdminIds().includes(chatId);
}

const PAIRS = ["XAU/USD", "EUR/USD", "GBP/USD", "BTC/USD", "USD/JPY"];

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("Tambah Sinyal", "menu:add_signal")],
    [Markup.button.callback("Sinyal Aktif", "menu:list_signals")],
    [Markup.button.callback("Kelola Member", "menu:members")],
  ]);
}

function pairMenu() {
  const rows = PAIRS.map((p) => [Markup.button.callback(p, `signal:pair:${p}`)]);
  rows.push([Markup.button.callback("Kembali", "menu:main")]);
  return Markup.inlineKeyboard(rows);
}

function directionMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("BUY", "signal:dir:BUY"),
      Markup.button.callback("SELL", "signal:dir:SELL"),
    ],
    [Markup.button.callback("Batal", "menu:main")],
  ]);
}

function confirmMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("Simpan Sinyal", "signal:confirm")],
    [Markup.button.callback("Batal", "menu:main")],
  ]);
}

export function createBot() {
  const bot = new Telegraf(BOT_TOKEN);

  bot.start(async (ctx) => {
    const chatId = String(ctx.chat.id);
    if (!isAdmin(chatId)) {
      await ctx.reply("Bot ini khusus digunakan oleh admin LASTQUESTION FOREX.");
      return;
    }
    await clearBotSession(chatId);
    await ctx.reply(
      "Panel Admin LASTQUESTION FOREX\n\nPilih menu di bawah ini.",
      mainMenu()
    );
  });

  bot.action("menu:main", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    await clearBotSession(chatId);
    await ctx.editMessageText("Panel Admin LASTQUESTION FOREX\n\nPilih menu di bawah ini.", mainMenu());
    await ctx.answerCbQuery();
  });

  // ---------- ADD SIGNAL WIZARD ----------
  bot.action("menu:add_signal", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    await setBotSession(chatId, "awaiting_pair", {});
    await ctx.editMessageText("Pilih pair untuk sinyal baru:", pairMenu());
    await ctx.answerCbQuery();
  });

  bot.action(/^signal:pair:(.+)$/, async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const pair = ctx.match[1];
    await setBotSession(chatId, "awaiting_direction", { pair });
    await ctx.editMessageText(`Pair: ${pair}\n\nPilih arah sinyal:`, directionMenu());
    await ctx.answerCbQuery();
  });

  bot.action(/^signal:dir:(BUY|SELL)$/, async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const session = await getBotSession(chatId);
    const direction = ctx.match[1];
    await setBotSession(chatId, "awaiting_entry", { ...session?.payload, direction });
    await ctx.editMessageText(
      `Pair: ${session?.payload.pair}\nArah: ${direction}\n\nKetik harga Entry:`
    );
    await ctx.answerCbQuery();
  });

  bot.action("signal:confirm", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const session = await getBotSession(chatId);
    const p = session?.payload;

    if (!p?.pair || !p?.direction || !p?.entry || !p?.tp || !p?.sl) {
      await ctx.editMessageText("Data tidak lengkap. Silakan ulangi.", mainMenu());
      await ctx.answerCbQuery();
      return;
    }

    const signals = await getSignals();
    const newSignal: Signal = {
      id: randomUUID(),
      pair: p.pair,
      direction: p.direction as "BUY" | "SELL",
      entry: p.entry,
      tp: p.tp,
      sl: p.sl,
      note: "",
      status: "active",
      created_at: new Date().toISOString(),
    };
    signals.push(newSignal);
    await saveSignals(signals);
    await clearBotSession(chatId);

    await ctx.editMessageText(
      `Sinyal berhasil disimpan dan tayang di website.\n\nPair: ${newSignal.pair}\nArah: ${newSignal.direction}\nEntry: ${newSignal.entry}\nTP: ${newSignal.tp}\nSL: ${newSignal.sl}`,
      mainMenu()
    );
    await ctx.answerCbQuery("Tersimpan");
  });

  // ---------- LIST SIGNALS ----------
  bot.action("menu:list_signals", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const signals = (await getSignals()).filter((s) => s.status === "active");

    if (signals.length === 0) {
      await ctx.editMessageText("Belum ada sinyal aktif.", mainMenu());
      await ctx.answerCbQuery();
      return;
    }

    const rows = signals
      .slice(0, 15)
      .map((s) => [
        Markup.button.callback(`Tutup: ${s.pair} ${s.direction}`, `signal:close:${s.id}`),
      ]);
    rows.push([Markup.button.callback("Kembali", "menu:main")]);

    await ctx.editMessageText("Sinyal Aktif:", Markup.inlineKeyboard(rows));
    await ctx.answerCbQuery();
  });

  bot.action(/^signal:close:(.+)$/, async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const signals = await getSignals();
    const idx = signals.findIndex((s) => s.id === id);
    if (idx !== -1) {
      signals[idx].status = "closed";
      await saveSignals(signals);
    }
    await ctx.answerCbQuery("Sinyal ditutup");
    await ctx.editMessageText("Sinyal Aktif:", mainMenu());
  });

  // ---------- MEMBERS ----------
  bot.action("menu:members", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();

    const { data } = await supabaseAdmin
      .from("forex_profiles")
      .select("id, email, full_name, vip_status")
      .order("created_at", { ascending: false })
      .limit(15);

    const members = data || [];
    if (members.length === 0) {
      await ctx.editMessageText("Belum ada member terdaftar.", mainMenu());
      await ctx.answerCbQuery();
      return;
    }

    const rows = members.map((m) => [
      Markup.button.callback(
        `${m.full_name || m.email} [${m.vip_status.toUpperCase()}]`,
        `member:toggle:${m.id}`
      ),
    ]);
    rows.push([Markup.button.callback("Kembali", "menu:main")]);

    await ctx.editMessageText("Ketuk member untuk ubah status VIP/Free:", Markup.inlineKeyboard(rows));
    await ctx.answerCbQuery();
  });

  bot.action(/^member:toggle:(.+)$/, async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return ctx.answerCbQuery();
    const id = ctx.match[1];

    const { data: profile } = await supabaseAdmin
      .from("forex_profiles")
      .select("vip_status")
      .eq("id", id)
      .maybeSingle();

    const newStatus = profile?.vip_status === "vip" ? "free" : "vip";
    await supabaseAdmin
      .from("forex_profiles")
      .update({ vip_status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    await ctx.answerCbQuery(`Status diubah ke ${newStatus.toUpperCase()}`);

    const { data } = await supabaseAdmin
      .from("forex_profiles")
      .select("id, email, full_name, vip_status")
      .order("created_at", { ascending: false })
      .limit(15);

    const members = data || [];
    const rows = members.map((m) => [
      Markup.button.callback(
        `${m.full_name || m.email} [${m.vip_status.toUpperCase()}]`,
        `member:toggle:${m.id}`
      ),
    ]);
    rows.push([Markup.button.callback("Kembali", "menu:main")]);

    await ctx.editMessageText("Ketuk member untuk ubah status VIP/Free:", Markup.inlineKeyboard(rows));
  });

  // ---------- TEXT INPUT HANDLER (numeric wizard steps only) ----------
  bot.on("text", async (ctx) => {
    const chatId = String(ctx.chat!.id);
    if (!isAdmin(chatId)) return;

    const session = await getBotSession(chatId);
    if (!session) return;

    const value = ctx.message.text.trim();

    if (session.state === "awaiting_entry") {
      await setBotSession(chatId, "awaiting_tp", { ...session.payload, entry: value });
      await ctx.reply(`Entry: ${value}\n\nKetik harga Take Profit (TP):`);
      return;
    }

    if (session.state === "awaiting_tp") {
      await setBotSession(chatId, "awaiting_sl", { ...session.payload, tp: value });
      await ctx.reply(`TP: ${value}\n\nKetik harga Stop Loss (SL):`);
      return;
    }

    if (session.state === "awaiting_sl") {
      const payload: BotSessionPayload = { ...session.payload, sl: value };
      await setBotSession(chatId, "confirming", payload);
      await ctx.reply(
        `Konfirmasi Sinyal:\n\nPair: ${payload.pair}\nArah: ${payload.direction}\nEntry: ${payload.entry}\nTP: ${payload.tp}\nSL: ${value}`,
        confirmMenu()
      );
      return;
    }
  });

  return bot;
}
