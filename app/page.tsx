"use client";

import { useState } from "react";
import ROICalculator from './ROICalculator';
import BreakevenCalculator from './BreakevenCalculator';
import SharpeRatioCalculator from './SharpeRatioCalculator';
import SortinoRatioCalculator from './SortinoRatioCalculator';
import GreeksCalculator from './GreeksCalculator';
import ImpliedVolatilityCalculator from './ImpliedVolatilityCalculator';
import MaxPainCalculator from './MaxPainCalculator';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "TradeToolsHub.com | Options Trading Tools",
  "description": "A comprehensive hub of financial calculators and tools to help you make informed decisions about options trading.",
  "url": "https://www.tradetoolshub.com/",
  "keywords": "options tools, options calculator, options trading, options strategy, ROI, breakeven, sharpe ratio, sortino ratio, stock trading, finance tools",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.tradetoolshub.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "name": "Options Tools Navigation",
    "description": "Navigate between various options trading calculators like ROI, Breakeven, Sharpe Ratio, and Sortino Ratio.",
    "potentialAction": {
      "@type": "SiteNavigationElement",
      "name": "Navigation Links",
      "url": [
        "https://www.tradetoolshub.com/?tool=roi-calculator",
        "https://www.tradetoolshub.com/?tool=breakeven-calculator",
        "https://www.tradetoolshub.com/?tool=sharpe-ratio-calculator",
        "https://www.tradetoolshub.com/?tool=sortino-ratio-calculator",
        "https://www.tradetoolshub.com/?tool=greeks-calculator",
        "https://www.tradetoolshub.com/?tool=iv-calculator",
        "https://www.tradetoolshub.com/?tool=max-pain-calculator"
      ]
    }
  }
};

const renderTool = (tool: string) => {
  switch (tool) {
    case 'roi':
      return <ROICalculator />;
    case 'breakeven':
      return <BreakevenCalculator />;
    case 'sharpe':
      return <SharpeRatioCalculator />;
    case 'sortino':
      return <SortinoRatioCalculator />;
    case 'greeks':
      return <GreeksCalculator />;
    case 'iv':
      return <ImpliedVolatilityCalculator />;
    case 'max-pain':
      return <MaxPainCalculator />;
    default:
      return null;
  }
};

export default function HomePage() {
  const [activeTool, setActiveTool] = useState("roi");
  const currentYear = new Date().getFullYear();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
        <header className="w-full max-w-4xl text-center py-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
            Options Tools
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-400 mt-2">
            Select a tool to get started.
          </p>
        </header>

        <nav className="flex flex-wrap justify-center gap-4 py-4 mb-8 w-full max-w-4xl">
          <button
            onClick={() => setActiveTool("roi")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "roi"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            ROI Calculator
          </button>
          <button
            onClick={() => setActiveTool("breakeven")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "breakeven"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Breakeven Calculator
          </button>
          <button
            onClick={() => setActiveTool("sharpe")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "sharpe"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Sharpe Ratio
          </button>
          <button
            onClick={() => setActiveTool("sortino")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "sortino"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Sortino Ratio
          </button>
          <button
            onClick={() => setActiveTool("greeks")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "greeks"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Greeks
          </button>
          <button
            onClick={() => setActiveTool("iv")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "iv"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            IV Calculator
          </button>
          <button
            onClick={() => setActiveTool("max-pain")}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
              activeTool === "max-pain"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Max Pain
          </button>
        </nav>

        <main className="w-full max-w-4xl">
          {renderTool(activeTool)}
        </main>

        <footer className="w-full max-w-4xl text-center mt-auto py-8 text-gray-500 text-sm">
          <div className="border-t border-gray-700 pt-4">
            <p className="font-medium text-red-400">RISK DISCLAIMER:</p>
            <p className="text-xs mt-1 max-w-2xl mx-auto">
              The calculators and tools provided on this website are for informational and educational purposes only. They are not intended as financial advice. All investments, including options trading, involve risk. Please consult with a qualified financial advisor before making any investment decisions.
            </p>
          </div>
          <div className="mt-4">
            &copy; {currentYear} TradeToolsHub. All Rights Reserved.
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Powered by Next.js and Tailwind CSS.
          </div>
        </footer>
      </div>
    </>
  );
}
