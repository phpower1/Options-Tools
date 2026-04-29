"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type StrikeRow = {
  id: number;
  strike: string;
  callsOI: string;
  putsOI: string;
};

type ChartEntry = { strike: number; pain: number };

type Result = {
  maxPainStrike: number;
  chartData: ChartEntry[];
};

const calculateMaxPain = (rows: StrikeRow[]): Result | null => {
  const valid = rows
    .map((r) => ({
      strike: parseFloat(r.strike),
      callsOI: parseFloat(r.callsOI) || 0,
      putsOI: parseFloat(r.putsOI) || 0,
    }))
    .filter((r) => !isNaN(r.strike) && r.strike > 0)
    .sort((a, b) => a.strike - b.strike);

  if (valid.length < 2) return null;

  let minPain = Infinity;
  let maxPainStrike = 0;
  const chartData: ChartEntry[] = [];

  for (const candidate of valid) {
    let pain = 0;
    for (const row of valid) {
      // ITM puts: put strikes above candidate expire in the money
      if (row.strike > candidate.strike) {
        pain += (row.strike - candidate.strike) * row.putsOI;
      }
      // ITM calls: call strikes below candidate expire in the money
      if (row.strike < candidate.strike) {
        pain += (candidate.strike - row.strike) * row.callsOI;
      }
    }
    chartData.push({ strike: candidate.strike, pain });
    if (pain < minPain) {
      minPain = pain;
      maxPainStrike = candidate.strike;
    }
  }

  return { maxPainStrike, chartData };
};

const DEFAULT_ROWS: StrikeRow[] = [
  { id: 1, strike: "100", callsOI: "5000", putsOI: "7000" },
  { id: 2, strike: "105", callsOI: "6500", putsOI: "5500" },
  { id: 3, strike: "110", callsOI: "8000", putsOI: "3000" },
  { id: 4, strike: "115", callsOI: "3500", putsOI: "4500" },
  { id: 5, strike: "120", callsOI: "2000", putsOI: "9000" },
];

export default function MaxPainCalculator() {
  const [rows, setRows] = useState<StrikeRow[]>(DEFAULT_ROWS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maxPainData");
      if (stored) setRows(JSON.parse(stored));
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("maxPainData", JSON.stringify(rows));
    } catch {
      // ignore
    }
  }, [rows, isLoaded]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), strike: "", callsOI: "", putsOI: "" },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof Omit<StrikeRow, "id">, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const clearAll = () => {
    const fresh = [{ id: Date.now(), strike: "", callsOI: "", putsOI: "" }];
    setRows(fresh);
    try { localStorage.removeItem("maxPainData"); } catch { /* ignore */ }
  };

  const result = calculateMaxPain(rows);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-2">
        Max Pain Calculator
      </h2>
      <p className="text-center text-gray-400 mb-8 text-sm">
        Enter the open interest for each strike from your broker&apos;s options chain.
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-2 pr-3 font-medium">Strike ($)</th>
              <th className="text-left py-2 pr-3 font-medium">Calls OI</th>
              <th className="text-left py-2 pr-3 font-medium">Puts OI</th>
              <th className="py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    value={row.strike}
                    onChange={(e) => updateRow(row.id, "strike", e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    value={row.callsOI}
                    onChange={(e) => updateRow(row.id, "callsOI", e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    value={row.putsOI}
                    onChange={(e) => updateRow(row.id, "putsOI", e.target.value)}
                    placeholder="e.g. 7000"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </td>
                <td className="py-2 text-right">
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Remove row"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={addRow}
          className="flex items-center space-x-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <PlusCircle size={20} />
          <span>Add Strike</span>
        </button>
        <button
          onClick={clearAll}
          className="flex items-center space-x-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <Trash2 size={20} />
          <span>Clear All</span>
        </button>
      </div>

      {/* Result */}
      {result && (
        <>
          <div className="mt-8 p-5 bg-gray-700 rounded-xl border border-gray-600 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Max Pain Strike</p>
            <p className="text-5xl font-extrabold text-teal-400">
              ${result.maxPainStrike.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              The strike where the total intrinsic value of in-the-money options is lowest — causing maximum pain to option buyers.
            </p>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 text-center uppercase tracking-wide mb-3">
              Total In-The-Money Value by Strike — highlighted bar = max pain
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={result.chartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              >
                <XAxis
                  dataKey="strike"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Pain value"]}
                  labelFormatter={(label) => `Strike: $${label}`}
                  contentStyle={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pain" radius={[4, 4, 0, 0]}>
                  {result.chartData.map((entry) => (
                    <Cell
                      key={entry.strike}
                      fill={entry.strike === result.maxPainStrike ? "#2dd4bf" : "#374151"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* SEO content */}
      <div className="text-gray-400 text-sm mt-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">What is the Max Pain Calculator?</h2>
        <p>
          The <strong>Max Pain calculator</strong> is based on the <strong>Max Pain theory</strong>, which suggests that the price of an underlying asset tends to gravitate toward the <strong>max pain strike</strong> at options expiration. This is the strike price at which the total intrinsic value of all in-the-money options is at its lowest — causing the maximum financial loss for option buyers and the minimum payout for option sellers.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          For each candidate strike price, the calculator totals the intrinsic value of every in-the-money option across the entire chain: ITM puts (strikes above the candidate) and ITM calls (strikes below the candidate). The strike with the <strong>lowest combined total</strong> is the max pain price — the point where option sellers pay out the least and buyers receive the least.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open your broker&apos;s options chain for the stock and expiration date you want to analyze.</li>
          <li>For each strike price, note the <strong>Calls Open Interest</strong> and <strong>Puts Open Interest</strong>.</li>
          <li>Enter each strike row into the table above. Add as many strikes as you have data for.</li>
          <li>The <strong>Max Pain Strike</strong> updates automatically as you type.</li>
          <li>The bar chart shows the pain distribution — the teal bar is the max pain strike.</li>
          <li>Your data is saved locally so it persists across page visits.</li>
        </ol>
      </div>
    </div>
  );
}
