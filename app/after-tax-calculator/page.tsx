import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ToolNavBar from "../components/ToolNavBar";

const faqs = [
  {
    q: "How are profits from options trading taxed in the United States?",
    a: "For almost all individual retail traders, equity and ETF options (e.g., AAPL, TSLA, SPY, QQQ) held for one year or less are classified as Short-Term Capital Gains (STCG). STCG is taxed at ordinary federal income tax rates (from 10% up to 37%), plus applicable state and local taxes, and potentially the 3.8% Net Investment Income Tax (NIIT).",
  },
  {
    q: "What is IRS Section 1256 and the 60/40 tax rule?",
    a: "Under Section 1256 of the Internal Revenue Code, broad-based index options (such as SPX, NDX, RUT, and XSP) receive special tax treatment regardless of how long contracts are held. 60% of capital gains are taxed at favorable long-term capital gains rates (maximum 20%), while only 40% are taxed at short-term ordinary rates (maximum 37%). This blended rate lowers the maximum federal tax rate from 37% down to roughly 26.8% (excluding NIIT).",
  },
  {
    q: "Why does baseline income affect my options trading taxes?",
    a: "Trading profits are stacked on top of your existing taxable income (such as W-2 wages, 1099 self-employment income, or business profits). If you earn $80,000 at your day job, your trading profits do not start in the 10% or 12% brackets—they immediately enter your top marginal bracket (22% or higher). Entering your baseline income ensures accurate marginal and effective tax calculations.",
  },
  {
    q: "What is the Net Investment Income Tax (NIIT 3.8%)?",
    a: "The NIIT is an additional 3.8% surtax levied by the federal government on net investment income (which includes capital gains from trading options, stocks, and bonds) for high earners. It applies when your modified adjusted gross income exceeds $200,000 for single filers or $250,000 for married couples filing jointly.",
  },
  {
    q: "Which states have no state income tax on options trading?",
    a: "Nine US states have no personal income tax on equity trading gains: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. Note: Washington State imposes a 7% tax specifically on net long-term capital gains above $250,000, but standard short-term equity options gains remain exempt.",
  },
  {
    q: "Are index options exempt from the IRS Wash Sale Rule?",
    a: "Yes. Broad-based index options classified under Section 1256 (like SPX and NDX) are marked-to-market at year-end and are explicitly exempt from the IRS wash sale rule. In contrast, equity and single-stock ETF options (like SPY and QQQ) are strictly subject to wash sale rules if you repurchase substantially identical contracts within a 30-day window.",
  },
  {
    q: "How does this tool connect with the Daily Theta Calculator?",
    a: "When premium sellers target a specific after-tax income (e.g., $50,000 net take-home), they must know their required gross profit (e.g., $72,000). Dividing this gross requirement by 252 trading days reveals the exact daily dollar target ($285/day) they need to engineer through theta decay in our Daily Theta Calculator.",
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

const AfterTaxCalculator = dynamic(() => import("../AfterTaxCalculator"), { ssr: false });

export const metadata: Metadata = {
  title: "Options After-Tax Return & Tax Planner | TradeToolsHub",
  description:
    "Calculate the exact pre-tax gross profit needed to achieve your desired after-tax options trading return. Model federal brackets, all 50 US states, and Section 1256 (SPX 60/40) tax alpha.",
  alternates: { canonical: "/after-tax-calculator" },
  openGraph: {
    title: "Options After-Tax Return & Tax Planner | TradeToolsHub",
    description:
      "Plan your after-tax options trading income. Calculate federal & state tax drag, solve for required gross returns, and compare Equity Options against SPX Section 1256 contracts.",
    url: "https://www.tradetoolshub.com/after-tax-calculator",
  },
};

export default function AfterTaxPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="w-full max-w-4xl text-center py-6">
        <Link href="/" className="text-teal-400 text-sm hover:underline mb-4 inline-block">
          ← All Tools
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
          Options After-Tax Return Planner
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Calculate the pre-tax gross returns needed to achieve your take-home financial goals across all 50 US states.
        </p>
      </header>

      <ToolNavBar />

      <main className="w-full max-w-4xl">
        <AfterTaxCalculator />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/daily-theta-calculator"
            className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors"
          >
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Daily Theta Calculator</p>
            <p className="text-gray-500 text-xs mt-1">
              Model your daily time decay capture target to hit your gross trading milestones.
            </p>
          </Link>
          <Link
            href="/roi-calculator"
            className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors"
          >
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">ROI Calculator</p>
            <p className="text-gray-500 text-xs mt-1">
              Track and compare return on investment and premium per day across open options trades.
            </p>
          </Link>
          <Link
            href="/margin-calculator"
            className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-teal-500 transition-colors"
          >
            <p className="font-semibold text-teal-400 group-hover:text-teal-300 text-sm">Margin Calculator</p>
            <p className="text-gray-500 text-xs mt-1">
              Understand borrowing costs, buying power leverage, and margin thresholds.
            </p>
          </Link>
        </div>
      </section>

      <footer className="w-full max-w-4xl text-center mt-auto py-8 text-gray-500 text-sm">
        <div className="border-t border-gray-700 pt-4">
          <p className="font-medium text-amber-400">TAX & FINANCIAL DISCLAIMER:</p>
          <p className="text-xs mt-1 max-w-2xl mx-auto leading-relaxed">
            The calculators and estimates provided on this website are strictly for informational, educational, and planning
            purposes only. They do not constitute formal tax, legal, or investment advice. Tax laws, brackets, deductions, and
            local surcharges vary based on personal circumstances and are subject to change. Always consult a certified CPA,
            tax attorney, or licensed financial advisor regarding your specific tax liability.
          </p>
        </div>
        <div className="mt-4">&copy; {currentYear} TradeToolsHub. All Rights Reserved.</div>
        <div className="mt-1 text-xs text-gray-600">Free, client-side options calculators powered by Next.js and Tailwind CSS.</div>
      </footer>
    </div>
  );
}
