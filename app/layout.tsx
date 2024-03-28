import "./globals.css";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";

import { Inter, Roboto } from "next/font/google";
import Script from "next/script";

import type { Metadata } from "next";
import Navbar from "./components/Navbar";

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const metadata: Metadata = {
	title: "Irys Provenance Toolkit",
	description: "UI toolkit to kickstart your next project",
};

const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

	return (
		<html lang="en" className={`${roboto.className} bg-background relative`}>
			{GTM_ID && (
				<Script id="google-tag-manager" strategy="afterInteractive">
					{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
				</Script>
			)}
			<body className={roboto.className}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
