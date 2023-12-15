/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: false,
    files: [
    "./src/main.{html,ts,js,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./**/*.tsx"
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

