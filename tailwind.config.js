/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Figtree', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        night: '#07090f',
        panel: '#0d1320',
        electric: '#1d7fff',
        cyan: '#20f0ff',
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};
