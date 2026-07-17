"use client";

import { useMemo, useState } from "react";
import { BookMarked, Search } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";

const TERMS: { term: string; def: string }[] = [
  { term: "Pip", def: "Satuan terkecil pergerakan harga pada pasangan mata uang, umumnya desimal keempat (0.0001)." },
  { term: "Lot", def: "Satuan ukuran volume transaksi trading. 1 lot standar setara 100.000 unit mata uang dasar." },
  { term: "Leverage", def: "Fasilitas pinjaman modal dari broker yang memperbesar daya beli/jual trader, misalnya 1:100." },
  { term: "Margin", def: "Sejumlah dana yang perlu disetor sebagai jaminan untuk membuka posisi trading dengan leverage." },
  { term: "Spread", def: "Selisih antara harga beli (ask) dan harga jual (bid) suatu instrumen." },
  { term: "Bid/Ask", def: "Bid adalah harga tertinggi yang mau dibayar pembeli; Ask harga terendah yang mau diterima penjual." },
  { term: "Stop Loss", def: "Order otomatis untuk menutup posisi rugi pada level harga tertentu guna membatasi kerugian." },
  { term: "Take Profit", def: "Order otomatis untuk menutup posisi profit pada level harga target yang ditentukan." },
  { term: "Bullish", def: "Kondisi pasar yang cenderung bergerak naik atau sentimen optimis terhadap kenaikan harga." },
  { term: "Bearish", def: "Kondisi pasar yang cenderung bergerak turun atau sentimen pesimis terhadap harga." },
  { term: "Support", def: "Area harga di mana tekanan beli cenderung menahan penurunan harga lebih lanjut." },
  { term: "Resistance", def: "Area harga di mana tekanan jual cenderung menahan kenaikan harga lebih lanjut." },
  { term: "Candlestick", def: "Format visual pergerakan harga yang menampilkan open, high, low, dan close dalam satu periode." },
  { term: "Fibonacci Retracement", def: "Alat analisis teknikal berbasis rasio Fibonacci untuk memprediksi area koreksi harga." },
  { term: "Moving Average", def: "Indikator rata-rata pergerakan harga dalam periode tertentu untuk melihat arah tren." },
  { term: "RSI", def: "Relative Strength Index, indikator momentum yang mengukur kondisi jenuh beli (overbought) atau jenuh jual (oversold)." },
  { term: "MACD", def: "Moving Average Convergence Divergence, indikator untuk melihat momentum dan perubahan arah tren." },
  { term: "Drawdown", def: "Penurunan nilai ekuitas akun dari titik tertinggi sebelumnya, biasanya dinyatakan dalam persentase." },
  { term: "Equity", def: "Nilai akun trading secara real-time, termasuk profit/rugi dari posisi yang masih terbuka." },
  { term: "Balance", def: "Saldo akun trading tanpa memperhitungkan posisi yang masih berjalan." },
  { term: "Swap", def: "Biaya atau bunga yang dikenakan/diterima akibat menahan posisi trading hingga melewati hari berikutnya." },
  { term: "Slippage", def: "Selisih antara harga order yang diminta dengan harga eksekusi aktual, umum terjadi saat volatilitas tinggi." },
  { term: "Scalping", def: "Gaya trading jangka sangat pendek dengan target profit kecil namun frekuensi transaksi tinggi." },
  { term: "Swing Trading", def: "Gaya trading dengan menahan posisi dari beberapa hari hingga beberapa minggu mengikuti ayunan tren." },
  { term: "Day Trading", def: "Gaya trading yang membuka dan menutup posisi dalam satu hari perdagangan yang sama." },
  { term: "Order Block", def: "Area candle terakhir sebelum pergerakan impulsif, dianggap mencerminkan aktivitas smart money." },
  { term: "Liquidity", def: "Ketersediaan volume order beli/jual pada level harga tertentu yang sering diincar pergerakan harga." },
  { term: "Breakout", def: "Pergerakan harga yang menembus level support/resistance dengan momentum kuat." },
  { term: "Fakeout", def: "Pergerakan breakout palsu yang kembali berbalik arah setelah menembus level kunci." },
  { term: "Divergence", def: "Ketidaksesuaian arah antara pergerakan harga dan indikator, sering menjadi sinyal pembalikan tren." },
  { term: "Trend Line", def: "Garis yang menghubungkan titik-titik harga untuk mengidentifikasi arah dan kekuatan tren." },
  { term: "Chart Pattern", def: "Formasi pergerakan harga berulang yang digunakan untuk memprediksi pergerakan selanjutnya." },
  { term: "Head and Shoulders", def: "Pola pembalikan tren berbentuk tiga puncak dengan puncak tengah lebih tinggi." },
  { term: "Double Top/Bottom", def: "Pola pembalikan tren dengan dua puncak atau dua lembah pada level harga yang hampir sama." },
  { term: "Fair Value Gap", def: "Celah ketidakseimbangan harga pada tiga candle berurutan yang berpotensi diisi kembali oleh harga." },
  { term: "Market Structure", def: "Rangkaian pola higher high/higher low (uptrend) atau lower high/lower low (downtrend) pada chart." },
  { term: "Risk Reward Ratio", def: "Perbandingan antara potensi kerugian dan potensi keuntungan dalam satu transaksi." },
  { term: "Position Sizing", def: "Perhitungan besar volume/lot trading berdasarkan toleransi risiko dan modal yang dimiliki." },
  { term: "Correlation", def: "Hubungan pergerakan antara dua instrumen, bisa positif (searah) atau negatif (berlawanan arah)." },
  { term: "Volatility", def: "Ukuran seberapa besar dan cepat fluktuasi harga suatu instrumen dalam periode waktu tertentu." },
  { term: "Fundamental Analysis", def: "Analisis berbasis data ekonomi, kebijakan moneter, dan berita untuk memprediksi pergerakan harga." },
  { term: "Technical Analysis", def: "Analisis berbasis pola harga historis, chart, dan indikator untuk memprediksi pergerakan harga." },
  { term: "Sentiment Analysis", def: "Analisis berdasarkan persepsi dan psikologi pelaku pasar secara kolektif." },
  { term: "Central Bank", def: "Bank sentral suatu negara yang menentukan kebijakan moneter, termasuk suku bunga acuan." },
  { term: "Interest Rate", def: "Suku bunga acuan yang ditetapkan bank sentral, berpengaruh besar terhadap nilai tukar mata uang." },
  { term: "Non-Farm Payroll", def: "Data ketenagakerjaan bulanan Amerika Serikat yang menjadi salah satu rilis ekonomi paling berdampak pada USD." },
  { term: "CPI", def: "Consumer Price Index, indikator inflasi berdasarkan perubahan harga barang dan jasa konsumen." },
];

export default function GlosariumPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TERMS;
    return TERMS.filter(
      (t) => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <BookMarked size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Kamus Forex / Glosarium
            </h1>
          </div>
        </div>

        <div className="relative mt-6 max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah trading..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-electric/50"
          />
        </div>

        <p className="mt-3 text-xs text-white/40">
          Menampilkan {filtered.length} dari {TERMS.length} istilah
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <GlassCard key={t.term} className="p-5">
              <p className="font-semibold text-white">{t.term}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{t.def}</p>
            </GlassCard>
          ))}
          {filtered.length === 0 && (
            <GlassCard className="col-span-full p-8 text-center text-sm text-white/50">
              Istilah tidak ditemukan.
            </GlassCard>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
