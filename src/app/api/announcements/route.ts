import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/announcements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getAnnouncements();
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return NextResponse.json({ items });
}
