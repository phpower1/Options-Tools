import "./styles/globals.css";
import type { Metadata } from "next";
// next/font is incompatible with `output: "export"`, so we will use a standard font.
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

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
      <body className="font-sans">{children}</body>
    </html>
  );
}
