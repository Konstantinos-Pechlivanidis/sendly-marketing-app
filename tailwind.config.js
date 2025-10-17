/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        deep: "var(--color-deep)",
        neutral: "var(--color-neutral)",
        accent: "var(--color-accent)",
        danger: "var(--color-danger)",
        surface: "var(--surface)",
        background: "var(--background)",
        border: "var(--border)",
        muted: "var(--muted)",
        ring: "var(--ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      spacing: {
        "4pt": "var(--space-4pt)",
        "8pt": "var(--space-8pt)",
        "12pt": "var(--space-12pt)",
        "16pt": "var(--space-16pt)",
        "20pt": "var(--space-20pt)",
        "24pt": "var(--space-24pt)",
        "32pt": "var(--space-32pt)",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        elevated: "var(--shadow-elevated)",
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
};


