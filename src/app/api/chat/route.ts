import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserFromRequest } from "@/lib/authUser";
import { getUserChat, appendUserChat } from "@/lib/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const thread = await getUserChat(user.id);
  return NextResponse.json({ thread });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const message = String(body.message || "").trim().slice(0, 1000);
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const msg = { id: randomUUID(), sender: "user" as const, message, created_at: new Date().toISOString() };
  await appendUserChat(user.id, msg);
  return NextResponse.json({ ok: true, message: msg });
}
