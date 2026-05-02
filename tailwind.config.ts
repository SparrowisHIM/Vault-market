import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          ink: "var(--vault-ink)",
          graphite: "var(--vault-graphite)",
          steel: "var(--vault-steel)",
          paper: "var(--vault-paper)",
          acrylic: "var(--vault-acrylic)",
          registry: "var(--vault-registry)",
          amber: "var(--vault-amber)",
          verified: "var(--vault-verified)",
        },
      },
      boxShadow: {
        slab: "var(--shadow-slab)",
        "slab-hover": "var(--shadow-slab-hover)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
