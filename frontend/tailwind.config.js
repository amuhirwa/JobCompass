/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0065FF',
        backgroundWhite: '#FFFFFF',
        softGray: '#F4F5F7',
        textBlack: '#000000',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
