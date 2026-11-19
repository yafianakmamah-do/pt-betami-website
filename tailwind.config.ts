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
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0ea5a4",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        palm: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0ea5a4",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        'palm-pattern': "radial-gradient(circle at 1px 1px, rgba(15, 118, 110, 0.08) 1px, transparent 0)",
        'hero-mesh': "radial-gradient(circle at 20% 20%, rgba(245,158,11,0.25), transparent 25%), radial-gradient(circle at 80% 10%, rgba(20,184,166,0.25), transparent 22%), linear-gradient(135deg, #0f766e 0%, #134e4a 55%, #0f172a 100%)",
      },
      boxShadow: {
        'soft': '0 10px 30px -12px rgba(15, 23, 42, 0.18)',
        'glow': '0 0 0 1px rgba(255,255,255,0.15), 0 20px 40px -20px rgba(20,184,166,0.6)',
      }
    },
  },
  plugins: [],
};

export default config;


