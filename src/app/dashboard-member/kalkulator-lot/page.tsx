"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";

const PAIRS = [
  { label: "XAU/USD", value: "XAUUSD", pipValuePerLot: 10, contractSize: 100, pipSize: 0.1 },
  { label: "EUR/USD", value: "EURUSD", pipValuePerLot: 10, contractSize: 100000, pipSize: 0.0001 },
  { label: "GBP/USD", value: "GBPUSD", pipValuePerLot: 10, contractSize: 100000, pipSize: 0.0001 },
  { label: "USD/JPY", value: "USDJPY", pipValuePerLot: 9.09, contractSize: 100000, pipSize: 0.01 },
  { label: "GBP/JPY", value: "GBPJPY", pipValuePerLot: 9.09, contractSize: 100000, pipSize: 0.01 },
  { label: "BTC/USD", value: "BTCUSD", pipValuePerLot: 1, contractSize: 1, pipSize: 1 },
];

const LEVERAGES = [100, 200, 500, 1000];

export default function KalkulatorLotPage() {
  const [balance, setBalance] = useState("1000");
  const [riskPct, setRiskPct] = useState("1");
  const [slPips, setSlPips] = useState("20");
  const [pairValue, setPairValue] = useState(PAIRS[0].value);
  const [leverage, setLeverage] = useState(LEVERAGES[0]);

  const pair = PAIRS.find((p) => p.value === pairValue) || PAIRS[0];

  const result = useMemo(() => {
    const bal = parseFloat(balance) || 0;
    const risk = parseFloat(riskPct) || 0;
    const sl = parseFloat(slPips) || 0;

    const riskAmount = bal * (risk / 100);
    const lotSize = sl > 0 ? riskAmount / (sl * pair.pipValuePerLot) : 0;
    const requiredMargin = (lotSize * pair.contractSize) / leverage;

    return {
      riskAmount,
      lotSize: Math.max(0, lotSize),
      requiredMargin: Math.max(0, requiredMargin),
    };
  }, [balance, riskPct, slPips, pair, leverage]);

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50";

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <Calculator size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Kalkulator Trading</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Kalkulator Lot & Margin
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-white/55">
          Hitung ukuran lot ideal dan margin yang dibutuhkan berdasarkan toleransi risiko akunmu.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard glow className="p-6">
            <h2 className="font-display text-base font-semibold text-white">Input</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Saldo Akun (USD)
                </label>
                <input value={balance} onChange={(e) => setBalance(e.target.value)} type="number" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Risiko per Transaksi (%)
                </label>
                <input value={riskPct} onChange={(e) => setRiskPct(e.target.value)} type="number" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Stop Loss (Pips)
                </label>
                <input value={slPips} onChange={(e) => setSlPips(e.target.value)} type="number" className={inputClass} />
              </div>
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
                  Leverage
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className={inputClass}
                >
                  {LEVERAGES.map((lv) => (
                    <option key={lv} value={lv} className="bg-base-black">
                      1:{lv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow className="h-fit p-6">
            <h2 className="font-display text-base font-semibold text-white">Hasil Perhitungan</h2>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Jumlah Risiko</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  ${result.riskAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Rekomendasi Lot Size</p>
                <p className="mt-1 font-display text-2xl font-bold text-neon">
                  {result.lotSize.toFixed(2)} Lot
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Margin Dibutuhkan</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  ${result.requiredMargin.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-white/40">
              Perhitungan bersifat estimasi, gunakan sebagai panduan awal, selalu verifikasi dengan platform trading Anda.
            </p>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
