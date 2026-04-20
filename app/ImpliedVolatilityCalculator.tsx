"use client";

import { useState, useEffect } from "react";
import { LucideGauge } from "lucide-react";

type IVInputs = {
  stockPrice: string;
  strikePrice: string;
  optionPrice: string;
  daysToExpiration: string;
  riskFreeRate: string;
  optionType: "call" | "put";
};

// Simplified Black-Scholes for IV calculation
const calculateIV = (
  stockPrice: number,
  strikePrice: number,
  optionPrice: number,
  daysToExpiration: number,
  riskFreeRate: number,
  optionType: "call" | "put"
): number | null => {
  const S = stockPrice;
  const K = strikePrice;
  const T = daysToExpiration / 365;
  const R = riskFreeRate;
  const C = optionPrice;

  // We need to use an iterative approach (like the Bisection Method or Newton-Raphson)
  // to find the IV. For simplicity, we'll use a manual iterative guess.
  const tolerance = 0.0001;
  let iv = 0.2; // Initial guess
  let maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const d1 =
      (Math.log(S / K) + (R + (iv * iv) / 2) * T) / (iv * Math.sqrt(T));
    const d2 = d1 - iv * Math.sqrt(T);

    const N_d1 = (x: number) => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      const sign = x >= 0 ? 1 : -1;
      const t = 1 / (1 + p * Math.abs(x));
      const z =
        1 -
        sign *
          (a1 * t +
            a2 * Math.pow(t, 2) +
            a3 * Math.pow(t, 3) +
            a4 * Math.pow(t, 4) +
            a5 * Math.pow(t, 5)) *
          Math.exp(-Math.pow(x, 2) / 2) /
          Math.sqrt(2 * Math.PI);
      return z;
    };

    const N_prime_d1 = (x: number) => {
      return Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
    };

    let calculatedPrice;
    if (optionType === "call") {
      calculatedPrice =
        S * N_d1(d1) - K * Math.exp(-R * T) * N_d1(d2);
    } else {
      calculatedPrice =
        K * Math.exp(-R * T) * (1 - N_d1(d2)) - S * (1 - N_d1(d1));
    }

    const vega = S * N_prime_d1(d1) * Math.sqrt(T);
    const difference = calculatedPrice - C;

    if (Math.abs(difference) < tolerance) {
      return iv;
    }

    iv = iv - difference / vega;
  }
  return null;
};

// JSON-LD for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Tool",
  "name": "Implied Volatility (IV) Calculator",
  "description": "Calculate the implied volatility of an option to determine if it is over- or undervalued.",
  "url": "https://www.tradetoolshub.com/iv-calculator",
  "keywords": "implied volatility calculator, iv calculator, options trading, implied volatility, options pricing, financial tools",
};

export default function ImpliedVolatilityCalculator() {
  const [inputs, setInputs] = useState<IVInputs>({
    stockPrice: "",
    strikePrice: "",
    optionPrice: "",
    daysToExpiration: "",
    riskFreeRate: "",
    optionType: "call",
  });
  const [iv, setIv] = useState<string | null>(null);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionTypeChange = (type: "call" | "put") => {
    setInputs((prev) => ({ ...prev, optionType: type }));
  };

  useEffect(() => {
    const storedData = localStorage.getItem("ivData");
    if (storedData) {
      setInputs(JSON.parse(storedData));
    }
    setIsLocalStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (isLocalStorageLoaded) {
      localStorage.setItem("ivData", JSON.stringify(inputs));
    }

    const {
      stockPrice,
      strikePrice,
      optionPrice,
      daysToExpiration,
      riskFreeRate,
      optionType,
    } = inputs;

    if (
      stockPrice &&
      strikePrice &&
      optionPrice &&
      daysToExpiration &&
      riskFreeRate
    ) {
      const calculatedIV = calculateIV(
        Number(stockPrice),
        Number(strikePrice),
        Number(optionPrice),
        Number(daysToExpiration),
        Number(riskFreeRate) / 100,
        optionType
      );
      if (calculatedIV !== null && !isNaN(calculatedIV)) {
        setIv((calculatedIV * 100).toFixed(2) + "%");
      } else {
        setIv("N/A");
      }
    } else {
      setIv(null);
    }
  }, [inputs, isLocalStorageLoaded]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-8 bg-gray-800 text-white rounded-xl shadow-lg w-full max-w-4xl mx-auto my-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200 text-center">
          Implied Volatility (IV) Calculator
        </h2>
        <p className="text-gray-400 text-center text-sm md:text-base mb-4">
          Calculate the implied volatility of a stock option.
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
              value={inputs.stockPrice}
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
              value={inputs.strikePrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 155"
            />
          </div>

          <div>
            <label
              htmlFor="optionPrice"
              className="block text-sm font-medium text-gray-300"
            >
              Option Price ($)
            </label>
            <input
              type="number"
              name="optionPrice"
              id="optionPrice"
              value={inputs.optionPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 2.50"
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
              value={inputs.daysToExpiration}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-white p-2.5 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50 transition"
              placeholder="e.g., 30"
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
              value={inputs.riskFreeRate}
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
                onClick={() => handleOptionTypeChange("call")}
                className={`py-2 px-4 rounded-md font-medium transition ${
                  inputs.optionType === "call"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Call
              </button>
              <button
                onClick={() => handleOptionTypeChange("put")}
                className={`py-2 px-4 rounded-md font-medium transition ${
                  inputs.optionType === "put"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Put
              </button>
            </div>
          </div>
        </div>

        {iv && (
          <div className="w-full mt-6">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 text-center">
              <LucideGauge size={24} className="text-purple-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium uppercase">
                Implied Volatility
              </p>
              <p className="text-xl font-bold text-white mt-1">{iv}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 space-y-4 text-gray-300 w-full max-w-4xl mx-auto my-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          What is the Implied Volatility (IV) Calculator?
        </h2>
        <p className="text-gray-400">
          <strong>Implied Volatility (IV)</strong> is a key metric in options trading that represents the market&apos;s expectation of future price swings for an underlying asset. Unlike historical volatility, which is backward-looking, IV is forward-looking and directly embedded in an option&apos;s market price. A higher IV makes options more expensive; lower IV makes them cheaper. This <strong>IV calculator</strong> lets you back-solve for implied volatility from any option&apos;s market price — useful for identifying over- or under-priced contracts.
        </p>

        <h3 className="text-xl md:text-2xl font-semibold text-white">
          How It Works
        </h3>
        <p className="text-gray-400">
          The Black-Scholes model prices an option given a volatility input. This calculator reverses that process: given the observed market price, it iteratively searches for the volatility value that would produce that price. This technique — known as <strong>Newton-Raphson iteration</strong> — starts with an initial volatility guess (20%) and refines it on each step using the option&apos;s Vega until the calculated price converges with the market price. The result is the market&apos;s implied expectation of future volatility, expressed as an annualized percentage.
        </p>

        <h3 className="text-xl md:text-2xl font-semibold text-white">
          How to Use the Tool
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-400">
          <li>Select your <strong>Option Type</strong>: choose Call or Put.</li>
          <li>Enter the <strong>Stock Price ($)</strong>: the current market price of the underlying asset.</li>
          <li>Enter the <strong>Strike Price ($)</strong>: the option&apos;s exercise price.</li>
          <li>Enter the <strong>Option Price ($)</strong>: the current market price (premium) of the option contract.</li>
          <li>Enter <strong>Days to Expiration</strong>: the number of calendar days remaining until expiry.</li>
          <li>Enter the <strong>Risk-Free Rate (%)</strong>: typically the current U.S. T-bill rate.</li>
          <li>The <strong>Implied Volatility</strong> is calculated automatically. Compare it to historical volatility to assess whether the option is relatively cheap or expensive.</li>
        </ol>
      </div>
    </>
  );
}