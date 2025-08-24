// app/layout.tsx
import "../Styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Options Tools",
  description: "Options trading journal and ROI calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
