import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | LASTQUESTION FOREX",
  description: "Kebijakan privasi dan perlindungan data pengguna LASTQUESTION FOREX.",
};

const SECTIONS = [
  {
    title: "1. Data yang Kami Kumpulkan",
    body: [
      "Saat Anda mendaftar, kami mengumpulkan data dasar seperti nama lengkap, alamat email, dan nomor WhatsApp/telepon.",
      "Kami juga dapat mencatat data aktivitas penggunaan Layanan seperti riwayat login dan interaksi dengan fitur Dashboard Member untuk keperluan keamanan dan peningkatan layanan.",
      "Data transaksi/registrasi broker yang Anda kirimkan untuk verifikasi VIP disimpan untuk keperluan validasi keanggotaan.",
    ],
  },
  {
    title: "2. Tujuan Penggunaan Data",
    body: [
      "Data digunakan untuk mengelola akun keanggotaan, memverifikasi status VIP, mengirimkan notifikasi penting (sinyal, pengumuman), dan memberikan dukungan melalui WhatsApp/Telegram.",
      "Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan Anda.",
    ],
  },
  {
    title: "3. Penyimpanan & Keamanan Data",
    body: [
      "Data disimpan menggunakan infrastruktur penyedia database cloud tepercaya dengan enkripsi dan kontrol akses yang ketat.",
      "Kami menerapkan langkah-langkah keamanan teknis dan administratif yang wajar untuk melindungi data dari akses tidak sah, kehilangan, atau penyalahgunaan.",
      "Meskipun demikian, tidak ada sistem transmisi data melalui internet yang sepenuhnya bebas risiko, dan kami tidak dapat menjamin keamanan absolut.",
    ],
  },
  {
    title: "4. Hak Pengguna",
    body: [
      "Anda berhak mengakses, memperbarui, atau meminta koreksi data pribadi Anda kapan saja melalui halaman Profil & Akun Saya di Dashboard Member.",
      "Anda berhak meminta penghapusan akun dan data pribadi Anda dengan menghubungi Admin resmi kami melalui WhatsApp.",
    ],
  },
  {
    title: "5. Kebijakan Cookie",
    body: [
      "Website kami dapat menggunakan cookie dasar untuk menjaga sesi login Anda tetap aktif dan meningkatkan pengalaman penggunaan.",
      "Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda, namun hal ini dapat memengaruhi fungsi tertentu pada Layanan.",
    ],
  },
  {
    title: "6. Perubahan Kebijakan",
    body: [
      "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk menyesuaikan dengan perubahan layanan atau ketentuan hukum yang berlaku.",
      "Perubahan signifikan akan diinformasikan melalui kanal resmi kami.",
    ],
  },
];

export default function KebijakanPrivasiPage() {
  const today = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });

  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Legal</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
                Kebijakan Privasi
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
            Ingin menghapus data Anda?{" "}
            <a
              href={waLink("Halo Admin, saya ingin mengajukan penghapusan data pribadi saya di LASTQUESTION FOREX.")}
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
