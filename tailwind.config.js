/** @type {import('tailwindcss').Config} */
export default {
  prefix: "omnix-",
  important: "#omnix-root",
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

