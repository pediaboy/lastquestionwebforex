import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserFromRequest } from "@/lib/authUser";
import { getUserJournal, saveUserJournal, JournalEntry } from "@/lib/journal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entries = await getUserJournal(user.id);
  entries.sort((a, b) => (a.trade_date < b.trade_date ? 1 : -1));
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { pair, direction, entry, exit_price, profit_loss, notes, trade_date } = body;
  if (!pair || !direction || !trade_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const entries = await getUserJournal(user.id);
  const newEntry: JournalEntry = {
    id: randomUUID(),
    pair,
    direction,
    entry: entry || "",
    exit_price: exit_price || "",
    profit_loss: profit_loss || "",
    notes: notes || "",
    trade_date,
    created_at: new Date().toISOString(),
  };
  entries.push(newEntry);
  await saveUserJournal(user.id, entries);
  return NextResponse.json({ ok: true, entry: newEntry });
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const entries = await getUserJournal(user.id);
  const filtered = entries.filter((e) => e.id !== id);
  await saveUserJournal(user.id, filtered);
  return NextResponse.json({ ok: true });
}
