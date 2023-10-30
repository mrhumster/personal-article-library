/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
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

