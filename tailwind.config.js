/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'conectar-green': '#10B981',
        'conectar-dark': '#1F2937',
        'conectar-light': '#F3F4F6',
      },
      fontFamily: {
        'conectar': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
