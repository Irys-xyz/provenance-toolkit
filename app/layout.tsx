import "./globals.css";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";

import { Inter, Roboto } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const metadata: Metadata = {
  title: "Irys Provenance Toolkit",
  description: "UI toolkit to kickstart your next projet",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.className} bg-background relative`}>
      {GTM_ID && <GoogleAnalytics gaId={GTM_ID} />}
      <body className={roboto.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
