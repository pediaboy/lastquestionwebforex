import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analisa Market",
  description:
    "Analisis harian, weekly outlook, dan market review Forex, Gold, serta Crypto dari LASTQUESTION FOREX. Chart realtime TradingView.",
};

export default function AnalisaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
