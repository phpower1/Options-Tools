"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Calendar,
  ShieldAlert,
  Percent,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ThetaProfile {
  name: string;
  rate: number;
  description: string;
  badgeColor: string;
}

const PROFILES: ThetaProfile[] = [
  {
    name: "Conservative",
    rate: 0.1,
    description: "Lower gamma risk, highly defensive. Ideal for volatile markets or conservative capital preservation.",
    badgeColor: "bg-blue-900/60 text-blue-300 border-blue-700",
  },
  {
    name: "Balanced (Tastytrade)",
    rate: 0.25,
    description: "The gold standard for premium sellers (0.20% - 0.30%/day). Solid time decay with manageable drawdown risk.",
    badgeColor: "bg-teal-900/60 text-teal-300 border-teal-700",
  },
  {
    name: "Aggressive",
    rate: 0.45,
    description: "High cash flow target (0.40% - 0.50%/day). Significant negative gamma; requires active monitoring and defense.",
    badgeColor: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  },
];

const PRESET_ACCOUNTS = [5000, 10000, 25000, 50000, 100000, 250000];

export default function DailyThetaCalculator() {
  const [accountSize, setAccountSize] = useState<number>(25000);
  const [targetThetaRate, setTargetThetaRate] = useState<number>(0.25);
  const [deployedCapitalPercent, setDeployedCapitalPercent] = useState<number>(50);
  const [currentTheta, setCurrentTheta] = useState<string>("");
  const [captureEfficiency, setCaptureEfficiency] = useState<number>(35);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dailyThetaCalculatorState");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.accountSize !== undefined) setAccountSize(Number(parsed.accountSize));
        if (parsed.targetThetaRate !== undefined) setTargetThetaRate(Number(parsed.targetThetaRate));
        if (parsed.deployedCapitalPercent !== undefined) setDeployedCapitalPercent(Number(parsed.deployedCapitalPercent));
        if (parsed.currentTheta !== undefined) setCurrentTheta(String(parsed.currentTheta));
        if (parsed.captureEfficiency !== undefined) setCaptureEfficiency(Number(parsed.captureEfficiency));
      }
    } catch (error) {
      console.error("Failed to load daily theta calculator state:", error);
    } finally {
      setIsLocalStorageLoaded(true);
    }
  }, []);

  // Save to localStorage when inputs change
  useEffect(() => {
    if (!isLocalStorageLoaded) return;
    try {
      localStorage.setItem(
        "dailyThetaCalculatorState",
        JSON.stringify({
          accountSize,
          targetThetaRate,
          deployedCapitalPercent,
          currentTheta,
          captureEfficiency,
        })
      );
    } catch (error) {
      console.error("Failed to save daily theta calculator state:", error);
    }
  }, [accountSize, targetThetaRate, deployedCapitalPercent, currentTheta, captureEfficiency, isLocalStorageLoaded]);

  // Calculations
  const validAccount = Math.max(0, accountSize || 0);
  const idealDailyTheta = (validAccount * (targetThetaRate / 100));
  const deployedCapital = (validAccount * (deployedCapitalPercent / 100));

  // Time decay totals (Gross theoretical)
  const weeklyThetaCalendar = idealDailyTheta * 7;
  const weeklyThetaTrading = idealDailyTheta * 5;
  const monthlyTheta30 = idealDailyTheta * 30;
  const monthlyThetaTrading = idealDailyTheta * 21;
  const annualThetaCalendar = idealDailyTheta * 365;

  // Realized capture estimates (e.g., 35% typical rule of thumb)
  const efficiencyMultiplier = captureEfficiency / 100;
  const realizedDailyTheta = idealDailyTheta * efficiencyMultiplier;
  const realizedMonthlyTheta = monthlyTheta30 * efficiencyMultiplier;
  const realizedAnnualTheta = annualThetaCalendar * efficiencyMultiplier;
  const realizedAnnualReturnOnAccount = validAccount > 0 ? (realizedAnnualTheta / validAccount) * 100 : 0;

  // Return on Capital (Deployed Margin)
  const dailyROC = deployedCapital > 0 ? (idealDailyTheta / deployedCapital) * 100 : 0;
  const annualROC = deployedCapital > 0 ? (annualThetaCalendar / deployedCapital) * 100 : 0;

  // Current Theta audit
  const numericCurrentTheta = parseFloat(currentTheta);
  const hasCurrentTheta = !isNaN(numericCurrentTheta) && currentTheta.trim() !== "";
  const currentThetaRate = hasCurrentTheta && validAccount > 0 ? (numericCurrentTheta / validAccount) * 100 : 0;
  const thetaDifference = hasCurrentTheta ? numericCurrentTheta - idealDailyTheta : 0;

  // Risk Rating based on rate
  const getRiskStatus = (rate: number) => {
    if (rate < 0.1) {
      return {
        label: "Under-Allocated / Ultra-Defensive",
        color: "text-blue-400 bg-blue-900/30 border-blue-800",
        message: "Your theta generation is below standard premium seller benchmarks. Consider deploying idle capital if market conditions warrant.",
        icon: Clock,
      };
    }
    if (rate <= 0.3) {
      return {
        label: "Optimal Sweet Spot",
        color: "text-green-400 bg-green-900/30 border-green-800",
        message: "Ideal balance of healthy time decay and disciplined risk management. Matches standard systematic options selling guidelines.",
        icon: CheckCircle2,
      };
    }
    if (rate <= 0.5) {
      return {
        label: "Aggressive / High Gamma",
        color: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
        message: "High daily decay, but exposed to sudden adverse delta and volatility spikes. Ensure wide strike spreads and active profit taking.",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Extreme Risk / Gamma Trap",
      color: "text-red-400 bg-red-900/30 border-red-800",
      message: "Daily theta above 0.5% indicates severe negative gamma exposure. A single 2-standard-deviation market move can wipe out months of decay.",
      icon: ShieldAlert,
    };
  };

  const riskStatus = getRiskStatus(hasCurrentTheta ? currentThetaRate : targetThetaRate);

  // Chart data: 90 days cumulative time decay (Gross theoretical vs Realized)
  const chartData = [];
  for (let day = 0; day <= 90; day += 5) {
    chartData.push({
      day: `Day ${day}`,
      "Theoretical Gross Decay": Math.round(idealDailyTheta * day),
      "Expected Realized Profit": Math.round(realizedDailyTheta * day),
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatExactCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Options Daily Theta Calculator",
            description: "Calculate target daily portfolio theta for options sellers based on account size, buying power allocation, and risk profile.",
            mainEntity: {
              "@type": "Calculator",
              name: "Daily Theta Calculator",
              description: "Calculates ideal daily theta, monthly projections, buying power utilization, and realized decay capture for options sellers.",
              url: "https://www.tradetoolshub.com/daily-theta-calculator",
              potentialAction: {
                "@type": "PerformAction",
                name: "Calculate Target Daily Theta",
              },
            },
          }),
        }}
      />

      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-6">
        Daily Theta Calculator
      </h2>
      <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
        Determine your ideal daily portfolio theta target for premium selling, assess buying power efficiency, and model realistic time decay capture.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          {/* Account Setup */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
              <DollarSign className="mr-2 text-teal-400" size={20} /> Account & Sizing
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Net Liquidity ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={accountSize || ""}
                  onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="e.g. 25000"
                />
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {PRESET_ACCOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAccountSize(preset)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors border ${
                        accountSize === preset
                          ? "bg-teal-600 border-teal-500 text-white font-semibold"
                          : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      ${preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Buying Power Deployed ({deployedCapitalPercent}%)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={deployedCapitalPercent}
                    onChange={(e) => setDeployedCapitalPercent(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <span className="font-mono text-sm text-teal-300 w-12 text-right">
                    {deployedCapitalPercent}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Capital at risk:{" "}
                  <span className="text-white font-semibold">{formatCurrency(deployedCapital)}</span>{" "}
                  (Recommended: 30%–50% in low IV, 50%–70% in high IV).
                </p>
              </div>
            </div>
          </div>

          {/* Target Profile Selection */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
              <Percent className="mr-2 text-blue-400" size={20} /> Target Theta Rate (% of Account / Day)
            </h3>

            <div className="space-y-3 mb-4">
              {PROFILES.map((p) => {
                const isSelected = Math.abs(targetThetaRate - p.rate) < 0.001;
                return (
                  <div
                    key={p.name}
                    onClick={() => setTargetThetaRate(p.rate)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gray-800 border-teal-500 ring-1 ring-teal-500"
                        : "bg-gray-800/60 border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white text-sm">{p.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-mono ${p.badgeColor}`}>
                        {p.rate.toFixed(2)}% / day
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Custom Daily Rate:</span>
                <span className="font-mono text-teal-400 font-bold">{targetThetaRate.toFixed(2)}% / day</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.01"
                value={targetThetaRate}
                onChange={(e) => setTargetThetaRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>0.05% (Defensive)</span>
                <span>0.25% (Standard)</span>
                <span>0.50%+ (Danger zone)</span>
              </div>
            </div>
          </div>

          {/* Portfolio Audit / Optional Live Theta Input */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
              <PieChart className="mr-2 text-purple-400" size={20} /> Current Portfolio Theta (Optional)
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Enter your current live daily theta from your brokerage (Thinkorswim, Tastytrade, IBKR) to audit your exposure.
            </p>
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  step="1"
                  value={currentTheta}
                  onChange={(e) => setCurrentTheta(e.target.value)}
                  placeholder="e.g. 55"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-7 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>
              {currentTheta && (
                <button
                  type="button"
                  onClick={() => setCurrentTheta("")}
                  className="text-xs text-gray-400 hover:text-white px-2 py-2 bg-gray-800 rounded border border-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Realized Capture Efficiency Slider */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-300">
                Realized Theta Capture Rate
              </label>
              <span className="font-mono text-sm text-teal-300 font-bold">
                {captureEfficiency}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={captureEfficiency}
              onChange={(e) => setCaptureEfficiency(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <p className="text-xs text-gray-400 mt-2">
              Options sellers typically capture <strong>25%–50%</strong> of gross theta due to taking profits early at 50% max profit and delta friction.
            </p>
          </div>
        </div>

        {/* Right Column: Results & Analysis */}
        <div className="space-y-6">
          {/* Main Target Card */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-teal-500/50 shadow-lg">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
              Target Daily Portfolio Theta
            </p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl md:text-5xl font-extrabold text-white">
                {formatExactCurrency(idealDailyTheta)}
              </span>
              <span className="text-sm text-gray-400">/ day</span>
            </div>
            <p className="text-xs text-gray-300 mt-2">
              Targeting <span className="text-teal-300 font-bold">{targetThetaRate.toFixed(2)}%</span> daily decay on an account size of{" "}
              <span className="text-white font-semibold">{formatCurrency(validAccount)}</span>.
            </p>

            {/* Time Horizon Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-600">
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">Weekly (7-Day Calendar)</p>
                <p className="text-lg font-bold text-white">{formatCurrency(weeklyThetaCalendar)}</p>
                <p className="text-[11px] text-gray-500">{formatCurrency(weeklyThetaTrading)} (5-day trading)</p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">Monthly (~30 Days)</p>
                <p className="text-lg font-bold text-white">{formatCurrency(monthlyTheta30)}</p>
                <p className="text-[11px] text-gray-500">{formatCurrency(monthlyThetaTrading)} (21-day trading)</p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">Annual Gross Theta</p>
                <p className="text-lg font-bold text-teal-300">{formatCurrency(annualThetaCalendar)}</p>
                <p className="text-[11px] text-gray-500">{(targetThetaRate * 365).toFixed(1)}% of account</p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">Expected Realized P&L ({captureEfficiency}%)</p>
                <p className="text-lg font-bold text-green-400">{formatCurrency(realizedAnnualTheta)}</p>
                <p className="text-[11px] text-green-300/80">~{realizedAnnualReturnOnAccount.toFixed(1)}% annual return</p>
              </div>
            </div>
          </div>

          {/* Capital Efficiency / Buying Power */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <TrendingUp className="mr-2 text-teal-400" size={18} /> Return on Capital (Deployed Margin)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                <span className="text-gray-400">Buying Power Deployed:</span>
                <span className="font-mono text-white font-semibold">
                  {formatCurrency(deployedCapital)} ({deployedCapitalPercent}%)
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                <span className="text-gray-400">Daily Return on Capital (ROC):</span>
                <span className="font-mono text-teal-300 font-bold">
                  {dailyROC.toFixed(3)}% / day
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Annualized Gross ROC:</span>
                <span className="font-mono text-white font-bold">
                  {annualROC.toFixed(1)}% / year
                </span>
              </div>
            </div>
          </div>

          {/* Audit vs Current Theta */}
          {hasCurrentTheta && (
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                <Clock className="mr-2 text-purple-400" size={18} /> Current Portfolio Audit
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Current Daily Theta</p>
                  <p className="text-xl font-bold text-white font-mono">
                    {formatExactCurrency(numericCurrentTheta)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentThetaRate.toFixed(2)}% of account / day
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Variance to Target</p>
                  <p
                    className={`text-xl font-bold font-mono ${
                      Math.abs(thetaDifference) < 2
                        ? "text-teal-400"
                        : thetaDifference > 0
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {thetaDifference > 0 ? `+${formatExactCurrency(thetaDifference)}` : formatExactCurrency(thetaDifference)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {thetaDifference > 0 ? "Above target" : thetaDifference < 0 ? "Below target" : "On target"}
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-lg border ${riskStatus.color}`}>
                <div className="flex items-center space-x-2 font-semibold text-sm mb-1">
                  <riskStatus.icon size={18} />
                  <span>{riskStatus.label}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{riskStatus.message}</p>
              </div>
            </div>
          )}

          {/* If no current theta entered, show general risk guideline */}
          {!hasCurrentTheta && (
            <div className={`p-4 rounded-lg border ${riskStatus.color}`}>
              <div className="flex items-center space-x-2 font-semibold text-sm mb-1">
                <riskStatus.icon size={18} />
                <span>Selected Tier: {riskStatus.label}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{riskStatus.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cumulative Time Decay Chart */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-inner">
        <h3 className="text-gray-200 font-semibold mb-2 text-center text-lg flex items-center justify-center">
          <Calendar className="mr-2 text-teal-400" size={20} /> 90-Day Cumulative Time Decay Projection
        </h3>
        <p className="text-xs text-gray-400 text-center mb-6 max-w-xl mx-auto">
          Comparing theoretical gross decay against expected realized profits ({captureEfficiency}% capture efficiency) across 90 calendar days.
        </p>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => (val >= 1000 ? `$${val / 1000}k` : `$${val}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F3F4F6",
                  borderRadius: "0.5rem",
                }}
                formatter={(val: number) => [formatCurrency(val), ""]}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="Theoretical Gross Decay"
                stroke="#2DD4BF"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Expected Realized Profit"
                stroke="#10B981"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Account Size Quick Reference Table */}
      <div className="mt-8 bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg font-bold text-gray-200 mb-4 text-center">
          Target Daily Theta Quick Reference Guide
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-600">
              <tr>
                <th className="py-2.5 px-3">Account Size</th>
                <th className="py-2.5 px-3">Conservative (0.10%/day)</th>
                <th className="py-2.5 px-3 text-teal-400">Tastytrade Standard (0.25%/day)</th>
                <th className="py-2.5 px-3">Aggressive (0.45%/day)</th>
                <th className="py-2.5 px-3">Est. Monthly (0.25% @ 35%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/60 font-mono">
              {[5000, 10000, 25000, 50000, 100000, 250000].map((size) => (
                <tr
                  key={size}
                  className={`hover:bg-gray-600/40 ${
                    accountSize === size ? "bg-teal-950/40 font-bold text-teal-200" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-white font-sans">
                    ${size.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">${(size * 0.001).toFixed(2)} / day</td>
                  <td className="py-2.5 px-3 text-teal-300 font-semibold">
                    ${(size * 0.0025).toFixed(2)} / day
                  </td>
                  <td className="py-2.5 px-3 text-yellow-300">${(size * 0.0045).toFixed(2)} / day</td>
                  <td className="py-2.5 px-3 text-green-400">
                    ~${Math.round(size * 0.0025 * 30 * 0.35).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO-friendly descriptive content & instructions */}
      <div className="text-gray-400 text-sm mt-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">
          What is Portfolio Theta for Options Sellers?
        </h2>
        <p>
          In options trading, <strong>Theta (θ)</strong> measures the rate at which an option contract loses value over time, all else being equal. When you sell options (such as short puts, covered calls, iron condors, or credit spreads), time decay works in your favor. Your <strong>net portfolio daily theta</strong> represents the theoretical dollar amount your account earns every 24 hours simply from the passage of time.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">
          The 0.1% to 0.5% Daily Theta Rule of Thumb
        </h3>
        <p>
          Pioneered by quantitative retail options firms like <strong>Tastytrade</strong>, systematic premium sellers aim for a daily portfolio theta between <strong>0.1% and 0.5% of total account net liquidation value</strong>:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Conservative (0.10% / day)</strong>: On a $50,000 account, this equals <strong>$50/day</strong>. Highly defensive, prioritizes broad strike widths, long expirations (45–60 DTE), and substantial cash reserves.
          </li>
          <li>
            <strong>Standard / Balanced (0.20% – 0.30% / day)</strong>: On a $50,000 account, this equals <strong>$100 – $150/day</strong>. The sweet spot where time decay outpaces typical market noise while keeping drawdowns manageable.
          </li>
          <li>
            <strong>Aggressive (0.40% – 0.50% / day)</strong>: On a $50,000 account, this equals <strong>$200 – $250/day</strong>. Generates high cash flow, but requires close strike selection and heavy buying power allocation.
          </li>
        </ul>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">
          The Theta vs. Gamma Tradeoff: Why More Theta Isn&apos;t Always Better
        </h3>
        <p>
          A common mistake for newer options sellers is trying to maximize daily theta (e.g., targeting 0.8% or 1.0% per day). Because options decay fastest right before expiration (0–7 DTE) and close to the money (ATM), achieving very high theta forces you into contracts with extreme <strong>negative Gamma</strong>. High negative gamma means that if the underlying stock drops or rallies rapidly, your short option&apos;s delta explodes against you, erasing weeks of accumulated theta in minutes. Keeping theta within the 0.20%–0.30% window protects you from catastrophic tail-risk.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">
          Theoretical Theta vs. Realized Profits (The 25%–50% Capture Rule)
        </h3>
        <p>
          Options sellers almost never capture 100% of theoretical theta. In practice, seasoned traders close trades early (e.g., at <strong>50% of maximum profit</strong> or at <strong>21 DTE</strong> to avoid gamma acceleration), and adverse price moves or implied volatility spikes consume a portion of the decay. As a realistic guideline, experienced premium sellers expect to realize roughly <strong>25% to 50%</strong> of their gross theoretical theta over a full year.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">
          How to Use the Tool
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Enter your total <strong>Account Net Liquidity ($)</strong> or click one of the quick preset chips.
          </li>
          <li>
            Select your desired <strong>Risk Profile</strong> (Conservative, Balanced, or Aggressive) or fine-tune the rate with the slider.
          </li>
          <li>
            Adjust the <strong>Buying Power Deployed</strong> slider to match your current margin utilization (typically 30%–50% in low IV and 50%–70% in high IV).
          </li>
          <li>
            (Optional) Enter your <strong>Current Portfolio Theta ($)</strong> to immediately audit whether your actual positions are under-allocated, in the sweet spot, or over-exposed to gamma risk.
          </li>
          <li>
            Review the <strong>90-Day Cumulative Projection Chart</strong> and <strong>Quick Reference Table</strong> to plan your trade sizing and strategy duration.
          </li>
        </ol>
      </div>
    </div>
  );
}
