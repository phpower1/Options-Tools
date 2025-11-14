import "./styles/globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tradetoolshub.com"),
  title: {
    default: "Options Tools | TradeToolsHub",
    template: "%s | TradeToolsHub",
  },
  description: "A collection of tools to help you make informed decisions about options trading.",
  keywords: [
    "options tools",
    "options calculator",
    "options trading",
    "options strategy",
    "roi calculator",
    "implied volatility",
    "greeks calculator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.tradetoolshub.com/",
    title: "Options Tools | TradeToolsHub",
    description:
      "A collection of tools to help you make informed decisions about options trading.",
    siteName: "TradeToolsHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Options Tools | TradeToolsHub",
    description:
      "A collection of tools to help you make informed decisions about options trading.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
