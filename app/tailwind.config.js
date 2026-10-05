/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "atkinson-regular": ["AtkinsonHyperlegible_400Regular"],
        "atkinson-bold": ["AtkinsonHyperlegible_700Bold"],
      },
    },
  },
  plugins: [],
};
