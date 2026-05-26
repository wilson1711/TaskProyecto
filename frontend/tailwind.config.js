/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#050505',
          dark: '#0a0a0c',
          cyan: '#00f2ff',
          fuchsia: '#ff00ff',
          blue: '#0062ff',
          purple: '#bc13fe',
        }
      },
      boxShadow: {
        'cyber-cyan': '0 0 10px rgba(0, 242, 255, 0.3)',
        'cyber-fuchsia': '0 0 10px rgba(255, 0, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
