import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const ImpliedVolatilityCalculator = dynamic(() => import("../ImpliedVolatilityCalculator"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Implied Volatility (IV) Calculator for Options",
  description:
    "Back-solve for implied volatility from an option's market price using the Black-Scholes model. Enter the option price, underlying, strike, expiry, and risk-free rate to calculate IV instantly.",
  alternates: { canonical: "/implied-volatility" },
  openGraph: {
    title: "Implied Volatility Calculator | TradeToolsHub",
    description:
      "Back-solve for implied volatility from an option's market price using the Black-Scholes model.",
    url: "https://www.tradetoolshub.com/implied-volatility",
  },
};

export default function Page() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center py-6">
        <Link href="/" className="text-teal-400 text-sm hover:underline mb-4 inline-block">
          ← All Tools
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
          Implied Volatility Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Back-solve for IV from any option&apos;s market price using Black-Scholes.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <ImpliedVolatilityCalculator />
      </main>
      <footer className="w-full max-w-4xl text-center mt-auto py-8 text-gray-500 text-sm">
        <div className="border-t border-gray-700 pt-4">
          <p className="font-medium text-red-400">RISK DISCLAIMER:</p>
          <p className="text-xs mt-1 max-w-2xl mx-auto">
            The calculators and tools provided on this website are for informational and educational
            purposes only. They are not intended as financial advice. All investments, including
            options trading, involve risk. Please consult with a qualified financial advisor before
            making any investment decisions.
          </p>
        </div>
        <div className="mt-4">&copy; {currentYear} TradeToolsHub. All Rights Reserved.</div>
        <div className="mt-1 text-xs text-gray-600">Powered by Next.js and Tailwind CSS.</div>
      </footer>
    </div>
  );
}
