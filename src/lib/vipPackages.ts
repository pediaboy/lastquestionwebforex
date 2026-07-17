import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type VipPackage = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  tier: string;
  popular: boolean;
  features: string[];
};

const KEY = "forex_vip_packages";

export const DEFAULT_PACKAGES: VipPackage[] = [
  {
    id: "1",
    name: "VIP Reguler",
    price: 500000,
    duration_days: 30,
    tier: "Reguler",
    popular: false,
    features: [
      "Analisa Harian",
      "Watchlist Forex & Crypto",
      "Materi Trading Terstruktur",
      "Komunitas Premium",
    ],
  },
  {
    id: "2",
    name: "VIP Promo",
    price: 250000,
    duration_days: 30,
    tier: "Promo",
    popular: true,
    features: [
      "Analisa Harian",
      "Analisa Mingguan",
      "Watchlist Forex & Crypto",
      "Update Market Real-time",
      "Market Outlook",
      "Materi Trading Terstruktur",
      "Komunitas Premium",
      "Support Prioritas",
    ],
  },
  {
    id: "3",
    name: "VIP Renewal",
    price: 80000,
    duration_days: 30,
    tier: "Renewal",
    popular: false,
    features: ["Perpanjangan untuk Member Aktif", "Semua Benefit VIP Tetap Berjalan"],
  },
];

export async function getVipPackages(): Promise<VipPackage[]> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  const value = data?.value as VipPackage[] | undefined;
  return Array.isArray(value) && value.length > 0 ? value : DEFAULT_PACKAGES;
}

export async function saveVipPackages(packages: VipPackage[]) {
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: packages }, { onConflict: "key" });
}
