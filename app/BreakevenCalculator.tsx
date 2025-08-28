"use client";

import { useState } from 'react';

const BreakevenCalculator = () => {
  const [strategy, setStrategy] = useState('call');
  const [strikePrice, setStrikePrice] = useState('');
  const [premium, setPremium] = useState('');
  const [breakevenPrice, setBreakevenPrice] = useState<number | null>(null);

  const calculateBreakeven = () => {
    const strike = parseFloat(strikePrice);
    const premiumValue = parseFloat(premium);

    if (isNaN(strike) || isNaN(premiumValue)) {
      setBreakevenPrice(null);
      return;
    }

    let calculatedPrice;
    if (strategy === 'call') {
      // For a call option, breakeven is strike price + premium
      calculatedPrice = strike + premiumValue;
    } else {
      // For a put option, breakeven is strike price - premium
      calculatedPrice = strike - premiumValue;
    }
    setBreakevenPrice(calculatedPrice);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
        Breakeven Calculator
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Calculate the breakeven price for your call or put options.
      </p>

      {/* SEO-friendly descriptive content */}
      <div className="text-gray-400 text-sm mb-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">What is a Breakeven Calculator?</h2>
        <p>
          A **breakeven calculator** is a critical tool for options traders to determine the price at which a stock must trade for an options position to be neither profitable nor at a loss. Knowing your **breakeven point** is essential for risk management and for setting realistic price targets for your trades. This tool simplifies a key part of **options analysis**, helping you make more informed trading decisions.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          This calculator works based on a simple formula. For **call options**, the breakeven price is the strike price plus the premium paid. For **put options**, the breakeven price is the strike price minus the premium paid. By calculating these values, you can instantly see the price target for your trade.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Select your **Options Strategy**: Choose between a **Call** or a **Put** option.</li>
          <li>Enter the **Strike Price ($)**: This is the price at which the option can be exercised.</li>
          <li>Enter the **Premium Paid ($)**: The total cost of the options contract.</li>
          <li>The **Breakeven Price** will be calculated and displayed automatically.</li>
        </ol>
      </div>

      <div className="space-y-6">
        {/* Strategy Selection */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => { setStrategy('call'); setBreakevenPrice(null); }}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              strategy === 'call'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white'
            }`}
          >
            Call Option
          </button>
          <button
            onClick={() => { setStrategy('put'); setBreakevenPrice(null); }}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              strategy === 'put'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white'
            }`}
          >
            Put Option
          </button>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="strike-price" className="block text-sm font-medium text-gray-300">
              Strike Price ($)
            </label>
            <input
              type="number"
              id="strike-price"
              value={strikePrice}
              onChange={(e) => setStrikePrice(e.target.value)}
              onBlur={calculateBreakeven}
              placeholder="e.g., 500"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="premium-paid" className="block text-sm font-medium text-gray-300">
              Premium Paid ($)
            </label>
            <input
              type="number"
              id="premium-paid"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              onBlur={calculateBreakeven}
              placeholder="e.g., 5.50"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Display Results */}
      {breakevenPrice !== null && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-md">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Breakeven Price</p>
            <p className="text-4xl font-extrabold text-teal-400">${breakevenPrice.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakevenCalculator;
