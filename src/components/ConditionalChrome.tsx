"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Routes that render their own dedicated header/sidebar (DashboardSidebar +
// MemberMenu, or the Admin panel) must NOT also get the public marketing
// Navbar/Footer — otherwise the public Navbar's fixed hamburger button
// visually stacks on top of the member area's three-dot menu button.
const HIDE_CHROME_PREFIXES = ["/dashboard-member", "/admin"];

function shouldHideChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDE_CHROME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;
  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;
  return <Footer />;
}
