import { NextRequest, NextResponse } from "next/server";
import { createBot } from "@/lib/telegramBot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const bot = createBot();
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("telegram-webhook error:", err);
    return NextResponse.json({ ok: true }); // always 200 so Telegram doesn't retry-storm
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Telegram webhook endpoint is live." });
}
