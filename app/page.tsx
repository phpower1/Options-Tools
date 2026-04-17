import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Options Trading Calculators | TradeToolsHub",
  description:
    "Free options trading calculators: ROI, Breakeven, Greeks (Delta/Gamma/Theta/Vega), Implied Volatility, Sharpe Ratio, Sortino Ratio, Max Pain, and Margin. Built for options traders.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free Options Trading Calculators | TradeToolsHub",
    description:
      "Free options trading calculators: ROI, Breakeven, Greeks, IV, Sharpe, Sortino, Max Pain, Margin.",
    url: "https://www.tradetoolshub.com/",
  },
};

const tools = [
  {
    href: "/roi-calculator",
    title: "ROI Calculator",
    description:
      "Calculate and compare return on investment across multiple options positions. Track tickers, premiums received, and holding durations side-by-side.",
  },
  {
    href: "/breakeven-calculator",
    title: "Breakeven Calculator",
    description:
      "Find the exact price the underlying stock needs to reach for your trade to break even, accounting for premiums paid or received on calls and puts.",
  },
  {
    href: "/sharpe-ratio",
    title: "Sharpe Ratio",
    description:
      "Measure risk-adjusted performance by comparing portfolio returns to their volatility. Assess whether your strategy's returns justify the total risk taken.",
  },
  {
    href: "/sortino-ratio",
    title: "Sortino Ratio",
    description:
      "Like the Sharpe Ratio, but only penalizes downside volatility — a more precise metric for options strategies with asymmetric payoff profiles.",
  },
  {
    href: "/greeks-calculator",
    title: "Greeks Calculator",
    description:
      "Calculate Delta, Gamma, Theta, Vega, and Rho for any options contract using the Black-Scholes model. Enter the underlying, strike, expiry, IV, and rate.",
  },
  {
    href: "/implied-volatility",
    title: "IV Calculator",
    description:
      "Back-solve for implied volatility from an option's market price. Input the observed price and contract details to calculate the market's implied IV instantly.",
  },
  {
    href: "/max-pain-calculator",
    title: "Max Pain Calculator",
    description:
      "Calculate the max pain price — the strike at which the most options expire worthless, causing maximum loss to buyers. Useful for anticipating price pinning near expiry.",
  },
  {
    href: "/margin-calculator",
    title: "Margin Calculator",
    description:
      "Estimate initial and maintenance margin requirements for selling options contracts. Understand your buying power consumption before entering a position.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TradeToolsHub",
  url: "https://www.tradetoolshub.com/",
  description:
    "Free options trading calculators for ROI, Breakeven, Greeks, Implied Volatility, Sharpe Ratio, Sortino Ratio, Max Pain, and Margin.",
  hasPart: tools.map((tool) => ({
    "@type": "WebPage",
    name: tool.title,
    url: `https://www.tradetoolshub.com${tool.href}`,
    description: tool.description,
  })),
};

export default function HomePage() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
        <header className="w-full max-w-4xl text-center py-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
            Options Trading Tools
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-300 mt-4 max-w-2xl mx-auto">
            Free, browser-based calculators for options traders. No login required.
          </p>
          <p className="text-base text-gray-500 mt-3 max-w-2xl mx-auto">
            From pricing and breakeven analysis to risk-adjusted performance and margin requirements
            — everything you need to make more informed options trading decisions.
          </p>
        </header>

        <main className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">
            Available Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tools.map(({ href, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-colors duration-200"
              >
                <h3 className="text-lg font-bold text-teal-400 group-hover:text-teal-300 mb-2">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                <span className="inline-block mt-4 text-xs font-semibold text-teal-500 group-hover:text-teal-300">
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        </main>

        <footer className="w-full max-w-4xl text-center mt-16 py-8 text-gray-500 text-sm">
          <div className="border-t border-gray-700 pt-4">
            <p className="font-medium text-red-400">RISK DISCLAIMER:</p>
            <p className="text-xs mt-1 max-w-2xl mx-auto">
              The calculators and tools provided on this website are for informational and
              educational purposes only. They are not intended as financial advice. All investments,
              including options trading, involve risk. Please consult with a qualified financial
              advisor before making any investment decisions.
            </p>
          </div>
          <div className="mt-4">&copy; {currentYear} TradeToolsHub. All Rights Reserved.</div>
          <div className="mt-1 text-xs text-gray-600">Powered by Next.js and Tailwind CSS.</div>
        </footer>
      </div>
    </>
  );
}
