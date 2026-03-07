/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#20B2AA',
          dark: '#1C9E97',
          light: '#5CD6D0',
        },
        surface: {
          bg: '#0A1212',
          1: '#0F1A1A',
          2: '#152222',
          3: '#1C2E2E',
        },
        border: { DEFAULT: '#1A302E' },
        text: {
          primary: '#B2D7D2',
          secondary: '#7A9E99',
          muted: '#436660',
          bright: '#E0F0ED',
        },
        profit: '#34D399',
        loss: '#F87171',
        caution: '#FBBF24',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
