/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1120',
        deepblue: '#1e3a8a',
        mutedgold: '#c5a028',
      },
    },
  },
  plugins: [],
}
