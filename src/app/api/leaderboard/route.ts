import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") === "monthly" ? "monthly" : "weekly";
  const data = await getLeaderboard();
  return NextResponse.json({ period, rows: data[period] });
}
