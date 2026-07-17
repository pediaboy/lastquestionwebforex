"use client";

import { useMemo, useState } from "react";
import { PiggyBank } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";

const PAIRS = [
  { label: "XAU/USD", value: "XAUUSD", pipValuePerLot: 10, pipSize: 0.1 },
  { label: "EUR/USD", value: "EURUSD", pipValuePerLot: 10, pipSize: 0.0001 },
  { label: "GBP/USD", value: "GBPUSD", pipValuePerLot: 10, pipSize: 0.0001 },
  { label: "USD/JPY", value: "USDJPY", pipValuePerLot: 9.09, pipSize: 0.01 },
  { label: "GBP/JPY", value: "GBPJPY", pipValuePerLot: 9.09, pipSize: 0.01 },
  { label: "BTC/USD", value: "BTCUSD", pipValuePerLot: 1, pipSize: 1 },
];

export default function KalkulatorProfitPage() {
  const [pairValue, setPairValue] = useState(PAIRS[0].value);
  const [direction, setDirection] = useState<"BUY" | "SELL">("BUY");
  const [entryPrice, setEntryPrice] = useState("2350");
  const [exitPrice, setExitPrice] = useState("2360");
  const [lotSize, setLotSize] = useState("0.10");

  const pair = PAIRS.find((p) => p.value === pairValue) || PAIRS[0];

  const result = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const lot = parseFloat(lotSize) || 0;

    const priceDiff = direction === "BUY" ? exit - entry : entry - exit;
    const pips = priceDiff / pair.pipSize;
    const profit = pips * pair.pipValuePerLot * lot;

    return { pips, profit };
  }, [entryPrice, exitPrice, direction, lotSize, pair]);

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50";

  const isProfit = result.profit >= 0;

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <PiggyBank size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Kalkulator Trading</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Kalkulator Profit & Loss
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-white/55">
          Simulasikan potensi profit atau loss dari sebuah transaksi sebelum atau sesudah dieksekusi.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard glow className="p-6">
            <h2 className="font-display text-base font-semibold text-white">Input</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Pasangan Mata Uang
                </label>
                <select value={pairValue} onChange={(e) => setPairValue(e.target.value)} className={inputClass}>
                  {PAIRS.map((p) => (
                    <option key={p.value} value={p.value} className="bg-base-black">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Arah Posisi
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection("BUY")}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold ${
                      direction === "BUY"
                        ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("SELL")}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold ${
                      direction === "SELL"
                        ? "border-red-400/50 bg-destructive/10 text-red-400"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Harga Entry
                </label>
                <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} type="number" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Harga Exit
                </label>
                <input value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} type="number" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Lot Size
                </label>
                <input value={lotSize} onChange={(e) => setLotSize(e.target.value)} type="number" step="0.01" className={inputClass} />
              </div>
            </div>
          </GlassCard>

          <GlassCard glow className="h-fit p-6">
            <h2 className="font-display text-base font-semibold text-white">Hasil Simulasi</h2>
            <div className="mt-6 text-center">
              <p className="text-xs uppercase tracking-widest text-white/40">Estimasi Profit / Loss</p>
              <p
                className={`mt-2 font-display text-4xl font-bold ${
                  isProfit ? "text-emerald-400" : "text-destructive"
                }`}
              >
                {isProfit ? "+" : ""}${result.profit.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-white/45">
                Selisih {Math.abs(result.pips).toFixed(1)} pips ({direction})
              </p>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-white/40">
              Perhitungan bersifat estimasi, gunakan sebagai panduan awal, selalu verifikasi dengan platform trading Anda.
            </p>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
