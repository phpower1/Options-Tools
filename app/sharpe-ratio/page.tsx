import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is a good Sharpe Ratio?",
    a: "A Sharpe Ratio above 1.0 is generally considered good, above 2.0 is excellent, and above 3.0 is exceptional. A ratio below 1.0 indicates the returns may not adequately compensate for the risk taken. Negative Sharpe Ratios mean the strategy is underperforming the risk-free rate.",
  },
  {
    q: "What is the difference between Sharpe Ratio and Sortino Ratio?",
    a: "Both measure risk-adjusted return, but the Sharpe Ratio uses total standard deviation (all volatility) while the Sortino Ratio uses only downside deviation. For strategies with asymmetric returns — like options selling — the Sortino Ratio is more informative because it doesn't penalize upside volatility.",
  },
  {
    q: "What risk-free rate should I use for the Sharpe Ratio?",
    a: "The most commonly used risk-free rate is the current 3-month U.S. Treasury bill (T-bill) yield or the Fed funds rate. As of 2025, this is typically in the 4–5% range. Use whatever rate reflects the return you could earn with zero risk over the same period as your investment.",
  },
  {
    q: "Can the Sharpe Ratio be negative?",
    a: "Yes. A negative Sharpe Ratio means the investment's return is below the risk-free rate, so you would have been better off simply holding T-bills. It signals that the strategy is destroying risk-adjusted value, though it does not directly tell you whether the investment had absolute gains or losses.",
  },
  {
    q: "How is the Sharpe Ratio used in options trading?",
    a: "Options traders use the Sharpe Ratio to compare the risk-adjusted performance of different strategies — for example, covered calls vs. cash-secured puts vs. iron condors. A strategy with a higher Sharpe Ratio delivers more return per unit of risk, making it more capital-efficient over time.",
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

const SharpeRatioCalculator = dynamic(() => import("../SharpeRatioCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Sharpe Ratio Calculator for Options",
  description:
    "Calculate the Sharpe Ratio to measure risk-adjusted performance of your options portfolio. Compare returns relative to volatility to assess whether your strategy's returns justify the risk.",
  alternates: { canonical: "/sharpe-ratio" },
  openGraph: {
    title: "Sharpe Ratio Calculator | TradeToolsHub",
    description:
      "Measure risk-adjusted performance of your options portfolio. Compare returns relative to volatility.",
    url: "https://www.tradetoolshub.com/sharpe-ratio",
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
          Sharpe Ratio Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Measure risk-adjusted returns — how much reward you earn per unit of risk.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <SharpeRatioCalculator />
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
