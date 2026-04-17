"use client";

import { useState, useEffect } from 'react';

const SharpeRatioCalculator = () => {
  const [investmentReturn, setInvestmentReturn] = useState('');
  const [riskFreeRate, setRiskFreeRate] = useState('');
  const [standardDeviation, setStandardDeviation] = useState('');
  const [sharpeRatio, setSharpeRatio] = useState<number | null>(null);

  // Function to calculate Sharpe Ratio
  const calculateSharpeRatio = () => {
    const rp = parseFloat(investmentReturn);
    const rf = parseFloat(riskFreeRate);
    const sigmaP = parseFloat(standardDeviation);

    if (isNaN(rp) || isNaN(rf) || isNaN(sigmaP) || sigmaP <= 0) {
      setSharpeRatio(null);
      return;
    }

    const calculatedSharpe = (rp - rf) / sigmaP;
    setSharpeRatio(calculatedSharpe);
  };

  // Effect to load data from local storage on component mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('sharpeRatioCalculatorState');
      if (storedState) {
        const { investmentReturn, riskFreeRate, standardDeviation } = JSON.parse(storedState);
        setInvestmentReturn(investmentReturn);
        setRiskFreeRate(riskFreeRate);
        setStandardDeviation(standardDeviation);
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
    }
  }, []);

  // Effect to save data to local storage and recalculate whenever inputs change
  useEffect(() => {
    try {
      const stateToSave = { investmentReturn, riskFreeRate, standardDeviation };
      localStorage.setItem('sharpeRatioCalculatorState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
    calculateSharpeRatio();
  }, [investmentReturn, riskFreeRate, standardDeviation]);

  // Helper function to get the Sharpe Ratio rating
  const getSharpeRating = (ratio: number | null) => {
    if (ratio === null || isNaN(ratio)) return null;
    if (ratio >= 2.0) return { text: 'Excellent', color: 'bg-green-600' };
    if (ratio >= 1.0) return { text: 'Good', color: 'bg-green-500' };
    if (ratio >= 0.5) return { text: 'Fair', color: 'bg-lime-500' };
    if (ratio >= 0.0) return { text: 'Poor', color: 'bg-yellow-500' };
    return { text: 'Very Poor', color: 'bg-red-600' };
  };

  const currentRating = getSharpeRating(sharpeRatio);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      {/* JSON-LD for the Sharpe Ratio Calculator */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sharpe Ratio Calculator",
          "description": "A financial calculator for investors and options traders to determine the risk-adjusted return of an investment using the Sharpe Ratio.",
          "mainEntity": {
            "@type": "HowTo",
            "name": "Calculate Sharpe Ratio",
            "step": [
              {
                "@type": "HowToStep",
                "text": "Enter the investment return percentage."
              },
              {
                "@type": "HowToStep",
                "text": "Enter the risk-free rate percentage."
              },
              {
                "@type": "HowToStep",
                "text": "Enter the standard deviation percentage of the investment."
              }
            ]
          }
        })
      }} />

      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
        Sharpe Ratio Calculator
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Calculate the risk-adjusted return of your investments.
      </p>

      <div className="space-y-6">
        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="investment-return" className="block text-sm font-medium text-gray-300">
              Investment Return (%)
            </label>
            <input
              type="number"
              id="investment-return"
              value={investmentReturn}
              onChange={(e) => setInvestmentReturn(e.target.value)}
              placeholder="e.g., 12"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="risk-free-rate" className="block text-sm font-medium text-gray-300">
              Risk-Free Rate (%)
            </label>
            <input
              type="number"
              id="risk-free-rate"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(e.target.value)}
              placeholder="e.g., 2.5"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="standard-deviation" className="block text-sm font-medium text-gray-300">
              Standard Deviation (%)
            </label>
            <input
              type="number"
              id="standard-deviation"
              value={standardDeviation}
              onChange={(e) => setStandardDeviation(e.target.value)}
              placeholder="e.g., 15"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Display Results */}
      {sharpeRatio !== null && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-md">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Sharpe Ratio</p>
            <p className="text-4xl font-extrabold text-teal-400">{sharpeRatio.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Sharpe Ratio Rating Guide */}
      <div className="mt-8 p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-md">
        <h3 className="text-xl font-bold text-gray-300 mb-4 text-center">Sharpe Ratio Rating Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`p-4 rounded-xl text-center shadow-lg ${currentRating?.text === 'Excellent' ? 'ring-2 ring-teal-400' : ''}`}>
            <p className="font-bold text-gray-100">≥ 2.0</p>
            <p className="text-sm font-semibold text-gray-200">Excellent</p>
          </div>
          <div className={`p-4 rounded-xl text-center shadow-lg ${currentRating?.text === 'Good' ? 'ring-2 ring-teal-400' : ''}`}>
            <p className="font-bold text-gray-100">1.0 - 1.99</p>
            <p className="text-sm font-semibold text-gray-200">Good</p>
          </div>
          <div className={`p-4 rounded-xl text-center shadow-lg ${currentRating?.text === 'Fair' ? 'ring-2 ring-teal-400' : ''}`}>
            <p className="font-bold text-gray-100">0.5 - 0.99</p>
            <p className="text-sm font-semibold text-gray-200">Fair</p>
          </div>
          <div className={`p-4 rounded-xl text-center shadow-lg ${currentRating?.text === 'Poor' ? 'ring-2 ring-teal-400' : ''}`}>
            <p className="font-bold text-gray-100">0.0 - 0.49</p>
            <p className="text-sm font-semibold text-gray-200">Poor</p>
          </div>
          <div className={`p-4 rounded-xl text-center shadow-lg ${currentRating?.text === 'Very Poor' ? 'ring-2 ring-teal-400' : ''}`}>
            <p className="font-bold text-gray-100">&lt; 0.0</p>
            <p className="text-sm font-semibold text-gray-200">Very Poor</p>
          </div>
        </div>
      </div>

      {/* SEO-friendly descriptive content */}
      <div className="text-gray-400 text-sm mt-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">What is the Sharpe Ratio?</h2>
        <p>
          The <strong>Sharpe Ratio</strong> is a widely-used metric in finance for measuring the risk-adjusted performance of an investment or portfolio. It tells you whether the returns you are earning are the result of smart decisions or simply a consequence of taking on excessive risk. A higher Sharpe Ratio indicates better <strong>risk-adjusted return</strong>. This <strong>Sharpe Ratio calculator</strong> is essential for comparing options strategies, portfolios, or any investment with different risk profiles.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          The Sharpe Ratio is calculated using the formula: <strong>Sharpe Ratio = (Portfolio Return − Risk-Free Rate) / Standard Deviation</strong>. Each component plays a specific role:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Portfolio Return (Rp)</strong>: The total percentage gain or loss of your investment.</li>
          <li><strong>Risk-Free Rate (Rf)</strong>: The return from a low-risk benchmark, typically U.S. Treasury bills.</li>
          <li><strong>Standard Deviation (σp)</strong>: Measures the total volatility of your investment&apos;s returns, both upside and downside.</li>
        </ul>
        <p>The result tells you how many units of excess return you earn per unit of risk taken.</p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter the <strong>Investment Return (%)</strong>: The percentage gain or loss of your portfolio or strategy.</li>
          <li>Enter the <strong>Risk-Free Rate (%)</strong>: The return of a low-risk benchmark (e.g., U.S. T-bill rate).</li>
          <li>Enter the <strong>Standard Deviation (%)</strong>: The historical volatility of your investment&apos;s returns.</li>
          <li>The <strong>Sharpe Ratio</strong> is calculated automatically, along with a rating guide to help you interpret the result.</li>
        </ol>
      </div>
    </div>
  );
};

export default SharpeRatioCalculator;
