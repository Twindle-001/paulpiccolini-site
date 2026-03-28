import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1a1a1a",
          darker: "#0f0f0f",
          muted: "#6c7572",
          light: "#f5f5f3",
          accent: "#c9a96e",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", '"Playfair Display"', "Georgia", "serif"],
        body: ["var(--font-inter)", '"Inter"', '"Open Sans"', "sans-serif"],
      },
      letterSpacing: {
        menu: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
