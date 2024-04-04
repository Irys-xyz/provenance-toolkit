import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		fontFamily: {
			robotoMono: ["Roboto Mono", "monospace"],
			satoshi: ["Satoshi", "sans-serif"],
		},
		extend: {
			colors: {
				background: "#FEF4EE",
				"background-contrast": "#005792",
				primary: "#D3D9EF",
				secondary: "#DBDEE9",
				text: "#0F0F0F",
				timberwolf: "#D8CFCA",
				seashell: "#FEF4EE",
				ghostWhite: "#EEF0F6",
				onyx: "#403F3E",
				smoky: "#0F0F0F",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: [
// 		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
// 		"./components/**/*.{js,ts,jsx,tsx,mdx}",
// 		"./app/**/*.{js,ts,jsx,tsx,mdx}",
// 	],
// 	theme: {
// 		extend: {
// 			transitionProperty: {
// 				colors: "background-color, border-color, color, fill, stroke",
// 			},
// 			transitionDuration: {
// 				500: "500ms",
// 			},
// 			transitionTimingFunction: {
// 				"ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
// 			},
// 			fontFamily: {
// 				robotoMono: ["Roboto Mono", "monospace"],
// 				satoshi: ["Satoshi", "sans-serif"],
// 			},
// 			colors: {
// 				background: "#FEF4EE",
// 				"background-contrast": "#005792",
// 				primary: "#D3D9EF",
// 				secondary: "#DBDEE9",
// 				text: "#0F0F0F",
// 				timberwolf: "#D8CFCA",
// 				seashell: "#FEF4EE",
// 				ghostWhite: "#EEF0F6",
// 				onyx: "#403F3E",
// 				smoky: "#0F0F0F",
// 			},
// 		},
// 	},
// 	plugins: [],
// };
