import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserFromRequest } from "@/lib/authUser";
import { getCommunityPosts, addCommunityPost } from "@/lib/community";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await getCommunityPosts();
  posts.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return NextResponse.json({ posts: posts.slice(0, 100) });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const message = String(body.message || "").trim().slice(0, 1000);
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const { data: profile } = await supabaseAdmin
    .from("forex_profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const post = {
    id: randomUUID(),
    user_id: user.id,
    author_name: profile?.full_name || profile?.email?.split("@")[0] || "Member",
    message,
    created_at: new Date().toISOString(),
  };

  await addCommunityPost(post);
  return NextResponse.json({ ok: true, post });
}
