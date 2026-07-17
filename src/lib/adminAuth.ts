import "server-only";
import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_PANEL_KEY;
  return Boolean(expected) && key === expected;
}
