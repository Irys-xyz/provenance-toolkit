/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        colors: "background-color, border-color, color, fill, stroke",
      },
      transitionDuration: {
        500: "500ms",
      },
      transitionTimingFunction: {
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      fontFamily: {
        robotoMono: ["Roboto Mono", "monospace"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      colors: {
        background: "#FEF4EE",
        "background-contrast": "#005792",
        primary: "#D3D9EF",
        secondary: "#DBDEE9",
        text: "#0F0F0F",
      },
    },
  },
  plugins: [],
};
