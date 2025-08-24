"use client";

import { useState, useEffect } from 'react';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';

const ROICalculator = () => {
  // Define a type for a single investment
  type Investment = {
    initialInvestment: string;
    premium: string;
    durationDays: string;
    id: number;
    ticker: string; // New property for the ticker symbol
  };

  // State to hold all investments
  const [investments, setInvestments] = useState<Investment[]>([]);
  // State to manage the loading status for local storage
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  // State for a message box
  const [message, setMessage] = useState('');

  // Effect to load investments from local storage on component mount
  useEffect(() => {
    try {
      const storedInvestments = localStorage.getItem('optionsInvestments');
      if (storedInvestments) {
        setInvestments(JSON.parse(storedInvestments));
      } else {
        // If no data exists, start with one investment field
        setInvestments([{ id: Date.now(), initialInvestment: '', premium: '', durationDays: '', ticker: '' }]);
      }
    } catch (error) {
      console.error("Failed to load from local storage:", error);
      // Fallback to a single empty field
      setInvestments([{ id: Date.now(), initialInvestment: '', premium: '', durationDays: '', ticker: '' }]);
      setMessage('Error loading saved data. Starting fresh.');
    } finally {
      setIsLocalStorageLoaded(true);
    }
  }, []);

  // Effect to save investments to local storage whenever they change
  useEffect(() => {
    if (isLocalStorageLoaded) {
      try {
        localStorage.setItem('optionsInvestments', JSON.stringify(investments));
      } catch (error) {
        console.error("Failed to save to local storage:", error);
        setMessage('Error saving data automatically. Please check your browser settings.');
      }
    }
  }, [investments, isLocalStorageLoaded]);

  // Function to handle changes in a specific investment field
  const handleInputChange = (id: number, field: keyof Investment, value: string) => {
    const updatedInvestments = investments.map(inv => {
      if (inv.id === id) {
        // Automatically convert the ticker value to uppercase
        const updatedValue = field === 'ticker' ? value.toUpperCase() : value;
        return { ...inv, [field]: updatedValue };
      }
      return inv;
    });
    setInvestments(updatedInvestments);
  };

  // Function to add a new investment field, up to a maximum of 3
  const addInvestment = () => {
    if (investments.length < 3) {
      setInvestments([...investments, { id: Date.now(), initialInvestment: '', premium: '', durationDays: '', ticker: '' }]);
    }
  };

  // Function to remove an investment field
  const removeInvestment = (id: number) => {
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(updatedInvestments);
  };

  // Function to clear all investments and reset the form
  const clearInvestments = () => {
    setInvestments([{ id: Date.now(), initialInvestment: '', premium: '', durationDays: '', ticker: '' }]);
    localStorage.removeItem('optionsInvestments');
    setMessage('All data cleared successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Function to calculate and return the results for a single investment
  const calculateResults = (inv: Investment) => {
    const initial = parseFloat(inv.initialInvestment);
    const premium = parseFloat(inv.premium);
    const duration = parseFloat(inv.durationDays);

    // Check for valid numbers and prevent division by zero
    if (isNaN(initial) || isNaN(premium) || isNaN(duration) || initial === 0 || duration === 0) {
      return null;
    }

    const roi = (premium / initial) * 100;
    const premiumPerDay = premium / duration;
    const annualizedRoi = (premiumPerDay * 365 / initial) * 100;

    return {
      roi: roi.toFixed(2),
      annualizedRoi: annualizedRoi.toFixed(2),
      premiumPerDay: premiumPerDay.toFixed(2),
    };
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
        ROI Calculator
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Calculate ROI, Annualized ROI, and Premium per Day for your options trades.
      </p>

      {/* Input Form */}
      <div className="space-y-8">
        {investments.map(inv => (
          <div key={inv.id} className="bg-gray-700 rounded-lg p-5 border border-gray-600 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-300">
                {inv.ticker ? `${inv.ticker} (${investments.indexOf(inv) + 1})` : `Investment ${investments.indexOf(inv) + 1}`}
              </h2>
              {investments.length > 1 && (
                <button
                  onClick={() => removeInvestment(inv.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Remove investment"
                >
                  <MinusCircle size={24} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div>
                <label htmlFor={`ticker-${inv.id}`} className="block text-sm font-medium text-gray-300">
                  Ticker
                </label>
                <input
                  type="text"
                  id={`ticker-${inv.id}`}
                  value={inv.ticker}
                  onChange={(e) => handleInputChange(inv.id, 'ticker', e.target.value)}
                  placeholder="e.g., TSLA"
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor={`initial-${inv.id}`} className="block text-sm font-medium text-gray-300">
                  Initial Investment ($)
                </label>
                <input
                  type="number"
                  id={`initial-${inv.id}`}
                  value={inv.initialInvestment}
                  onChange={(e) => handleInputChange(inv.id, 'initialInvestment', e.target.value)}
                  placeholder="e.g., 1000"
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor={`premium-${inv.id}`} className="block text-sm font-medium text-gray-300">
                  Premium ($)
                </label>
                <input
                  type="number"
                  id={`premium-${inv.id}`}
                  value={inv.premium}
                  onChange={(e) => handleInputChange(inv.id, 'premium', e.target.value)}
                  placeholder="e.g., 250"
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor={`duration-${inv.id}`} className="block text-sm font-medium text-gray-300">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  id={`duration-${inv.id}`}
                  value={inv.durationDays}
                  onChange={(e) => handleInputChange(inv.id, 'durationDays', e.target.value)}
                  placeholder="e.g., 30"
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Display Results */}
            {calculateResults(inv) && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-700 rounded-md">
                    <p className="text-xs text-gray-400">ROI</p>
                    <p className="text-xl font-bold text-teal-400">{calculateResults(inv)?.roi}%</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-md">
                    <p className="text-xs text-gray-400">Annualized ROI</p>
                    <p className="text-xl font-bold text-teal-400">{calculateResults(inv)?.annualizedRoi}%</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-md">
                    <p className="text-xs text-gray-400">Premium per Day</p>
                    <p className="text-xl font-bold text-teal-400">${calculateResults(inv)?.premiumPerDay}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        {investments.length < 3 && (
          <button
            onClick={addInvestment}
            className="flex items-center space-x-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <PlusCircle size={20} />
            <span>Add Investment</span>
          </button>
        )}
        <button
          onClick={clearInvestments}
          className="flex items-center space-x-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <Trash2 size={20} />
          <span>Clear All</span>
        </button>
      </div>

      {/* SEO-friendly descriptive content */}
      <div className="text-gray-400 text-sm mt-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">What is this Options Calculator?</h2>
        <p>
          This is an essential tool for options traders looking to quickly analyze the profitability of their trades. Our **options calculator** provides three key metrics: **Return on Investment (ROI)**, **Annualized ROI**, and **Premium per Day**. By entering your initial investment, the premium received (or paid), and the duration of the trade, you can get a clear picture of a trade's performance. This is particularly useful for comparing multiple options contracts or strategies side-by-side.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          The **options ROI calculator** uses simple formulas to provide accurate results. The **ROI** is calculated by dividing the premium by the initial investment, giving you a percentage return on your capital. The **Premium per Day** metric shows you the daily cash flow from the trade, which is a great way to evaluate the effectiveness of your strategy over time. Finally, the **Annualized ROI** projects your return over a full year, giving you a powerful metric to compare short-term options trades to long-term investments.
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter the **Initial Investment ($)**: The amount of collateral or margin required for your trade.</li>
          <li>Enter the **Premium ($)**: The net profit or loss you received from the trade.</li>
          <li>Enter the **Duration (Days)**: The number of days the trade was open.</li>
          <li>Click the **Add Investment** button to compare up to three different trades.</li>
          <li>Your results will appear automatically, helping you make informed trading decisions. All your data is saved locally for easy access on your next visit.</li>
        </ol>
      </div>
    </div>
  );
};

export default ROICalculator;
