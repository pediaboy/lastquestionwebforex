import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          black: "#040608",
          navy: "#070c17",
          navy2: "#0b1224",
        },
        electric: {
          DEFAULT: "#2f6bff",
          light: "#5b8bff",
          dark: "#1a3fb8",
        },
        neon: {
          DEFAULT: "#3ec8ff",
          soft: "#7fe0ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-sora)"],
      },
      backgroundImage: {
        "grid-glow": "radial-gradient(circle at 50% 0%, rgba(62,200,255,0.15), transparent 60%)",
        "hero-gradient": "linear-gradient(180deg, #040608 0%, #070c17 50%, #040608 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(62,200,255,0.25)",
        "glow-strong": "0 0 80px rgba(62,200,255,0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        gradientMove: "gradientMove 8s ease infinite",
        fadeInUp: "fadeInUp 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
