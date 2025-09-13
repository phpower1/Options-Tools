"use client";

import { useState, useEffect } from "react";
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideClock,
  LucideGauge,
  LucideArrowLeftRight,
} from "lucide-react";

type Greeks = {
  delta: string;
  gamma: string;
  theta: string;
  vega: string;
};

// Simplified Black-Scholes for educational purposes
const calculateGreeks = (
  stockPrice: number,
  strikePrice: number,
  daysToExpiration: number,
  volatility: number,
  riskFreeRate: number,
  optionType: "call" | "put"
): Greeks => {
  const S = stockPrice;
  const K = strikePrice;
  const T = daysToExpiration / 365;
  const V = volatility;
  const R = riskFreeRate;

  if (S <= 0 || K <= 0 || T <= 0 || V <= 0) {
    return {
      delta: "N/A",
      gamma: "N/A",
      theta: "N/A",
      vega: "N/A",
    };
  }

  const d1 =
    (Math.log(S / K) + (R + Math.pow(V, 2) / 2) * T) / (V * Math.sqrt(T));
  const d2 = d1 - V * Math.sqrt(T);

  const N_d1 = (x: number) => {
    // Cumulative distribution function (CDF) for normal distribution
    // This is an approximation for simplicity
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    const t = 1 / (1 + p * Math.abs(x));
    const z = 1 -
      sign *
        (a1 * t + a2 * Math.pow(t, 2) + a3 * Math.pow(t, 3) + a4 * Math.pow(t, 4) +
          a5 * Math.pow(t, 5)) *
        Math.exp(-Math.pow(x, 2) / 2) /
        Math.sqrt(2 * Math.PI);
    return z;
  };

  const N_prime_d1 = (x: number) => {
    // Probability density function (PDF) for normal distribution
    return Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
  };

  let delta, gamma, theta, vega;
  if (optionType === "call") {
    delta = N_d1(d1);
    gamma = N_prime_d1(d1) / (S * V * Math.sqrt(T));
    theta =
      (-S * N_prime_d1(d1) * V) / (2 * Math.sqrt(T)) -
      R * K * Math.exp(-R * T) * N_d1(d2);
    vega = S * N_prime_d1(d1) * Math.sqrt(T);
  } else {
    delta = N_d1(d1) - 1;
    gamma = N_prime_d1(d1) / (S * V * Math.sqrt(T));
    theta =
      (-S * N_prime_d1(d1) * V) / (2 * Math.sqrt(T)) +
      R * K * Math.exp(-R * T) * (1 - N_d1(d2));
    vega = S * N_prime_d1(d1) * Math.sqrt(T);
  }

  return {
    delta: (delta * 100).toFixed(2) + "%",
    gamma: gamma.toFixed(4),
    theta: (theta / 365).toFixed(4), // Theta is often shown per day
    vega: (vega / 100).toFixed(4), // Vega is often shown per 1% change in volatility
  };
};

// JSON-LD for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Tool",
  "name": "Greeks Calculator",
  "description": "Calculate option Greeks (Delta, Gamma, Theta, Vega) to measure the sensitivity of an option's price to various factors.",
  "url": "https://www.tradetoolshub.com/greeks-calculator",
  "keywords": "options greeks, delta, gamma, theta, vega, options trading, greeks calculator",
};

export default function GreeksCalculator() {
  const [stockPrice, setStockPrice] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [daysToExpiration, setDaysToExpiration] = useState("");
  const [volatility, setVolatility] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState("");
  const [optionType, setOptionType] = useState("call");
  const [results, setResults] = useState<Greeks | null>(null);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "stockPrice") setStockPrice(value);
    if (name === "strikePrice") setStrikePrice(value);
    if (name === "daysToExpiration") setDaysToExpiration(value);
    if (name === "volatility") setVolatility(value);
    if (name === "riskFreeRate") setRiskFreeRate(value);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("greeksData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setStockPrice(data.stockPrice || "");
      setStrikePrice(data.strikePrice || "");
      setDaysToExpiration(data.daysToExpiration || "");
      setVolatility(data.volatility || "");
      setRiskFreeRate(data.riskFreeRate || "");
      setOptionType(data.optionType || "call");
    }
    setIsLocalStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (isLocalStorageLoaded) {
      localStorage.setItem(
        "greeksData",
        JSON.stringify({
          stockPrice,
          strikePrice,
          daysToExpiration,
          volatility,
          riskFreeRate,
          optionType,
        })
      );
    }

    if (
      stockPrice &&
      strikePrice &&
      daysToExpiration &&
      volatility &&
      riskFreeRate
    ) {
      const greeks = calculateGreeks(
        Number(stockPrice),
        Number(strikePrice),
        Number(daysToExpiration),
        Number(volatility) / 100, // Convert percentage to decimal
        Number(riskFreeRate) / 100, // Convert percentage to decimal
        optionType as "call" | "put"
      );
      setResults(greeks);
    } else {
      setResults(null);
    }
  }, [
    stockPrice,
    strikePrice,
    daysToExpiration,
    volatility,
    riskFreeRate,
    optionType,
    isLocalStorageLoaded,
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-8 bg-gray-800 text-white rounded-xl shadow-lg w-full max-w-4xl mx-auto my-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200 text-center">
          Greeks Calculator
        </h1>
        <p className="text-gray-400 text-center text-sm md:text-base mb-4">
          Calculate the most important metrics for options trading.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div>
            <label
              htmlFor="stockPrice"
              className="block text-sm font-medium text-gray-300"
            >
              Stock Price ($)
            </label>
            <input
              type="number"
              name="stockPrice"
              id="stockPrice"
              value={stockPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label
              htmlFor="strikePrice"
              className="block text-sm font-medium text-gray-300"
            >
              Strike Price ($)
            </label>
            <input
              type="number"
              name="strikePrice"
              id="strikePrice"
              value={strikePrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 155"
            />
          </div>

          <div>
            <label
              htmlFor="daysToExpiration"
              className="block text-sm font-medium text-gray-300"
            >
              Days to Expiration
            </label>
            <input
              type="number"
              name="daysToExpiration"
              id="daysToExpiration"
              value={daysToExpiration}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label
              htmlFor="volatility"
              className="block text-sm font-medium text-gray-300"
            >
              Implied Volatility (%)
            </label>
            <input
              type="number"
              name="volatility"
              id="volatility"
              value={volatility}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 25"
            />
          </div>

          <div>
            <label
              htmlFor="riskFreeRate"
              className="block text-sm font-medium text-gray-300"
            >
              Risk-Free Rate (%)
            </label>
            <input
              type="number"
              name="riskFreeRate"
              id="riskFreeRate"
              value={riskFreeRate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Option Type
            </label>
            <div className="mt-1 flex space-x-4">
              <button
                onClick={() => setOptionType("call")}
                className={`py-2 px-4 rounded-md font-medium transition ${
                  optionType === "call"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Call
              </button>
              <button
                onClick={() => setOptionType("put")}
                className={`py-2 px-4 rounded-md font-medium transition ${
                  optionType === "put"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Put
              </button>
            </div>
          </div>
        </div>
        {results && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 text-center">
              <LucideTrendingUp size={24} className="text-green-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium uppercase">
                Delta
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {results.delta}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 text-center">
              <LucideArrowLeftRight
                size={24}
                className="text-purple-400 mb-2"
              />
              <p className="text-xs text-gray-400 font-medium uppercase">
                Gamma
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {results.gamma}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 text-center">
              <LucideClock size={24} className="text-yellow-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium uppercase">
                Theta
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {results.theta}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 text-center">
              <LucideGauge size={24} className="text-blue-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium uppercase">
                Vega
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {results.vega}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 space-y-4 text-gray-300 w-full max-w-4xl mx-auto my-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white">
          What are the Greeks?
        </h3>
        <p className="text-gray-400">
          The **Greeks** are a set of metrics used in options trading to measure the sensitivity of an option's price to various factors, such as the underlying asset's price, volatility, and time decay. They are essential tools for a trader to understand the risk and reward of an options contract. This calculator will provide the values for Delta, Gamma, Theta, and Vega.
        </p>

        <h3 className="text-xl md:text-2xl font-semibold text-white">
          Understanding the Metrics
        </h3>
        <ul className="space-y-4 text-gray-400 list-disc list-inside">
          <li>
            **Delta ($\Delta$)**: Delta measures the change in an option's price for every one-dollar change in the underlying asset's price. For example, a call option with a Delta of 0.50 means the option's price will increase by $0.50 if the underlying stock price rises by $1.00.
          </li>
          <li>
            **Gamma ($\Gamma$)**: Gamma measures the rate of change of an option's Delta. It tells you how much the Delta will change for every one-dollar move in the underlying asset. A high Gamma indicates that the Delta will change rapidly, making the option more sensitive to price movements.
          </li>
          <li>
            **Theta ($\Theta$)**: Theta measures the rate at which an option's value decays over time. It is often referred to as "time decay." A negative Theta means the option's value decreases each day as it approaches expiration.
          </li>
          <li>
            **Vega ($\nu$)**: Vega measures an option's sensitivity to changes in the implied volatility of the underlying asset. A high Vega means the option's value will increase significantly if implied volatility rises.
          </li>
        </ul>

        <h3 className="text-xl md:text-2xl font-semibold text-white">
          How to Use the Tool
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-400">
          <li>
            **Select Option Type**: Choose whether you are trading a Call or a Put option.
          </li>
          <li>
            **Enter Inputs**: Fill in the required fields, including the **Stock Price**, **Strike Price**, **Days to Expiration**, **Implied Volatility**, and **Risk-Free Rate**.
          </li>
          <li>
            **Review Results**: The Greeks (Delta, Gamma, Theta, and Vega) will be calculated and displayed automatically.
          </li>
        </ol>
      </div>
    </>
  );
}
