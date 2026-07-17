import { Metadata } from "next";
import { FileText } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | LASTQUESTION FOREX",
  description: "Syarat dan ketentuan penggunaan layanan komunitas LASTQUESTION FOREX.",
};

const SECTIONS = [
  {
    title: "1. Definisi",
    body: [
      "\"Kami\", \"LASTQUESTION FOREX\", atau \"Komunitas\" merujuk pada layanan edukasi trading yang dikelola melalui website dan kanal Telegram/WhatsApp resmi.",
      "\"Member\" atau \"Anda\" merujuk pada setiap individu yang mendaftar dan menggunakan layanan, baik pada tingkatan Free maupun VIP.",
      "\"Layanan\" mencakup materi edukasi, analisis pasar, sinyal trading, kalkulator, jurnal trading, dan seluruh fitur yang tersedia di Dashboard Member.",
    ],
  },
  {
    title: "2. Ketentuan Keanggotaan",
    body: [
      "Pendaftaran akun mengharuskan Anda memberikan data yang benar dan aktif digunakan, termasuk email dan nomor WhatsApp.",
      "Status VIP diberikan setelah proses verifikasi registrasi broker dan/atau pembayaran keanggotaan berhasil dikonfirmasi oleh Admin.",
      "Kami berhak menangguhkan atau menghentikan akses akun yang terindikasi melakukan penyalahgunaan, berbagi akun ke pihak lain tanpa izin, atau melanggar ketentuan ini.",
    ],
  },
  {
    title: "3. Batasan Tanggung Jawab & Risiko Trading",
    body: [
      "LASTQUESTION FOREX adalah komunitas edukasi, BUKAN penasihat keuangan berlisensi, BUKAN broker, dan tidak mengelola dana member dalam bentuk apapun.",
      "Seluruh analisis, sinyal trading, dan materi edukasi yang diberikan bersifat informasional dan edukasional semata, BUKAN merupakan ajakan atau rekomendasi finansial yang mengikat.",
      "Trading di pasar Forex, Emas, dan Cryptocurrency mengandung risiko tinggi dan dapat mengakibatkan kerugian melebihi modal awal. Kinerja masa lalu tidak menjamin hasil di masa depan.",
      "Segala keputusan trading sepenuhnya menjadi tanggung jawab pribadi Member. Kami tidak bertanggung jawab atas kerugian finansial dalam bentuk apapun yang timbul dari penggunaan Layanan.",
    ],
  },
  {
    title: "4. Kebijakan Pembayaran & Refund",
    body: [
      "Biaya keanggotaan VIP dibayarkan melalui metode yang tercantum resmi di website atau diarahkan langsung oleh Admin.",
      "Karena sifat akses digital yang instan, seluruh pembayaran keanggotaan bersifat FINAL dan TIDAK DAPAT DIKEMBALIKAN (non-refundable) setelah akses VIP diaktifkan.",
      "Jika terjadi kesalahan sistem pada pihak kami yang menyebabkan akses tidak dapat digunakan, Member dapat mengajukan klaim melalui WhatsApp resmi untuk ditinjau secara kasus per kasus.",
    ],
  },
  {
    title: "5. Larangan Penggunaan",
    body: [
      "Dilarang menyebarluaskan, menjual kembali, atau membagikan materi, sinyal, dan konten eksklusif VIP kepada pihak yang tidak berhak tanpa izin tertulis dari kami.",
      "Dilarang menggunakan Layanan untuk tujuan ilegal, penipuan, atau aktivitas yang merugikan pihak lain.",
      "Dilarang melakukan tindakan yang mengganggu keamanan atau operasional sistem, termasuk namun tidak terbatas pada percobaan peretasan.",
    ],
  },
  {
    title: "6. Perubahan Ketentuan",
    body: [
      "Kami berhak mengubah, menambah, atau memperbarui Syarat & Ketentuan ini sewaktu-waktu sesuai kebutuhan operasional dan hukum yang berlaku.",
      "Perubahan akan berlaku efektif sejak dipublikasikan pada halaman ini. Penggunaan Layanan secara berkelanjutan dianggap sebagai persetujuan terhadap perubahan tersebut.",
    ],
  },
  {
    title: "7. Kontak",
    body: [
      "Untuk pertanyaan terkait Syarat & Ketentuan ini, silakan hubungi Admin resmi kami melalui WhatsApp.",
    ],
  },
];

export default function SyaratKetentuanPage() {
  const today = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });

  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Legal</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
                Syarat & Ketentuan
              </h1>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40">Terakhir diperbarui: {today}</p>

          <div className="mt-8 space-y-5">
            {SECTIONS.map((s) => (
              <GlassCard key={s.title} className="p-6 md:p-7">
                <h2 className="font-display text-base font-semibold text-white">{s.title}</h2>
                <div className="mt-3 space-y-2.5">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-white/60">
                      {p}
                    </p>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-white/45">
            Ada pertanyaan?{" "}
            <a
              href={waLink("Halo Admin, saya ingin bertanya soal Syarat & Ketentuan LASTQUESTION FOREX.")}
              target="_blank"
              className="text-neon underline underline-offset-4"
            >
              Hubungi Admin via WhatsApp
            </a>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
