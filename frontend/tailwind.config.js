/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c1c1ff',
          300: '#a1a1ff',
          400: '#6262ff',
          500: '#2323ff',
          600: '#0404E4',
          700: '#0303B3',
          800: '#020282',
          900: '#010151',
        },
        secondary: '#000000',
        neutral: '#cfd1d1',
      },
      fontFamily: {
        trajan: ['Crimson Pro', 'serif'],
      },
    },
  },
  plugins: [],
};
