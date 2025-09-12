import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0A8A80",
          tealDark: "#0B3F44",
          coral: "#E45C48",
          gold: "#D8AE4F",
          grayBg: "#F5F6F7",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        brand: "0 12px 28px rgba(11,63,68,0.18)",
      },
      backgroundImage: {
        "brand-hero":
          "radial-gradient(800px 400px at 10% -10%, rgba(14,138,128,0.10), transparent 55%), radial-gradient(700px 360px at 95% -15%, rgba(228,92,72,0.10), transparent 55%), linear-gradient(180deg, #F5F6F7 0%, #FFFFFF 100%)",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-roboto)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
