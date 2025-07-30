/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#1a1a1a',
        orchid: '#b10dc9',
        cyan: '#00ffff'
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}