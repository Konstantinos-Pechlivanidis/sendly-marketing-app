import { defineConfig } from '@tailwindcss/postcss';

export default defineConfig({
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#64D3C1",
        secondary: "#1C7B7B",
        deep: "#004E47",
        neutral: "#D9B88C",
        accent: "#E27D43",
        danger: "#8A3E2E",
        surface: "#FFFFFF",
        background: "#F8F8F8",
        border: "rgba(0, 0, 0, 0.1)",
        muted: "rgba(0, 0, 0, 0.05)",
        ring: "#64D3C1",
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "24px",
        "2xl": "28px",
      },
      spacing: {
        "4pt": "4px",
        "8pt": "8px",
        "12pt": "12px",
        "16pt": "16px",
        "20pt": "20px",
        "24pt": "24px",
        "32pt": "32px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.08)",
        elevated: "0 4px 12px rgba(0,0,0,0.12)",
      },
      transitionProperty: {
        'colors-opacity-transform': 'background-color, border-color, color, fill, stroke, opacity, transform',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
});


