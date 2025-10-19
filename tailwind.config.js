import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/**/*.{ts,tsx}",
    "index.html",
    "node_modules/flowbite-react/**/*.js",
    "node_modules/flowbite/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        // lấy giá trị lớn nhất từ cả hai
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // --- từ file 1 ---
        "magenta-primary": "#C400FF",
        "magenta-secondary": "#7F00FF",
        "magenta-light": "#510A6E",
        "magenta-lighter": "#510A6E",
        "magenta-lightest": "#530972",

        "violet-dark": "#2D0A31",
        "violet-darker": "#1A001F",

        "glass-white": "rgba(255,255,255,0.08)",
        "glass-white-10": "rgba(255,255,255,0.10)",
        "glass-white-20": "rgba(255,255,255,0.20)",
        "glass-border": "rgba(255,255,255,0.12)",

        "azure-84": "rgba(255,255,255,0.84)",
        "azure-65": "rgba(255,255,255,0.65)",

        success: "#22C55E",
        experience: "#FACC15",
        "experience-dark": "#EAB308",

        difficulty: {
          basic: "#22C55E",
          intermediate: "#FACC15",
          advanced: "#EF4444",
        },

        lozo: {
          dark: "#0D0D0D",
          purple: "#A10EA4",
          "purple-dark": "#48084A",
          "purple-light": "#E310D5",
          "form-bg": "#281F28",
          "form-mid": "#4B1447",
          green: "#084A1A",
          primary: "#C400FF",
          secondary: "#7F00FF",
          darker: "#1A001F",
        },

        // --- từ file 2 ---
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        slate: {
          850: "#1e293b",
          875: "#1a202c",
          900: "#0f172a",
        },
        violet: {
          56: "#9333EA",
          65: "#A855F7",
          85: "#d8b4fe",
          75: "#c084fc",
        },
        rose: {
          51: "#DB2777",
          60: "#EC4899",
        },
        azure: {
          17: "#1F2937",
          27: "#334155",
          65: "#9ca3af",
          68: "#60a5fa",
          84: "#d1d5db",
        },
        "spring-green": {
          36: "#16A34A",
          30: "#059669",
          58: "#4ade80",
        },
        red: {
          71: "#F87171",
        },
        yellow: {
          53: "#FACC15",
          47: "#EAB308",
        },
        orange: {
          40: "#CA8A04",
          48: "#EA580C",
          53: "#F97316",
        },
        "red-71": "#f87171",
        "rose-70": "#f472b6",
        brand: {
          primary: "#A10EA4",
          secondary: "#E310D5",
        },
        lozoExtra: {
          purple: {
            100: "#A10EA4",
            200: "#A855F7",
            300: "#C084FC",
            400: "#EC4899",
          },
          pink: "#E310D5",
          dark: {
            primary: "#5C065E",
            secondary: "#281F28",
            tertiary: "#4B1447",
          },
          gray: {
            100: "#D1D5DB",
            200: "#9CA3AF",
            300: "rgba(255, 255, 255, 0.05)",
            400: "rgba(255, 255, 255, 0.10)",
            500: "rgba(0, 0, 0, 0.20)",
          },
          green: "#4ADE80",
          blue: "#60A5FA",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to right, #C400FF, #7F00FF)",
        "page-gradient":
          "linear-gradient(to bottom, #140018, #1A0020, #0A000D)",
        "footer-gradient":
          "linear-gradient(to bottom right, #E879F9, rgba(45,10,49,0.3), #000000)",

        "gradient-primary":
          "linear-gradient(90deg, hsl(var(--purple-600)) 0%, hsl(var(--pink-600)) 100%)",
        "gradient-secondary":
          "linear-gradient(90deg, hsl(var(--orange-500)) 0%, hsl(var(--red-500)) 100%)",
        "gradient-primary-subtle":
          "linear-gradient(90deg, rgba(147, 51, 234, 0.30) 0%, rgba(219, 39, 119, 0.20) 100%)",
        "gradient-card":
          "linear-gradient(90deg, hsl(var(--slate-600)) 0%, hsl(var(--slate-700)) 100%)",
        "lozo-gradient":
          "linear-gradient(135deg, #111827 0%, #581C87 50%, #4C1D95 100%)",
        "lozo-button": "linear-gradient(90deg, #A855F7 0%, #EC4899 100%)",
        "lozo-shield": "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        "bank-gothic": [
          "BankGothic Md BT",
          "Impact",
          "Bebas Neue",
          "Arial Black",
          "Helvetica",
          "sans-serif",
        ],
        chakra: ["Chakra Petch", "Roboto", "system-ui", "sans-serif"],
        crimson: ["Crimson Text", "Times New Roman", "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        roboto: ["Roboto", "system-ui", "sans-serif"],
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideup: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        slide: "slide 5s linear infinite",
        slideup: "slide-up 0.5s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
  mode: "jit",
};
