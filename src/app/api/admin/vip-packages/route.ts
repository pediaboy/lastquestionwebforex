import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getVipPackages, saveVipPackages, VipPackage } from "@/lib/vipPackages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const packages = await getVipPackages();
  return NextResponse.json({ packages });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { packages: VipPackage[] };

  if (!Array.isArray(body.packages)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  for (const pkg of body.packages) {
    if (!pkg.name?.trim() || typeof pkg.price !== "number" || typeof pkg.duration_days !== "number") {
      return NextResponse.json({ error: "Setiap paket wajib punya nama, harga, dan durasi." }, { status: 400 });
    }
    if (!Array.isArray(pkg.features)) pkg.features = [];
  }

  await saveVipPackages(body.packages);
  return NextResponse.json({ ok: true });
}
