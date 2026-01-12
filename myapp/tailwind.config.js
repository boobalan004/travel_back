/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFA500', // Orange
        dark: '#1A2340', // Dark blue
        lightBg: '#FEFAF0', // Light cream
        gray: '#5E6282',
        lightGray: '#F5F5F5',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
