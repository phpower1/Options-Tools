"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import MarginChart from './MarginChart';

const MarginCalculator = () => {
    const [initialCapital, setInitialCapital] = useState<number>(10000);
    const [marginLoan, setMarginLoan] = useState<number>(10000);
    const [interestRate, setInterestRate] = useState<number>(8.0);
    const [durationDays, setDurationDays] = useState<number>(365);
    const [stockPriceChange, setStockPriceChange] = useState<number>(10.0);
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        calculateResults();
    }, [initialCapital, marginLoan, interestRate, durationDays, stockPriceChange]);

    const calculateResults = () => {
        const totalBuyingPower = initialCapital + marginLoan;
        const interestCost = (marginLoan * (interestRate / 100) * durationDays) / 365;

        // Profit without margin (based on initial capital only)
        const profitWithoutMargin = initialCapital * (stockPriceChange / 100);
        const totalValueWithoutMargin = initialCapital + profitWithoutMargin;
        const roiWithoutMargin = (profitWithoutMargin / initialCapital) * 100;

        // Profit with margin (based on total buying power)
        const grossProfitWithMargin = totalBuyingPower * (stockPriceChange / 100);
        const netProfitWithMargin = grossProfitWithMargin - interestCost;
        const totalValueWithMargin = initialCapital + netProfitWithMargin; // Equity value
        const roiWithMargin = (netProfitWithMargin / initialCapital) * 100;

        // Margin Call Calculation (Approximate: Maintenance Margin usually 25-30%)
        // Equity = Total Value - Loan
        // Margin Call when Equity / Total Value < Maintenance Requirement (e.g., 30%)
        // Let's assume 30% maintenance margin for this calculator
        const maintenanceMargin = 0.30;
        // Formula: (Loan) / (1 - Maintenance Margin)
        // This gives the total account value at margin call. 
        // To find the percentage drop: (Current Total Value - Call Value) / Current Total Value

        // However, a simpler view for users is "At what portfolio value do I get called?"
        const marginCallValue = marginLoan / (1 - maintenanceMargin);
        const marginCallPercentageDrop = ((totalBuyingPower - marginCallValue) / totalBuyingPower) * 100;

        setResults({
            totalBuyingPower,
            interestCost,
            profitWithoutMargin,
            totalValueWithoutMargin,
            roiWithoutMargin,
            grossProfitWithMargin,
            netProfitWithMargin,
            totalValueWithMargin,
            roiWithMargin,
            marginCallValue,
            marginCallPercentageDrop
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const formatPercent = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    return (
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Margin Calculator",
                    "description": "Calculate the potential returns and risks of trading with margin.",
                    "mainEntity": {
                        "@type": "Calculator",
                        "name": "Margin Calculator",
                        "description": "Calculates profit, loss, and margin call levels for margin trading.",
                        "url": "https://www.tradetoolshub.com/?tool=margin-calculator",
                        "potentialAction": {
                            "@type": "PerformAction",
                            "name": "Calculate Margin Outcomes"
                        }
                    }
                })
            }} />

            <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
                Margin Calculator
            </h1>
            <p className="text-center text-gray-400 mb-8">
                See how leverage amplifies both your potential gains and losses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                            <DollarSign className="mr-2 text-teal-400" size={20} /> Account Setup
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Initial Capital ($)</label>
                                <input
                                    type="number"
                                    value={initialCapital}
                                    onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Margin Loan ($)</label>
                                <input
                                    type="number"
                                    value={marginLoan}
                                    onChange={(e) => setMarginLoan(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leverage: {((initialCapital + marginLoan) / initialCapital).toFixed(2)}x</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Annual Interest Rate (%)</label>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                            <TrendingUp className="mr-2 text-blue-400" size={20} /> Trade Scenarios
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (Days)</label>
                                <input
                                    type="number"
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Stock Price Change (%)</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="-50"
                                        max="50"
                                        value={stockPriceChange}
                                        onChange={(e) => setStockPriceChange(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className={`font-mono font-bold w-16 text-right ${stockPriceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {stockPriceChange > 0 ? '+' : ''}{stockPriceChange}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Results */}
                <div className="space-y-6">
                    {results && (
                        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center">
                                    <RefreshCw className="mr-2 text-purple-400" size={20} /> Results Analysis
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-400 mb-1">Buying Power</p>
                                        <p className="text-xl font-bold text-white">{formatCurrency(results.totalBuyingPower)}</p>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-400 mb-1">Interest Cost</p>
                                        <p className="text-xl font-bold text-red-300">-{formatCurrency(results.interestCost)}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Comparison Row */}
                                    <div className="flex items-center justify-between border-b border-gray-600 pb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Return Without Margin</p>
                                            <p className={`text-2xl font-bold ${results.profitWithoutMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatCurrency(results.profitWithoutMargin)}
                                            </p>
                                            <p className="text-sm text-gray-500">{formatPercent(results.roiWithoutMargin)} ROI</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm">Return With Margin</p>
                                            <p className={`text-2xl font-bold ${results.netProfitWithMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatCurrency(results.netProfitWithMargin)}
                                            </p>
                                            <p className="text-sm text-gray-500">{formatPercent(results.roiWithMargin)} ROI</p>
                                        </div>
                                    </div>

                                    {/* Magnifier Effect */}
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-2">Leverage Effect</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Gain/Loss Multiifier:</span>
                                            <span className="font-bold text-yellow-400">
                                                {Math.abs(results.roiWithMargin / results.roiWithoutMargin).toFixed(1)}x
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Using margin amplifies your outcome by approximately {((initialCapital + marginLoan) / initialCapital).toFixed(1)} times (minus interest).
                                        </p>
                                    </div>

                                    {/* Margin Call Warning */}
                                    {results.totalBuyingPower > results.marginCallValue && (
                                        <div className="bg-red-900/30 border border-red-800/50 p-4 rounded-lg">
                                            <p className="text-red-300 text-sm font-semibold flex items-center">
                                                <TrendingDown className="mr-2" size={16} /> Margin Call Risk
                                            </p>
                                            <p className="text-gray-300 text-xs mt-1">
                                                You may face a margin call if your portfolio drops by <span className="text-white font-bold">{formatPercent(results.marginCallPercentageDrop)}</span> to <span className="text-white font-bold">{formatCurrency(results.marginCallValue)}</span>.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {results && (
                <div className="mt-8">
                    <MarginChart
                        initialCapital={initialCapital}
                        marginLoan={marginLoan}
                        interestCost={results.interestCost}
                    />
                </div>
            )}


            <div className="text-gray-400 text-sm mt-8 space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-200">Understanding Margin Trading</h2>
                <p>
                    Margin trading involves borrowing money from your broker to purchase stock. This allows you to buy more stock than you'd be able to normally.
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Leverage:</strong> Magnifies both gains and losses.</li>
                    <li><strong>Interest:</strong> You pay interest on the borrowed money, which raises your breakeven point.</li>
                    <li><strong>Margin Call:</strong> If your account value falls below a certain level (maintenance margin), you may be forced to deposit more cash or sell assets.</li>
                </ul>
            </div>

        </div >
    );
};

export default MarginCalculator;
