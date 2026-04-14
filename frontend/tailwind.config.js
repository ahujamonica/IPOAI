/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a1a',
          light: '#f8f9fa',
        },
        risk: {
          low: '#10b981', // Emerald 500
          medium: '#f59e0b', // Amber 500
          high: '#ef4444', // Red 500
        }
      }
    },
  },
  plugins: [],
}