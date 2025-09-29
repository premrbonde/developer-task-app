/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#A5B4FC',
        secondary: '#EC4899',
        'secondary-dark': '#F9A8D4',
        background: '#F9FAFB',
        'background-dark': '#111827',
        surface: '#FFFFFF',
        'surface-dark': '#1F2937',
        text: '#1F2937',
        'text-dark': '#F9FAFB',
        subtle: '#6B7280',
        'subtle-dark': '#9CA3AF',
        border: '#E5E7EB',
        'border-dark': '#374151',
      }
    },
  },
  plugins: [],
}