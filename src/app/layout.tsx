import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar, ConditionalFooter } from "@/components/ConditionalChrome";
import LoadingScreen from "@/components/LoadingScreen";
import ParticleBackground from "@/components/ParticleBackground";
import { SITE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Trading Forex & Crypto Sejak 2021`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Forex",
    "Crypto",
    "Trading",
    "Edukasi Trading",
    "Komunitas Trading",
    "LASTQUESTION FOREX",
    "Analisa Forex",
    "Sinyal Trading",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE.url,
    title: `${SITE.name} — Trading Forex & Crypto Sejak 2021`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Trading Forex & Crypto Sejak 2021`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${sora.variable} relative min-h-screen overflow-x-hidden bg-hero-gradient font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.name,
              url: SITE.url,
              foundingDate: `${SITE.foundedYear}`,
              description: SITE.description,
              sameAs: [SITE.instagramUrl, SITE.telegramBot],
            }),
          }}
        />
        <LoadingScreen />
        <ParticleBackground />
        <ConditionalNavbar />
        <main className="relative z-10">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
