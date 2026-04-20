import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is a margin call?",
    a: "A margin call occurs when your account equity falls below the broker's maintenance margin requirement — typically 25–30% of the total position value. When this happens, the broker demands you deposit more cash or securities, or will forcibly liquidate positions to restore the required equity level. Margin calls often happen during fast market moves.",
  },
  {
    q: "What is the difference between initial margin and maintenance margin?",
    a: "Initial margin is the minimum deposit required to open a leveraged position — typically 50% of the purchase price for stocks under Regulation T. Maintenance margin is the minimum equity you must maintain while the position is open, usually 25–30%. If your equity drops below maintenance margin, a margin call is triggered.",
  },
  {
    q: "How does margin amplify gains and losses?",
    a: "Margin increases your buying power, so your gains and losses are calculated on a larger position than your cash alone. If you use 2x leverage (equal cash and margin loan), a 10% stock gain becomes a ~20% gain on your equity — minus interest costs. But a 10% stock loss becomes a ~20% loss, showing how leverage cuts both ways.",
  },
  {
    q: "Is margin trading suitable for options strategies?",
    a: "Some options strategies require margin — particularly naked puts, naked calls, and certain spreads where the broker holds collateral against potential losses. For defined-risk strategies like long calls or debit spreads, margin is not typically required. Margin requirements vary significantly by broker and position type.",
  },
  {
    q: "How does margin interest affect my breakeven?",
    a: "The margin loan accrues daily interest at your broker's annual rate (often 8–12% for retail brokers). This cost must be factored into your breakeven — you need your trade to gain enough to cover both the interest cost and any commissions. Longer holding periods mean higher interest costs, which is why margin is typically better suited for shorter-duration trades.",
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

const MarginCalculator = dynamic(() => import("../MarginCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Options Margin Calculator",
  description:
    "Calculate margin requirements for selling options contracts. Estimate initial and maintenance margin for naked calls, naked puts, and spreads to manage your buying power effectively.",
  alternates: { canonical: "/margin-calculator" },
  openGraph: {
    title: "Options Margin Calculator | TradeToolsHub",
    description:
      "Calculate initial and maintenance margin requirements for selling options contracts.",
    url: "https://www.tradetoolshub.com/margin-calculator",
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
          Options Margin Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Estimate margin requirements for selling options to manage your buying power.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <MarginCalculator />
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
