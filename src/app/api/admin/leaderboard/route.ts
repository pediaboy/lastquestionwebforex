import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getLeaderboard, saveLeaderboard, LeaderboardData } from "@/lib/leaderboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getLeaderboard();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as LeaderboardData;

  if (!Array.isArray(body.weekly) || !Array.isArray(body.monthly)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await saveLeaderboard(body);
  return NextResponse.json({ ok: true });
}
