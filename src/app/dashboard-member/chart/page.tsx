"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import TradingViewChart from "@/components/TradingViewChart";

const SYMBOLS = [
  { label: "XAU/USD", value: "OANDA:XAUUSD" },
  { label: "EUR/USD", value: "OANDA:EURUSD" },
  { label: "GBP/USD", value: "OANDA:GBPUSD" },
  { label: "USD/JPY", value: "OANDA:USDJPY" },
  { label: "GBP/JPY", value: "OANDA:GBPJPY" },
  { label: "BTC/USD", value: "BINANCE:BTCUSDT" },
];

export default function MemberChartPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].value);

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <LineChart size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Chart Trading Realtime
            </h1>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {SYMBOLS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSymbol(s.value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                symbol === s.value
                  ? "border-electric/50 bg-electric/10 text-neon"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-5 w-full">
          <TradingViewChart symbol={symbol} height={820} />
        </div>
      </section>
    </PageTransition>
  );
}
