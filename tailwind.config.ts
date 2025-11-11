import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#E6EEF5",
        primary: "#1A365D",
        accent: "#6B8EAE",
        whitespace: "#F7FAFC",
        text: "#2D3748",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Lato", "sans-serif"],
        button: ["Nunito Sans", "sans-serif"],
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
      },
      transitionTimingFunction: {
        "in-out": "ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
