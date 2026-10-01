/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        navy: { DEFAULT: "#132A4C" },
        sky: { DEFAULT: "#3FA9E0", light: "#8FCFF0" },
        royal: "#1B6FA8",
        steel: "#5E7A93",
        line: "#DCE7F0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: { blob: "62% 38% 55% 45% / 45% 40% 60% 55%" },
    },
  },
  plugins: [],
}
