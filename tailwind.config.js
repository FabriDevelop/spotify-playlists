module.exports = {
  content: ["./pages/**/*.{js,ts,jsx}", "./components/**/*.{js,ts,jsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}
