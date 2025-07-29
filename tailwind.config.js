/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        orchid: "#DA44FF",
        cyan: "#38E8E1",
        carbon: "#111111"
      }
    }
  },
  plugins: []
}