/** @type {import('tailwindcss').Config} */
const shadcnConfig = require("./tailwind.config.js")

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "neon-blue": "#00f3ff",
        "neon-purple": "#9d00ff",
        "neon-pink": "#ff00f5",
        "neon-green": "#00ff66",
        "dark-blue": "#0a0a20",
        "darker-blue": "#050518",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "aurora-gradient": "linear-gradient(to right, #9d00ff, #00f3ff, #00ff66, #ff00f5)",
      },
      animation: {
        "aurora-shift": "aurora-shift 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        wave: "wave 20s -3s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        "wave-slow": "wave 25s -2s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        "wave-slower": "wave 30s -1s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
      },
      keyframes: {
        "aurora-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(157, 0, 255, 0.7)" },
          "50%": { opacity: 0.7, boxShadow: "0 0 40px rgba(0, 243, 255, 0.9)" },
        },
        wave: {
          "0%": { transform: "translateX(0) translateZ(0) scaleY(1)" },
          "50%": { transform: "translateX(-25%) translateZ(0) scaleY(0.8)" },
          "100%": { transform: "translateX(-50%) translateZ(0) scaleY(1)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
