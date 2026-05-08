import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        uga: {
          green: "#0b6b3a",
          dark: "#06150d",
          lime: "#d9f99d",
          mist: "#f3f8f1",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(6, 21, 13, 0.12)",
      },
    },
  },
  plugins: [forms],
};

export default config;
