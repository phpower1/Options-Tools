import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is a high implied volatility for an option?",
    a: "IV is relative — what's 'high' depends on the underlying. For a stable stock like AAPL, an IV of 40% might be elevated; for a volatile biotech, 40% could be low. A useful benchmark is comparing current IV to its historical range using IV Rank (IVR) or IV Percentile. An IVR above 50 is generally considered elevated.",
  },
  {
    q: "How does implied volatility affect options pricing?",
    a: "Implied volatility is directly proportional to an option's extrinsic (time) value. Higher IV means the market expects larger price swings, so options are priced with more premium. This benefits sellers (more premium to collect) but makes buying options more expensive. A 1% increase in IV raises the option price by approximately its Vega value.",
  },
  {
    q: "What is the difference between implied volatility and historical volatility?",
    a: "Historical volatility (HV) measures how much the stock has actually moved in the past, based on realized price data. Implied volatility (IV) is forward-looking — it's what the market is pricing in for future moves. When IV is significantly higher than HV, options are considered expensive; when IV is lower than HV, they are considered cheap.",
  },
  {
    q: "What is IV crush and when does it happen?",
    a: "IV crush is a sharp drop in implied volatility immediately after a major event — most commonly an earnings announcement. Before earnings, IV spikes as the market prices in uncertainty. Once the news is out, uncertainty drops and IV collapses, often cutting option values in half even if the stock moves in the right direction.",
  },
  {
    q: "Should I buy or sell options when IV is high?",
    a: "When IV is high relative to its historical range, options are expensive — generally a better environment for selling options (collecting inflated premium). When IV is low, options are cheap relative to expected moves — generally a better time to buy. This is a core principle of volatility-based options trading, often summarized as 'buy low IV, sell high IV.'",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
      <section className="w-full max-w-4xl mt-10 mb-4">
        <h2 className="text-xl font-bold text-gray-200 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-sm font-semibold text-teal-400 mb-2">{q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full max-w-4xl mt-6 mb-4">
        <h2 className="text-lg font-bold text-gray-300 mb-4">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/greeks-calculator" className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors">
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Greeks Calculator</p>
            <p className="text-gray-500 text-xs mt-1">Calculate Delta, Gamma, Theta, and Vega using Black-Scholes.</p>
          </Link>
          <Link href="/max-pain-calculator" className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors">
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Max Pain Calculator</p>
            <p className="text-gray-500 text-xs mt-1">Find the strike where the most options expire worthless.</p>
          </Link>
        </div>
      </section>
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
