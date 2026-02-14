"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface MarginChartProps {
    initialCapital: number;
    marginLoan: number;
    interestCost: number;
}

const MarginChart = ({ initialCapital, marginLoan, interestCost }: MarginChartProps) => {
    // Generate data points from -50% to +50% change
    const data = [];
    for (let i = -50; i <= 50; i += 10) {
        const changePercent = i / 100;

        // Cash Only: Profit = Capital * changePercent
        // Total Value = Capital + Profit
        const cashValue = initialCapital * (1 + changePercent);

        // Margin: 
        // Total Portfolio Value = (Capital + Loan) * (1 + changePercent)
        // Equity Value = Total Portfolio Value - Loan - Interest
        const totalPortfolioValue = (initialCapital + marginLoan) * (1 + changePercent);
        const marginEquityValue = totalPortfolioValue - marginLoan - interestCost;

        data.push({
            name: `${i > 0 ? '+' : ''}${i}%`,
            "Cash Only": Math.max(0, parseFloat(cashValue.toFixed(0))),
            "With Margin": Math.max(0, parseFloat(marginEquityValue.toFixed(0))),
        });
    }

    // Find the max value to set Y-axis domain nicely
    const maxValue = Math.max(
        ...data.map(d => Math.max(d["Cash Only"], d["With Margin"]))
    );

    return (
        <div className="w-full h-80 bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-inner">
            <h3 className="text-gray-200 font-semibold mb-4 text-center">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        interval={1} // Show every other label to avoid clutter
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <ReferenceLine x="0%" stroke="#6B7280" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="With Margin"
                        stroke="#14B8A6" // Teal-500
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Cash Only"
                        stroke="#6B7280" // Gray-500
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarginChart;
