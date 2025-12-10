import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lounge: {
          bg: "#0f0a0a",
          card: "#1a1411",
          accent: "#c7a17a",
          soft: "#2a1f1a",
        },
      },
      boxShadow: {
        lounge: "0 20px 60px rgba(0,0,0,0.45)",
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [animate],
};

export default config;

