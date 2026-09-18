import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is an ideal daily theta target for an options seller?",
    a: "Systematic premium sellers typically target a daily portfolio theta between 0.1% and 0.5% of their total account net liquidity. The industry standard benchmark (popularized by Tastytrade) is around 0.20% to 0.30% per day (e.g., $20 to $30 daily theta per $10,000 in account value). This balance provides meaningful decay income without subjecting the portfolio to unmanageable negative gamma risk.",
  },
  {
    q: "How does account size affect ideal daily theta?",
    a: "Daily theta scales directly with account size: on a $10,000 account, a 0.25% daily target is $25/day; on a $50,000 account, it is $125/day; and on a $100,000 account, it is $250/day. Larger accounts also enjoy greater diversification across uncorrelated underlying assets and can use broad index options (like SPX or XSP) to achieve their theta target with less single-stock risk.",
  },
  {
    q: "Why shouldn't I maximize my daily theta above 0.5% or 1%?",
    a: "High daily theta comes at the cost of high negative Gamma (the 'Gamma Trap'). Options decay fastest very close to expiration (0–7 DTE) and near the current stock price (at-the-money). If you seek excessive theta, you must sell close-to-expiration or narrow-spread positions. A sharp adverse market move causes your short deltas to spike exponentially, causing losses that can easily wipe out months of accumulated theta decay.",
  },
  {
    q: "What is the difference between theoretical theta and realized theta?",
    a: "Theoretical theta assumes stock prices, volatility, and interest rates remain completely stationary until expiration. In reality, underlying price movements, changes in implied volatility, and trade management rules (such as closing winners at 50% max profit or rolling at 21 DTE) reduce captured decay. Experienced options sellers typically realize about 25% to 50% of their gross theoretical theta over the course of a year.",
  },
  {
    q: "How much buying power or capital should be deployed?",
    a: "It is best practice not to allocate 100% of your capital to open option positions. In normal or low implied volatility (IV) environments, keeping 50% to 70% of your account in cash or short-term Treasuries gives you safety reserves. In elevated IV environments (e.g., VIX above 25 or 30), you might expand allocation up to 70%–80% to harvest richer option premiums while maintaining defensive flexibility.",
  },
  {
    q: "What is the ideal Theta-to-Delta ratio for a delta-neutral portfolio?",
    a: "Most premium sellers strive to keep portfolio Theta at least equal to, or greater than, their net portfolio Delta (often measured as beta-weighted delta to SPY). A Theta-to-Delta ratio between 1:1 and 2:1 ensures that daily time decay is strong enough to buffer normal day-to-day market fluctuations.",
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

const DailyThetaCalculator = dynamic(() => import("../DailyThetaCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Options Daily Theta Calculator",
  description:
    "Calculate the ideal daily portfolio Theta for options sellers based on account size, buying power allocation, and risk tolerance. Free browser-based options tool.",
  alternates: { canonical: "/daily-theta-calculator" },
  openGraph: {
    title: "Options Daily Theta Calculator | TradeToolsHub",
    description:
      "Calculate target daily portfolio Theta for options sellers based on account size, buying power allocation, and risk profile.",
    url: "https://www.tradetoolshub.com/daily-theta-calculator",
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
          Options Daily Theta Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Calculate the ideal daily portfolio time decay target for options sellers based on account size and risk appetite.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <DailyThetaCalculator />
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
            <p className="text-gray-500 text-xs mt-1">Calculate contract-level Delta, Gamma, Theta, and Vega with Black-Scholes.</p>
          </Link>
          <Link href="/margin-calculator" className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors">
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Margin Calculator</p>
            <p className="text-gray-500 text-xs mt-1">Model leverage, interest costs, and margin call thresholds for short options.</p>
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
