import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAdminRequest } from "@/lib/adminAuth";
import { getSignals, saveSignals, Signal } from "@/lib/signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const signals = await getSignals();
  return NextResponse.json({ signals });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { pair, direction, entry, tp, sl, note } = body;

  if (!pair || !direction || !entry || !tp || !sl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const signals = await getSignals();
  const newSignal: Signal = {
    id: randomUUID(),
    pair,
    direction,
    entry,
    tp,
    sl,
    note: note || "",
    status: "active",
    created_at: new Date().toISOString(),
  };

  signals.push(newSignal);
  await saveSignals(signals);

  return NextResponse.json({ ok: true, signal: newSignal });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const signals = await getSignals();
  const idx = signals.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  signals[idx] = { ...signals[idx], ...updates };
  await saveSignals(signals);

  return NextResponse.json({ ok: true, signal: signals[idx] });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const signals = await getSignals();
  const filtered = signals.filter((s) => s.id !== id);
  await saveSignals(filtered);

  return NextResponse.json({ ok: true });
}
