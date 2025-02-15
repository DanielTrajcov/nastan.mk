import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        'svh': '100svh',
        'lvh': '100lvh',
        'dvh': '100dvh',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent:{
          DEFAULT:"#f64060",
          hover:"#f64070",
        },
        accent2:{
          DEFAULT:"#00798a",
        }
      },
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: ["winter"],
  },
};
export default config;
