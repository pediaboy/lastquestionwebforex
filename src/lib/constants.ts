export const SITE = {
  name: "LASTQUESTION FOREX",
  shortName: "LASTQUESTION",
  tagline: "Trading Forex & Crypto Sejak 2021",
  url: "https://lastquestionwebforex.vercel.app",
  foundedYear: 2021,
  description:
    "LASTQUESTION FOREX adalah komunitas edukasi trading yang membantu trader memahami Forex dan Crypto melalui analisis pasar, manajemen risiko, psikologi trading, serta pembelajaran yang terstruktur.",
  whatsappRaw: "089663874700",
  whatsappIntl: "6289663874700",
  telegramBot: "https://t.me/LASTQUESTIONVIP_bot",
  instagramHandle: "@lastquestion.co",
  instagramUrl: "https://instagram.com/lastquestion.co",
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsappIntl}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "VIP", href: "/vip" },
  { label: "Gratis", href: "/gratis" },
  { label: "Analisa", href: "/analisa" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/kontak" },
];

export const PRICING = {
  normal: 500000,
  promo: 250000,
  renew: 80000,
};

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const VIP_BENEFITS = [
  "Analisa Harian",
  "Analisa Mingguan",
  "Watchlist Forex & Crypto",
  "Update Market Real-time",
  "Market Outlook",
  "Materi Trading Terstruktur",
  "Komunitas Premium",
  "Support Prioritas",
];

export const BENEFITS = [
  "Analisis Harian",
  "Weekly Outlook",
  "Market Review",
  "Trading Education",
  "Risk Management",
  "Money Management",
  "Trading Psychology",
  "Watchlist",
  "Live Discussion",
  "Komunitas Telegram",
  "Update Market",
  "Materi Trading",
];

export const FOCUS_AREAS = [
  "Forex",
  "Crypto",
  "Gold",
  "Bitcoin",
  "Ethereum",
  "Price Action",
  "Market Structure",
  "Supply & Demand",
  "Liquidity",
  "Risk Management",
  "Money Management",
  "Trading Psychology",
  "Fundamental Analysis",
  "News Trading",
  "Swing Trading",
  "Scalping",
  "Intraday",
];

export const BROKER_IFRAME_SRC =
  "https://ma.valetax.com/embed/register/block/Wx7aDnkGc1qc%2Fvw4nQRo2iUVqM6yrg%2Bto38T2btOGOXt%2Bm1CEd2IBn83c26UII77f67NdAs0AQ4lpigT24UVQ2FQxz6r67jvgCUWt5eNG4Cb%2FpUyD2OOWzmsHhAxkbf5?lang=id&background=dark";

export function isVipStatus(status?: string | null) {
  return status === "vip" || status === "admin";
}

// Chart height presets (width stays fluid/100%), labeled by familiar
// video-resolution shorthand so it's easy to pick a size that fits the screen.
export const CHART_SIZE_OPTIONS = [
  { label: "540p", sublabel: "Ringkas", height: 480 },
  { label: "720p", sublabel: "Standar", height: 650 },
  { label: "900p", sublabel: "Besar", height: 820 },
  { label: "1080p", sublabel: "Full", height: 980 },
];
