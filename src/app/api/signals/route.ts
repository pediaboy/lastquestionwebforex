import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSignals } from "@/lib/signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    let isVip = false;

    if (token) {
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      if (userData?.user) {
        const { data: profile } = await supabaseAdmin
          .from("forex_profiles")
          .select("vip_status")
          .eq("id", userData.user.id)
          .maybeSingle();
        isVip = profile?.vip_status === "vip" || profile?.vip_status === "admin";
      }
    }

    const signals = await getSignals();
    const active = signals
      .filter((s) => s.status === "active")
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    if (isVip) {
      return NextResponse.json({ isVip: true, signals: active });
    }

    // Free users: mask sensitive fields
    const masked = active.map((s) => ({
      id: s.id,
      pair: s.pair,
      direction: s.direction,
      entry: null,
      tp: null,
      sl: null,
      note: null,
      status: s.status,
      created_at: s.created_at,
      locked: true,
    }));

    return NextResponse.json({ isVip: false, signals: masked });
  } catch (err) {
    console.error("signals GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
