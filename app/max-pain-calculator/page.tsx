import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is max pain in options trading?",
    a: "Max pain is the strike price at which the greatest total dollar value of open options contracts (both calls and puts) would expire worthless at expiration. The theory holds that market makers and large institutions, who are net short options, benefit most when the underlying closes at this price, causing maximum financial loss to option buyers.",
  },
  {
    q: "Is max pain theory reliable?",
    a: "Max pain is a controversial concept. Studies show the underlying asset closes near the max pain price more often than pure chance would suggest — particularly in highly optioned large-cap stocks around monthly expiration. However, it is not deterministic and should be used as one data point alongside technical analysis, not as a standalone signal.",
  },
  {
    q: "How do I use max pain to make trading decisions?",
    a: "Traders use max pain to anticipate potential 'pinning' — where a stock gravitates toward a specific strike in the final hours before expiration. If the current price is well above max pain, it may be a signal that the stock could pull back toward that level. It is most relevant in the last week before monthly options expiration.",
  },
  {
    q: "What is open interest in options?",
    a: "Open interest is the total number of outstanding options contracts that have not been settled or closed. High open interest at a particular strike means many contracts are active at that level, making it significant for max pain calculations and support/resistance analysis. It differs from volume, which measures new contracts opened in a single day.",
  },
  {
    q: "Does max pain change before expiration?",
    a: "Yes. Max pain is recalculated as open interest shifts — traders open and close positions daily, changing the distribution of contracts across strikes. The max pain level can move significantly in the weeks leading up to expiration, particularly after large moves in the underlying or major macro events.",
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

const MaxPainCalculator = dynamic(() => import("../MaxPainCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Max Pain Calculator for Options",
  description:
    "Calculate the max pain price — the strike at which the greatest number of options expire worthless, causing maximum financial loss to option buyers. Useful for anticipating price pinning near expiry.",
  alternates: { canonical: "/max-pain-calculator" },
  openGraph: {
    title: "Max Pain Calculator | TradeToolsHub",
    description:
      "Calculate the max pain price — the strike where the most options expire worthless near expiry.",
    url: "https://www.tradetoolshub.com/max-pain-calculator",
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
          Max Pain Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Find the strike price where the most options expire worthless at expiry.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <MaxPainCalculator />
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
          <Link href="/implied-volatility" className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors">
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">IV Calculator</p>
            <p className="text-gray-500 text-xs mt-1">Back-solve for implied volatility from an option&apos;s market price.</p>
          </Link>
          <Link href="/greeks-calculator" className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors">
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Greeks Calculator</p>
            <p className="text-gray-500 text-xs mt-1">Analyze Delta, Gamma, Theta, and Vega for any contract.</p>
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
