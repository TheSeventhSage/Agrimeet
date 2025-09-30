/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (green)
        brand: {
          50: '#F7F9F0',
          100: '#F1F3E5',
          200: '#D8E6C5',
          300: '#BFD9A5',
          400: '#A6CC85',
          500: '#71CB2A',
          600: '#83C541',
          700: '#5AA321',
          800: '#003024',
          900: '#001F18',
        },
        // Sidebar theme colors (darker green variations)
        sidebar: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16", // Very dark green for sidebar background
        },
        // Legacy orange colors (for backward compatibility)
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.06)",
        "soft-lg": "0 20px 40px rgba(0,0,0,.08)"
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    },
  },
  plugins: [],
}
