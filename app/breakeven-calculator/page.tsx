import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "What is the breakeven price for a call option?",
    a: "For a long call option, the breakeven price is the strike price plus the premium paid. For example, if you buy a $150 call and pay $3.00 in premium, your breakeven at expiration is $153. The stock must trade above this level for the trade to be profitable.",
  },
  {
    q: "What is the breakeven price for a put option?",
    a: "For a long put option, the breakeven price is the strike price minus the premium paid. If you buy a $150 put for $4.00, your breakeven at expiration is $146. The stock must fall below this level for the trade to be profitable.",
  },
  {
    q: "Why does the breakeven price matter?",
    a: "The breakeven price tells you exactly how much the underlying asset needs to move before your option trade turns a profit. Without knowing this, you can't accurately assess the probability of success or set a realistic price target for your trade.",
  },
  {
    q: "Does the breakeven price change after you enter a trade?",
    a: "The breakeven price at expiration is fixed once you enter the trade (strike + premium paid). However, intraday the option's market value fluctuates with the underlying, so your effective breakeven in terms of P&L can change if you plan to exit before expiration.",
  },
  {
    q: "What is the breakeven for an options seller?",
    a: "For a put seller (cash-secured put or naked put), the breakeven is the strike price minus the premium received. For a call seller (covered call or naked call), the breakeven is the strike price plus the premium received. Sellers profit if the stock stays on the favorable side of this level.",
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

const BreakevenCalculator = dynamic(() => import("../BreakevenCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Options Breakeven Calculator",
  description:
    "Find the exact price your underlying stock needs to reach for your options trade to break even. Accounts for premiums paid or received on calls and puts.",
  alternates: { canonical: "/breakeven-calculator" },
  openGraph: {
    title: "Options Breakeven Calculator | TradeToolsHub",
    description:
      "Find the exact price your underlying needs to reach for your options trade to break even, accounting for premiums.",
    url: "https://www.tradetoolshub.com/breakeven-calculator",
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
          Options Breakeven Calculator
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Calculate the breakeven price for calls and puts, including premium paid or received.
        </p>
      </header>
      <ToolNavBar />
      <main className="w-full max-w-4xl">
        <BreakevenCalculator />
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
