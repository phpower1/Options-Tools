"use client";

import { useState, useEffect } from "react";
import { CircleDollarSign, Hash, Calendar, Zap, TrendingUp, TrendingDown } from "lucide-react";

// Max Pain is the strike price at which the largest number of open options will expire worthless.
// This is a complex calculation that requires real-time options data,
// which is not available in a client-side calculator. This is a template for the tool's design
// that can be expanded with real-time data fetching in the future.

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Max Pain Calculator - Options Trading Tool",
    "description": "An options calculator to determine the maximum pain strike price, the point where the most options contracts will expire worthless. A key tool for understanding options market dynamics.",
    "url": "https://www.tradetoolshub.com/?tool=max-pain",
    "keywords": "max pain calculator, options trading, max pain theory, options analysis, options strategy, stock market",
    "mainContentOfPage": {
        "@type": "HowTo",
        "name": "How to Use the Max Pain Calculator",
        "description": "A guide to using the Max Pain calculator to identify the strike price with the most open contracts.",
        "step": [
            {
                "@type": "HowToStep",
                "text": "The Max Pain calculator identifies the strike price at which the largest number of options will expire worthless. It is a powerful tool to understand market sentiment and potential price targets."
            },
            {
                "@type": "HowToStep",
                "text": "To use a real-world Max Pain calculator, you would need to fetch real-time open interest data for all outstanding call and put options. This data is then aggregated to determine the strike price with the highest total value of open contracts."
            }
        ]
    }
};

const mockData = [
  { strike: 100, callsOI: 5000, putsOI: 7000 },
  { strike: 105, callsOI: 6500, putsOI: 5500 },
  { strike: 110, callsOI: 8000, putsOI: 3000 },
  { strike: 115, callsOI: 3500, putsOI: 4500 },
  { strike: 120, callsOI: 2000, putsOI: 9000 },
];

const calculateMaxPain = (data: any[]) => {
  let maxPainValue = -Infinity;
  let maxPainStrike = 0;

  for (const strikeData of data) {
    let painAtStrike = 0;
    
    // Calculate pain for puts
    for (const put of data) {
      if (put.strike > strikeData.strike) {
        painAtStrike += (put.strike - strikeData.strike) * put.putsOI;
      }
    }
    
    // Calculate pain for calls
    for (const call of data) {
      if (call.strike < strikeData.strike) {
        painAtStrike += (strikeData.strike - call.strike) * call.callsOI;
      }
    }

    if (painAtStrike > maxPainValue) {
      maxPainValue = painAtStrike;
      maxPainStrike = strikeData.strike;
    }
  }

  return maxPainStrike;
};

export default function MaxPainCalculator() {
  const maxPainStrike = calculateMaxPain(mockData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-teal-300">Max Pain Calculator</h2>
        </div>

        {/* Calculator Inputs and Results Section */}
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-0 md:space-x-8 md:flex-row">
          <div className="bg-gray-700 p-6 rounded-xl shadow-inner text-center w-full md:w-auto">
            <h4 className="text-xl font-semibold text-gray-300">
                Max Pain Strike
            </h4>
            <div className="flex items-center justify-center text-4xl font-bold text-white mt-2">
                <span className="text-teal-400 mr-2">$</span>
                {maxPainStrike.toFixed(2)}
            </div>
          </div>
        </div>

        {/* SEO-rich content and instructions */}
        <section className="mt-8 space-y-4 text-gray-400">
          <h3 className="text-2xl font-bold text-teal-400">What is the Max Pain Theory?</h3>
          <p className="text-gray-300">
            The **Max Pain theory** suggests that an underlying asset's price, at the expiration of its options contracts, will gravitate towards the **"maximum pain"** strike price. This is the strike price at which the largest number of options (both calls and puts) would expire worthless. For options traders, understanding the max pain point can provide a key insight into market dynamics and potential price movements.
          </p>

          <h3 className="text-2xl font-bold text-teal-400">How to Use the Tool</h3>
          <p className="text-gray-300">
            To use a real-world Max Pain calculator, you need to input real-time open interest data for all outstanding call and put options. The calculator would then aggregate this data to determine the strike price with the highest total value of open contracts, which is considered the max pain point. While this calculator uses mock data to demonstrate the concept, it provides a solid foundation for a more advanced tool.
          </p>
        </section>
      </div>
    </>
  );
}
