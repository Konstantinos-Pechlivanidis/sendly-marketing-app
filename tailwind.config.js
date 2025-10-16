/** @type {import('tailwindcss').Config} */
export default {
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
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.05)",
        card: "0 2px 4px rgba(0,0,0,0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "20px",
        xl: "24px",
      },
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
      },
    },
  },
  plugins: [],
};


