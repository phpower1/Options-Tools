import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What does Delta mean in options trading?",
    a: "Delta measures how much an option's price changes for every $1 move in the underlying stock. A call with Delta 0.50 gains about $0.50 if the stock rises $1. Delta also approximates the probability that the option expires in-the-money — a Delta-50 option has roughly a 50% chance of expiring ITM.",
  },
  {
    q: "What is Theta decay and how does it affect my options?",
    a: "Theta is the daily time decay of an option — the amount of value lost each day purely from the passage of time, all else equal. Theta accelerates as expiration approaches, especially in the final 30 days. Options buyers lose value from Theta daily; options sellers collect it. A Theta of -0.05 means the option loses about $5 per day per contract.",
  },
  {
    q: "What does a high Vega option mean?",
    a: "A high Vega means the option's price is very sensitive to changes in implied volatility. High-Vega options (typically longer-dated or near-the-money) gain value when IV rises and lose value when IV falls. Buying high-Vega options ahead of earnings can be profitable if the resulting IV crush doesn't overwhelm the move.",
  },
  {
    q: "Which Greeks matter most for options sellers?",
    a: "Options sellers primarily care about Theta (time decay working in their favor), Delta (directional risk), and Vega (volatility risk). Selling options with high Theta and low Vega is generally preferable — you collect time value quickly without excessive exposure to IV spikes. Gamma risk becomes critical near expiration.",
  },
  {
    q: "What is the difference between Delta and Gamma?",
    a: "Delta is a snapshot of how much the option moves with the stock right now. Gamma measures how fast Delta itself changes. A high-Gamma option has a Delta that shifts rapidly with every $1 move in the stock, making it harder to hedge and more sensitive to price swings — particularly dangerous for short options near expiration.",
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

const GreeksCalculator = dynamic(() => import("../GreeksCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Options Greeks Calculator — Delta, Gamma, Theta, Vega, Rho",
  description:
    "Calculate all five options Greeks — Delta, Gamma, Theta, Vega, and Rho — using the Black-Scholes model. Enter the underlying price, strike, expiry, volatility, and interest rate to get instant results.",
  alternates: { canonical: "/greeks-calculator" },
  openGraph: {
    title: "Options Greeks Calculator | TradeToolsHub",
    description:
      "Calculate Delta, Gamma, Theta, Vega, and Rho for any options contract using Black-Scholes.",
    url: "https://www.tradetoolshub.com/greeks-calculator",
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
          Options Greeks Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Calculate Delta, Gamma, Theta, Vega, and Rho using the Black-Scholes model.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <GreeksCalculator />
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
