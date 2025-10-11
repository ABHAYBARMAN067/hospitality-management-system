/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F6',
          100: '#FFEDEF',
          200: '#FFDBE0',
          300: '#FFB3C0',
          400: '#FF7B8B',
          500: '#EF4F5F',
          600: '#E03446',
          700: '#BE123C',
          800: '#D11823',
          900: '#4F191E',
        },
        secondary: '#14B8A6',
        accent: '#F59E0B',
        background: '#F9FAFB',
        card: '#FFFFFF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
