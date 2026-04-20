import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is a good Sortino Ratio?",
    a: "A Sortino Ratio above 1.0 is considered acceptable, above 2.0 is good, and above 3.0 is excellent. Because it only penalizes downside volatility, Sortino values are typically higher than Sharpe values for the same strategy. Compare strategies against each other rather than using absolute thresholds.",
  },
  {
    q: "Why is the Sortino Ratio better than Sharpe Ratio for options?",
    a: "Many options strategies (such as covered calls or iron condors) have positively skewed returns — small, consistent gains with occasional larger losses. The Sharpe Ratio penalizes these strategies for their upside volatility, understating their true risk-adjusted performance. The Sortino Ratio only penalizes the downside, giving a fairer picture.",
  },
  {
    q: "What is downside deviation?",
    a: "Downside deviation measures only the volatility of returns that fall below a target threshold (typically the risk-free rate or zero). It ignores positive deviations entirely. This makes it a better proxy for the actual risk an investor fears — losing money — rather than all variance in returns.",
  },
  {
    q: "Can the Sortino Ratio be negative?",
    a: "Yes. A negative Sortino Ratio means the investment's return is below the risk-free rate, similar to a negative Sharpe Ratio. It signals the strategy is not generating adequate return even relative to the downside risk taken.",
  },
  {
    q: "When should I use Sortino Ratio instead of Sharpe Ratio?",
    a: "Use the Sortino Ratio when evaluating strategies with asymmetric return distributions — particularly options selling strategies, trend-following systems, or any approach where large gains are possible. Use Sharpe when comparing strategies with roughly symmetric return profiles, like long-only equity portfolios.",
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

const SortinoRatioCalculator = dynamic(() => import("../SortinoRatioCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Sortino Ratio Calculator for Options",
  description:
    "Calculate the Sortino Ratio — a risk-adjusted performance metric that only penalizes downside volatility. More precise than Sharpe Ratio for options strategies with asymmetric payoff profiles.",
  alternates: { canonical: "/sortino-ratio" },
  openGraph: {
    title: "Sortino Ratio Calculator | TradeToolsHub",
    description:
      "Calculate the Sortino Ratio — a risk-adjusted metric that only penalizes downside volatility.",
    url: "https://www.tradetoolshub.com/sortino-ratio",
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
          Sortino Ratio Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Like Sharpe Ratio, but only penalizes downside risk — ideal for options strategies.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <SortinoRatioCalculator />
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
