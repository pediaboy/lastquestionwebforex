import { NextResponse } from "next/server";
import { getVipPackages } from "@/lib/vipPackages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const packages = await getVipPackages();
  return NextResponse.json({ packages });
}
