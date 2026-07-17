import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAnnouncements, saveAnnouncements } from "@/lib/announcements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getAnnouncements();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, body: content } = body;
  if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const items = await getAnnouncements();
  const newItem = { id: randomUUID(), title, body: content, created_at: new Date().toISOString() };
  items.push(newItem);
  await saveAnnouncements(items);
  return NextResponse.json({ ok: true, item: newItem });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const items = await getAnnouncements();
  await saveAnnouncements(items.filter((i) => i.id !== id));
  return NextResponse.json({ ok: true });
}
