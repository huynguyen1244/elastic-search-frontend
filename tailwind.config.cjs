/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Vite index.html
    "./src/**/*.{js,ts,jsx,tsx}", // tất cả file JS/TS/JSX/TSX trong src
  ],
  theme: {
    extend: {}, // bạn có thể thêm colors, fonts, spacing, ...
  },
  plugins: [],
};
