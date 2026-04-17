"use client";

import { useState, useEffect } from 'react';

const SortinoRatioCalculator = () => {
  const [investmentReturn, setInvestmentReturn] = useState('');
  const [riskFreeRate, setRiskFreeRate] = useState('');
  const [downsideDeviation, setDownsideDeviation] = useState('');
  const [sortinoRatio, setSortinoRatio] = useState<number | null>(null);

  // Function to calculate Sortino Ratio
  const calculateSortinoRatio = () => {
    const rp = parseFloat(investmentReturn);
    const rf = parseFloat(riskFreeRate);
    const sigmaD = parseFloat(downsideDeviation);

    if (isNaN(rp) || isNaN(rf) || isNaN(sigmaD) || sigmaD <= 0) {
      setSortinoRatio(null);
      return;
    }

    const calculatedSortino = (rp - rf) / sigmaD;
    setSortinoRatio(calculatedSortino);
  };

  // Effect to load data from local storage on component mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('sortinoRatioCalculatorState');
      if (storedState) {
        const { investmentReturn, riskFreeRate, downsideDeviation } = JSON.parse(storedState);
        setInvestmentReturn(investmentReturn);
        setRiskFreeRate(riskFreeRate);
        setDownsideDeviation(downsideDeviation);
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
    }
  }, []);

  // Effect to save data to local storage and recalculate whenever inputs change
  useEffect(() => {
    try {
      const stateToSave = { investmentReturn, riskFreeRate, downsideDeviation };
      localStorage.setItem('sortinoRatioCalculatorState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
    calculateSortinoRatio();
  }, [investmentReturn, riskFreeRate, downsideDeviation]);

  // Helper function to get the Sortino Ratio rating
  const getSortinoRating = (ratio: number | null) => {
    if (ratio === null || isNaN(ratio)) return null;
    if (ratio >= 2.0) return { text: 'Excellent', color: 'bg-green-600' };
    if (ratio >= 1.0) return { text: 'Good', color: 'bg-green-500' };
    if (ratio >= 0.5) return { text: 'Fair', color: 'bg-lime-500' };
    if (ratio >= 0.0) return { text: 'Poor', color: 'bg-yellow-500' };
    return { text: 'Very Poor', color: 'bg-red-600' };
  };

  const currentRating = getSortinoRating(sortinoRatio);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      {/* JSON-LD for the Sortino Ratio Calculator */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sortino Ratio Calculator",
          "description": "A financial calculator for investors and options traders to determine the risk-adjusted return of an investment, focusing on downside volatility.",
          "mainEntity": {
            "@type": "HowTo",
            "name": "Calculate Sortino Ratio",
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
                "text": "Enter the downside deviation percentage of the investment."
              }
            ]
          }
        })
      }} />

      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
        Sortino Ratio Calculator
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Measure an investment's risk-adjusted return by focusing on downside volatility.
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
            <label htmlFor="downside-deviation" className="block text-sm font-medium text-gray-300">
              Downside Deviation (%)
            </label>
            <input
              type="number"
              id="downside-deviation"
              value={downsideDeviation}
              onChange={(e) => setDownsideDeviation(e.target.value)}
              placeholder="e.g., 8"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Display Results */}
      {sortinoRatio !== null && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-md">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Sortino Ratio</p>
            <p className="text-4xl font-extrabold text-teal-400">{sortinoRatio.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Sortino Ratio Rating Guide */}
      <div className="mt-8 p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-md">
        <h3 className="text-xl font-bold text-gray-300 mb-4 text-center">Sortino Ratio Rating Guide</h3>
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">What is the Sortino Ratio?</h2>
        <p>
          The <strong>Sortino Ratio</strong> is a variation of the Sharpe Ratio that differentiates between harmful and harmless volatility. Instead of penalizing all volatility, it focuses exclusively on <strong>downside deviation</strong> — the volatility of negative returns below a target threshold. This makes it a more precise <strong>risk-adjusted performance metric</strong> for options strategies and portfolios with asymmetric payoff profiles, where upside volatility is not a risk.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          The Sortino Ratio uses the formula: <strong>Sortino Ratio = (Portfolio Return − Risk-Free Rate) / Downside Deviation</strong>. The key distinction from the Sharpe Ratio is in the denominator:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Portfolio Return (Rp)</strong>: The total percentage gain or loss of your investment.</li>
          <li><strong>Risk-Free Rate (Rf)</strong>: The return from a low-risk benchmark such as U.S. Treasury bills.</li>
          <li><strong>Downside Deviation (σd)</strong>: Only measures the volatility of returns that fall <em>below</em> the risk-free rate, ignoring upside swings.</li>
        </ul>
        <p>A higher Sortino Ratio means the strategy generates strong returns relative to the risk of loss, without being penalized for beneficial upside volatility.</p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter the <strong>Investment Return (%)</strong>: The percentage gain or loss of your portfolio or strategy.</li>
          <li>Enter the <strong>Risk-Free Rate (%)</strong>: The return of a low-risk benchmark (e.g., U.S. T-bill rate).</li>
          <li>Enter the <strong>Downside Deviation (%)</strong>: The volatility of returns that fall below the risk-free rate.</li>
          <li>The <strong>Sortino Ratio</strong> is calculated automatically, along with a rating guide to help you interpret the result.</li>
        </ol>
      </div>
    </div>
  );
};

export default SortinoRatioCalculator;
