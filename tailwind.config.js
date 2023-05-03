/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light_yellow: "#FFF28B",
        light_pink: "#FFCBF7",
        light_gray: "#E7E7E7"
      }
    }
  },
  plugins: [],
}

