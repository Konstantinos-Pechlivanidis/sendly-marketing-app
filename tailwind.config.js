/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/routes/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          disabled: "var(--primary-disabled)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--secondary-hover)",
          active: "var(--secondary-active)",
          disabled: "var(--secondary-disabled)",
        },
        deep: {
          DEFAULT: "var(--color-deep)",
          hover: "var(--deep-hover)",
          active: "var(--deep-active)",
          disabled: "var(--deep-disabled)",
        },
        neutral: {
          DEFAULT: "var(--color-neutral)",
          hover: "var(--neutral-hover)",
          active: "var(--neutral-active)",
          disabled: "var(--neutral-disabled)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
          disabled: "var(--accent-disabled)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          hover: "var(--danger-hover)",
          active: "var(--danger-active)",
          disabled: "var(--danger-disabled)",
        },
        surface: "var(--surface)",
        background: "var(--background)",
        border: "var(--border)",
        muted: "var(--muted)",
        ring: "var(--ring)",
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
};


