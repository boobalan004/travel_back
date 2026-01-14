/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        "primary-light": "#3b82f6",
        secondary: "#0f766e",
        accent: "#f97316",
        "accent-light": "#fb923c",
        neutral: "#6b7280",
        "neutral-light": "#f3f4f6",
        "neutral-dark": "#1f2937",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        blob: "blob 7s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "scale-in": "scale-in 0.4s ease-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "25%": { transform: "translate(20px, -50px) scale(1.1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "75%": { transform: "translate(50px, 50px) scale(1.05)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.7)" },
          "50%": { boxShadow: "0 0 0 10px rgba(37, 99, 235, 0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
