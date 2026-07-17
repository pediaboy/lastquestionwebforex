import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAllChats, appendUserChat } from "@/lib/chat";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await getAllChats();

  const { data: profiles } = await supabaseAdmin
    .from("forex_profiles")
    .select("id, full_name, email");

  const nameMap = new Map((profiles || []).map((p) => [p.id, p.full_name || p.email]));

  const threads = Object.entries(all)
    .map(([userId, messages]) => ({
      user_id: userId,
      name: nameMap.get(userId) || userId,
      messages,
      last_message_at: messages[messages.length - 1]?.created_at || "",
    }))
    .sort((a, b) => (a.last_message_at < b.last_message_at ? 1 : -1));

  return NextResponse.json({ threads });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { user_id, message } = body;
  if (!user_id || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const msg = { id: randomUUID(), sender: "admin" as const, message, created_at: new Date().toISOString() };
  await appendUserChat(user_id, msg);
  return NextResponse.json({ ok: true, message: msg });
}
