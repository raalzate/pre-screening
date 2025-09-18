import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Paleta de colores de Sofka
        sofka: {
          'blue': '#002C5E',
          'light-blue': '#0083B3',
          'orange': '#FF5C00',
          'gray': '#F3F4F6',
          'dark-gray': '#4B5563',
        },
        // Colores base de la aplicación mapeados a la paleta de Sofka
        border: "#E5E7EB", // Un gris muy claro para bordes sutiles
        input: "#E5E7EB",
        ring: "#0083B3", // Azul claro de Sofka
        background: "#F3F4F6", // Gris de Sofka para fondos
        foreground: "#4B5563", // Gris oscuro de Sofka para texto
        primary: {
          DEFAULT: "#002C5E", // Azul de Sofka
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FF5C00", // Naranja de Sofka
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#ef4444", // Rojo estándar de Tailwind para destructivo
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#d1d5db",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#0083B3", // Azul claro de Sofka
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#4b5563",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#4b5563",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;