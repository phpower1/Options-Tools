import "./styles/globals.css";
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Options Tools",
  description: "A collection of tools to help you make informed decisions about options trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
