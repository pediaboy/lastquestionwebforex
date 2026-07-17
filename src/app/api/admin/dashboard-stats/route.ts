import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getDashboardStats, saveDashboardStats, DashboardStats } from "@/lib/dashboardStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getDashboardStats();
  return NextResponse.json({ stats });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as DashboardStats;

  const required = ["win_rate", "total_trade", "profit_bulan", "kelas_selesai"] as const;
  for (const key of required) {
    if (!body[key] || typeof body[key].value !== "string") {
      return NextResponse.json({ error: `Invalid field: ${key}` }, { status: 400 });
    }
  }

  await saveDashboardStats(body);
  return NextResponse.json({ ok: true });
}
