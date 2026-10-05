"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Scale,
  ShieldCheck,
  Building,
  ArrowRight,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { US_STATES, FilingStatus, StateTaxConfig } from "./utils/taxData";
import {
  calculateTaxes,
  solveRequiredGrossProfit,
  TaxBreakdown,
} from "./utils/taxCalculator";

type CalculationMode = "goal" | "estimate";

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000];

export default function AfterTaxCalculator() {
  const [mode, setMode] = useState<CalculationMode>("goal");
  const [targetAmount, setTargetAmount] = useState<number>(50000);
  const [stateCode, setStateCode] = useState<string>("TX");
  const [isNycResident, setIsNycResident] = useState<boolean>(false);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [baselineIncome, setBaselineIncome] = useState<number>(60000);
  const [contractType, setContractType] = useState<"equity" | "section1256">("equity");
  const [accountSize, setAccountSize] = useState<string>("100000");
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("afterTaxCalculatorState");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.targetAmount !== undefined) setTargetAmount(Number(parsed.targetAmount));
        if (parsed.stateCode) setStateCode(parsed.stateCode);
        if (parsed.isNycResident !== undefined) setIsNycResident(Boolean(parsed.isNycResident));
        if (parsed.filingStatus) setFilingStatus(parsed.filingStatus);
        if (parsed.baselineIncome !== undefined) setBaselineIncome(Number(parsed.baselineIncome));
        if (parsed.contractType) setContractType(parsed.contractType);
        if (parsed.accountSize !== undefined) setAccountSize(String(parsed.accountSize));
      }
    } catch (e) {
      console.error("Failed to load after-tax calculator state:", e);
    } finally {
      setIsLocalStorageLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLocalStorageLoaded) return;
    try {
      localStorage.setItem(
        "afterTaxCalculatorState",
        JSON.stringify({
          mode,
          targetAmount,
          stateCode,
          isNycResident,
          filingStatus,
          baselineIncome,
          contractType,
          accountSize,
        })
      );
    } catch (e) {
      console.error("Failed to save after-tax calculator state:", e);
    }
  }, [
    mode,
    targetAmount,
    stateCode,
    isNycResident,
    filingStatus,
    baselineIncome,
    contractType,
    accountSize,
    isLocalStorageLoaded,
  ]);

  const currentState: StateTaxConfig = US_STATES[stateCode] || US_STATES.TX;
  const validTarget = Math.max(0, targetAmount || 0);
  const validBaseline = Math.max(0, baselineIncome || 0);

  // Compute selected contract type result
  const currentResult: TaxBreakdown = useMemo(() => {
    if (mode === "goal") {
      return solveRequiredGrossProfit(
        validTarget,
        validBaseline,
        filingStatus,
        stateCode,
        contractType,
        isNycResident
      );
    } else {
      return calculateTaxes({
        grossProfit: validTarget,
        baselineIncome: validBaseline,
        filingStatus,
        stateCode,
        isNycResident,
        contractType,
      });
    }
  }, [mode, validTarget, validBaseline, filingStatus, stateCode, contractType, isNycResident]);

  // Compute comparison result (Equity vs Section 1256)
  const comparisonResults = useMemo(() => {
    if (mode === "goal") {
      const equity = solveRequiredGrossProfit(
        validTarget,
        validBaseline,
        filingStatus,
        stateCode,
        "equity",
        isNycResident
      );
      const section1256 = solveRequiredGrossProfit(
        validTarget,
        validBaseline,
        filingStatus,
        stateCode,
        "section1256",
        isNycResident
      );
      return { equity, section1256 };
    } else {
      const equity = calculateTaxes({
        grossProfit: validTarget,
        baselineIncome: validBaseline,
        filingStatus,
        stateCode,
        isNycResident,
        contractType: "equity",
      });
      const section1256 = calculateTaxes({
        grossProfit: validTarget,
        baselineIncome: validBaseline,
        filingStatus,
        stateCode,
        isNycResident,
        contractType: "section1256",
      });
      return { equity, section1256 };
    }
  }, [mode, validTarget, validBaseline, filingStatus, stateCode, isNycResident]);

  // Savings computation
  const taxSavings = Math.max(0, comparisonResults.equity.totalTax - comparisonResults.section1256.totalTax);
  const grossSavings = Math.max(0, comparisonResults.equity.grossProfit - comparisonResults.section1256.grossProfit);
  const rateAdvantage = comparisonResults.equity.effectiveRate - comparisonResults.section1256.effectiveRate;

  // Account Return Metrics
  const numericAccount = parseFloat(accountSize);
  const hasAccount = !isNaN(numericAccount) && numericAccount > 0;
  const grossReturnOnAccount = hasAccount ? (currentResult.grossProfit / numericAccount) * 100 : 0;
  const netReturnOnAccount = hasAccount ? (currentResult.netProfit / numericAccount) * 100 : 0;

  // Milestone breakdown
  const grossAnnual = currentResult.grossProfit;
  const grossMonthly = grossAnnual / 12;
  const grossWeekly = grossAnnual / 52;
  const grossDaily = grossAnnual / 252; // 252 standard US trading days

  const netAnnual = currentResult.netProfit;
  const netMonthly = netAnnual / 12;
  const netWeekly = netAnnual / 52;
  const netDaily = netAnnual / 252;

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

  // Pie chart breakdown data
  const pieData = [
    { name: "Net Take-Home", value: Math.round(currentResult.netProfit), color: "#14b8a6" }, // teal-500
    { name: "Federal Tax", value: Math.round(currentResult.federalTax), color: "#3b82f6" },   // blue-500
    { name: "State / Local", value: Math.round(currentResult.stateTax + currentResult.nycTax), color: "#f59e0b" }, // amber-500
    ...(currentResult.niitTax > 0
      ? [{ name: "NIIT (3.8%)", value: Math.round(currentResult.niitTax), color: "#ef4444" }] // red-500
      : []),
  ].filter((d) => d.value > 0);

  // Comparison Bar Chart data
  const comparisonChartData = [
    {
      name: "Equity Options (100% STCG)",
      "Gross Profit": Math.round(comparisonResults.equity.grossProfit),
      "Total Taxes": Math.round(comparisonResults.equity.totalTax),
      "Net Take-Home": Math.round(comparisonResults.equity.netProfit),
    },
    {
      name: "Index Options (SPX 60/40)",
      "Gross Profit": Math.round(comparisonResults.section1256.grossProfit),
      "Total Taxes": Math.round(comparisonResults.section1256.totalTax),
      "Net Take-Home": Math.round(comparisonResults.section1256.netProfit),
    },
  ];

  // Custom Tooltip for Comparison Bar Chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-gray-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs min-w-[210px]">
          <div className="font-semibold text-gray-200 border-b border-gray-700/80 pb-1.5 mb-2.5">
            {label}
          </div>
          <div className="space-y-2 font-mono">
            {payload.map((item: any, idx: number) => {
              const color = item.color || item.fill || "#14b8a6";
              return (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-gray-300 font-sans">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 inline-block"
                      style={{ backgroundColor: color }}
                    />
                    <span>{item.name}:</span>
                  </div>
                  <span className="font-bold" style={{ color }}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Donut / Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const color = item.payload?.color || item.color || "#14b8a6";
      const percent =
        currentResult.grossProfit > 0
          ? ((item.value / currentResult.grossProfit) * 100).toFixed(1)
          : "0.0";
      return (
        <div className="bg-gray-900/95 border border-gray-700 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-300 font-sans font-medium">{item.name}:</span>
            <span className="font-mono font-bold text-white">
              {formatCurrency(item.value)}
            </span>
            <span className="text-gray-400 font-mono text-[11px]">
              ({percent}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Options After-Tax Return & Tax Planner",
            description:
              "Calculate required gross profit for desired after-tax options trading returns by state, filing status, and Section 1256 index contracts.",
            mainEntity: {
              "@type": "Calculator",
              name: "Options After-Tax Return Calculator",
              description:
                "Solves for required gross profit to achieve a net after-tax options target across all 50 US states, factoring in ordinary brackets, Section 1256 60/40 rules, and NIIT.",
              url: "https://www.tradetoolshub.com/after-tax-calculator",
            },
          }),
        }}
      />

      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-teal-400 mb-3">
        Options After-Tax Return Planner
      </h2>
      <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto text-sm md:text-base">
        Determine the exact pre-tax trading profit you need to achieve your desired take-home income across all 50 US states, and compare Equity Options against Section 1256 Index Options (SPX).
      </p>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-900 p-1.5 rounded-xl border border-gray-700 flex max-w-md w-full">
          <button
            type="button"
            onClick={() => setMode("goal")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === "goal"
                ? "bg-teal-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <TrendingUp size={16} />
            <span>Target Net Goal → Required Gross</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("estimate")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === "estimate"
                ? "bg-teal-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <DollarSign size={16} />
            <span>Gross Profit → Net Take-Home</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          {/* Target Amount */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="text-teal-400" size={18} />
                {mode === "goal" ? "Desired After-Tax Net Profit ($)" : "Expected Gross Trading Profit ($)"}
              </span>
              <span className="text-xs font-normal text-teal-300">
                {formatCurrency(validTarget)}
              </span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={targetAmount || ""}
              onChange={(e) => setTargetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 50000"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white font-mono text-lg focus:outline-none focus:border-teal-400 transition"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mt-3">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTargetAmount(amt)}
                  className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition ${
                    targetAmount === amt
                      ? "bg-teal-600/40 text-teal-300 border-teal-500"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                  }`}
                >
                  ${(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Location & State Selection */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Building className="text-teal-400" size={18} />
                State of Residence
              </label>
              {currentState.type === "none" && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  0% State Tax
                </span>
              )}
              {currentState.type === "flat" && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                  Flat {((currentState.flatRate || 0) * 100).toFixed(2)}%
                </span>
              )}
              {currentState.type === "graduated" && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700">
                  Tiered Rates
                </span>
              )}
            </div>

            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400 transition"
            >
              {Object.values(US_STATES).map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code}) {state.type === "none" ? "— 0% State Tax" : ""}
                </option>
              ))}
            </select>

            {currentState.notes && (
              <p className="text-xs text-gray-400 mt-2 italic flex items-start gap-1">
                <Info size={14} className="shrink-0 mt-0.5 text-teal-400" />
                <span>{currentState.notes}</span>
              </p>
            )}

            {stateCode === "NY" && (
              <div className="mt-3 pt-3 border-t border-gray-600 flex items-center">
                <input
                  id="nycCheckbox"
                  type="checkbox"
                  checked={isNycResident}
                  onChange={(e) => setIsNycResident(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500 bg-gray-900 border-gray-600 focus:ring-teal-400"
                />
                <label htmlFor="nycCheckbox" className="ml-2 text-xs text-gray-300">
                  New York City Resident (adds ~3.08% to 3.88% NYC local tax)
                </label>
              </div>
            )}
          </div>

          {/* Filing Status & Baseline Income */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Scale className="text-teal-400" size={18} />
                Tax Filing Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "single", label: "Single" },
                    { id: "mfj", label: "Married (Joint)" },
                    { id: "hoh", label: "Head of Household" },
                  ] as const
                ).map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setFilingStatus(status.id)}
                    className={`text-xs py-2 px-2 rounded-lg font-medium border text-center transition ${
                      filingStatus === status.id
                        ? "bg-teal-500/20 text-teal-300 border-teal-500 shadow-sm"
                        : "bg-gray-900/60 text-gray-300 border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                  <span>Other Baseline Income ($)</span>
                </label>
                <span className="text-xs text-gray-400 font-mono">
                  {formatCurrency(validBaseline)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                W-2 salary or business income. Trading gains sit on top to find your true marginal bracket.
              </p>
              <input
                type="number"
                min="0"
                step="5000"
                value={baselineIncome || ""}
                onChange={(e) => setBaselineIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 60000"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-teal-400 transition"
              />
            </div>
          </div>

          {/* Contract Type Selection */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <ShieldCheck className="text-teal-400" size={18} />
              Options Contract Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContractType("equity")}
                className={`p-3 rounded-lg border text-left transition ${
                  contractType === "equity"
                    ? "bg-teal-900/40 border-teal-500 text-white"
                    : "bg-gray-900/60 border-gray-600 text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="font-semibold text-sm text-gray-100">Equity Options</div>
                <div className="text-xs text-teal-400 font-mono mt-0.5">100% Short-Term Gains</div>
                <div className="text-[11px] text-gray-400 mt-1">AAPL, TSLA, SPY, QQQ (Ordinary rates)</div>
              </button>

              <button
                type="button"
                onClick={() => setContractType("section1256")}
                className={`p-3 rounded-lg border text-left transition relative overflow-hidden ${
                  contractType === "section1256"
                    ? "bg-teal-900/40 border-teal-500 text-white"
                    : "bg-gray-900/60 border-gray-600 text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="font-semibold text-sm text-gray-100 flex items-center justify-between">
                  <span>Section 1256 Index</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/40">
                    60/40 Rule
                  </span>
                </div>
                <div className="text-xs text-teal-400 font-mono mt-0.5">60% Long / 40% Short</div>
                <div className="text-[11px] text-gray-400 mt-1">SPX, NDX, RUT, XSP (Lower tax drag)</div>
              </button>
            </div>
          </div>

          {/* Account Size (Optional) */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <label className="block text-sm font-semibold text-gray-200 mb-1 flex items-center gap-2">
              <Percent className="text-teal-400" size={18} />
              Trading Account Net Liquidity ($) <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Enter your capital to calculate required pre-tax & post-tax percentage returns on account.
            </p>
            <input
              type="number"
              min="0"
              step="5000"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              placeholder="e.g. 100000"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-teal-400 transition"
            />
          </div>
        </div>

        {/* Right Column: Results & Dashboard */}
        <div className="space-y-6">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-teal-500/50 shadow-xl">
            <div className="text-xs uppercase tracking-wider text-teal-400 font-semibold mb-1 flex items-center justify-between">
              <span>{mode === "goal" ? "Required Gross Pre-Tax Profit" : "Estimated Net After-Tax Profit"}</span>
              <span className="text-gray-400 capitalize">{contractType === "equity" ? "Equity Options" : "SPX 1256"}</span>
            </div>

            <div className="text-4xl md:text-5xl font-black text-white font-mono my-2 tracking-tight">
              {mode === "goal"
                ? formatCurrency(currentResult.grossProfit)
                : formatCurrency(currentResult.netProfit)}
            </div>

            <div className="text-xs text-gray-300 mt-2 flex flex-wrap items-center gap-y-1 gap-x-4">
              <span>
                {mode === "goal" ? "To pocket net:" : "Starting gross:"}{" "}
                <strong className="text-teal-300">{formatCurrency(validTarget)}</strong>
              </span>
              <span>
                Total Tax Drag:{" "}
                <strong className="text-red-400">{formatCurrency(currentResult.totalTax)}</strong>
              </span>
              <span>
                Effective Rate:{" "}
                <strong className="text-yellow-400">{currentResult.effectiveRate.toFixed(1)}%</strong>
              </span>
            </div>

            {hasAccount && (
              <div className="mt-4 pt-4 border-t border-gray-700/80 grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-800/80 p-2.5 rounded-lg border border-gray-700">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Required Gross Return</div>
                  <div className="text-lg font-bold text-teal-300 font-mono mt-0.5">
                    {grossReturnOnAccount.toFixed(1)}% / yr
                  </div>
                </div>
                <div className="bg-gray-800/80 p-2.5 rounded-lg border border-gray-700">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Net Take-Home Return</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {netReturnOnAccount.toFixed(1)}% / yr
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tax Slices Breakdown Card */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scale className="text-teal-400" size={16} /> Tax Burden Breakdown
              </span>
              <span className="text-xs text-gray-400">
                Top Marginal: <strong className="text-gray-200">{currentResult.marginalRate.toFixed(1)}%</strong>
              </span>
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-600/60">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  Federal Income Tax:
                </span>
                <span className="font-mono text-white font-medium">
                  {formatCurrency(currentResult.federalTax)}
                  <span className="text-xs text-gray-400 ml-1.5">
                    ({currentResult.grossProfit > 0 ? ((currentResult.federalTax / currentResult.grossProfit) * 100).toFixed(1) : 0}%)
                  </span>
                </span>
              </div>

              {contractType === "section1256" && (
                <div className="pl-4 text-xs text-gray-400 flex justify-between">
                  <span>↳ 40% Short-Term: {formatCurrency(currentResult.federalOrdinaryTax)}</span>
                  <span>60% Long-Term: {formatCurrency(currentResult.federalLtcgTax)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-gray-600/60">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  {currentState.name} State Tax:
                </span>
                <span className="font-mono text-white font-medium">
                  {formatCurrency(currentResult.stateTax + currentResult.nycTax)}
                  <span className="text-xs text-gray-400 ml-1.5">
                    ({currentResult.grossProfit > 0 ? (((currentResult.stateTax + currentResult.nycTax) / currentResult.grossProfit) * 100).toFixed(1) : 0}%)
                  </span>
                </span>
              </div>

              {currentResult.nycTax > 0 && (
                <div className="pl-4 text-xs text-gray-400 flex justify-between">
                  <span>↳ NY State: {formatCurrency(currentResult.stateTax)}</span>
                  <span>NYC Resident Tax: {formatCurrency(currentResult.nycTax)}</span>
                </div>
              )}

              {currentResult.niitTax > 0 && (
                <div className="flex justify-between items-center py-1.5 border-b border-gray-600/60">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                    Net Investment Income Tax (NIIT 3.8%):
                  </span>
                  <span className="font-mono text-red-300 font-medium">
                    {formatCurrency(currentResult.niitTax)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 font-bold text-gray-100">
                <span>Total Taxes Deducted:</span>
                <span className="font-mono text-red-400">{formatCurrency(currentResult.totalTax)}</span>
              </div>
            </div>
          </div>

          {/* Visual Breakdown: Donut Chart */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <PieChartIcon className="text-teal-400" size={16} /> Gross Profit Allocation
            </h3>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#1f2937" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trading Milestones Table */}
          <div className="bg-gray-700/80 p-5 rounded-xl border border-gray-600">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="text-teal-400" size={16} /> Trading Milestone Targets
              </span>
              <span className="text-xs text-gray-400 font-normal">252 Trading Days</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-600 text-gray-400">
                    <th className="pb-2 font-medium">Horizon</th>
                    <th className="pb-2 font-medium text-right">Gross Target</th>
                    <th className="pb-2 font-medium text-right">Net Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/60 font-mono">
                  <tr>
                    <td className="py-2 text-gray-300 font-sans font-medium">Daily Target (252 days)</td>
                    <td className="py-2 text-right text-teal-400 font-bold">{formatExactCurrency(grossDaily)}</td>
                    <td className="py-2 text-right text-emerald-400">{formatExactCurrency(netDaily)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-300 font-sans font-medium">Weekly Target (52 weeks)</td>
                    <td className="py-2 text-right text-teal-400">{formatCurrency(grossWeekly)}</td>
                    <td className="py-2 text-right text-emerald-400">{formatCurrency(netWeekly)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-300 font-sans font-medium">Monthly Target (12 months)</td>
                    <td className="py-2 text-right text-teal-400 font-bold">{formatCurrency(grossMonthly)}</td>
                    <td className="py-2 text-right text-emerald-400">{formatCurrency(netMonthly)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-300 font-sans font-medium">Annual Target</td>
                    <td className="py-2 text-right text-teal-300 font-bold">{formatCurrency(grossAnnual)}</td>
                    <td className="py-2 text-right text-emerald-300 font-bold">{formatCurrency(netAnnual)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 italic">
              Tip: Match your daily gross target ({formatExactCurrency(grossDaily)}) to your theta decay in our Daily Theta Calculator!
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1256 TAX ALPHA HIGHLIGHT BOX */}
      <div className="mt-10 bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-gray-800 p-6 md:p-8 rounded-xl border border-teal-500/60 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40 mb-2">
              <Sparkles size={14} /> The Section 1256 Tax Alpha Advantage
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              Broad-Based Index Options (SPX/NDX) vs. Equities (SPY/AAPL)
            </h3>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Under IRS Section 1256, broad index options receive favorable 60% long-term / 40% short-term capital gains tax rates, regardless of trade duration.
            </p>
          </div>

          <div className="bg-gray-900/80 px-5 py-4 rounded-xl border border-teal-500/40 text-center shrink-0 w-full md:w-auto">
            <div className="text-xs uppercase text-teal-400 font-bold tracking-wider">
              {mode === "goal" ? "Gross Market Profit Saved" : "Extra Net Cash In Pocket"}
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {mode === "goal" ? formatCurrency(grossSavings) : formatCurrency(taxSavings)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {rateAdvantage.toFixed(1)}% lower effective tax rate
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/60 p-5 rounded-lg border border-gray-700">
            <div className="text-sm font-bold text-gray-300 mb-2 flex items-center justify-between">
              <span>Standard Equity Options (100% STCG)</span>
              <span className="text-xs text-red-400 font-mono">{comparisonResults.equity.effectiveRate.toFixed(1)}% Tax</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Required Gross:</span>
                <span className="text-white font-bold">{formatCurrency(comparisonResults.equity.grossProfit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tax Drag:</span>
                <span className="text-red-400">{formatCurrency(comparisonResults.equity.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Take-Home:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(comparisonResults.equity.netProfit)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 p-5 rounded-lg border border-teal-500/40">
            <div className="text-sm font-bold text-teal-300 mb-2 flex items-center justify-between">
              <span>Section 1256 Index Options (60/40)</span>
              <span className="text-xs text-emerald-400 font-mono">{comparisonResults.section1256.effectiveRate.toFixed(1)}% Tax</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Required Gross:</span>
                <span className="text-teal-300 font-bold">{formatCurrency(comparisonResults.section1256.grossProfit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tax Drag:</span>
                <span className="text-emerald-400">{formatCurrency(comparisonResults.section1256.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Take-Home:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(comparisonResults.section1256.netProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side by side chart */}
        <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700">
          <div className="text-xs font-semibold text-gray-300 mb-4">Side-by-Side Comparison</div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={false}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="Gross Profit" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Total Taxes" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net Take-Home" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SEO & Educational Content */}
      <div className="text-gray-400 text-sm mt-10 space-y-4 border-t border-gray-700/80 pt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200">
          What is the Options After-Tax Return Planner?
        </h2>
        <p>
          The <strong>Options After-Tax Return Planner</strong> is designed to help options traders bridge the gap between gross trading gains and real-world take-home income. While most trading calculators focus solely on pre-tax returns, taxes represent the single largest friction for retail options traders. Short-term capital gains from equity options are taxed at ordinary income rates (up to 37% federal plus state taxes), which can consume 30% to 50%+ of your gross profits.
        </p>
        <p>
          This tool solves the reverse financial planning question: <em>&ldquo;If I want to pocket $50,000 net after taxes this year, how much gross profit do I actually need to generate in the market?&rdquo;</em> It models federal tax brackets, all 50 US states, local surtaxes (such as NYC resident tax), and the 3.8% Net Investment Income Tax (NIIT).
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How It Works</h3>
        <p>
          Unlike simple flat-rate estimates, this calculator accounts for real-world tax mechanics:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            <strong>Income Bracket Stacking</strong>: Trading profits sit on top of your baseline annual income (such as W-2 wages or business profits). Entering your baseline income ensures your profits are taxed at your true <strong>marginal tax bracket</strong> rather than artificially starting at the 0% or 10% bottom tiers.
          </li>
          <li>
            <strong>Section 1256 Index Options (60/40 Rule)</strong>: Broad-based index options (SPX, NDX, RUT, XSP) qualify for Section 1256 treatment, where <strong>60% of gains are taxed at lower long-term capital gains rates</strong> (max 20%) and only <strong>40% at short-term rates</strong> (max 37%), regardless of how long you hold the contracts.
          </li>
          <li>
            <strong>All 50 US States &amp; DC</strong>: Accurately calculates state tax drag whether you reside in a 0% tax state (e.g., Texas, Florida, Nevada, Washington), a flat-tax state (e.g., Pennsylvania, Illinois, North Carolina), or a graduated progressive state (e.g., California up to 13.3%, New York, New Jersey).
          </li>
          <li>
            <strong>Net Investment Income Tax (NIIT)</strong>: Automatically factors in the federal 3.8% surtax on investment income for high earners exceeding statutory MAGI thresholds ($200,000 for Single filers, $250,000 for Married Filing Jointly).
          </li>
          <li>
            <strong>Mathematical Inverse Solver</strong>: Uses a high-precision binary search algorithm to solve for the exact required pre-tax gross profit down to $0.01.
          </li>
        </ul>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">
          Section 1256 Index Options vs. Standard Equity Options
        </h3>
        <p>
          One of the highest-leverage decisions an options trader can make is selecting between single-stock/ETF options (e.g., AAPL, TSLA, SPY, QQQ) and broad-based index options (e.g., SPX, NDX, XSP). Standard equity options are taxed as 100% short-term capital gains (ordinary income). By contrast, Section 1256 index contracts reduce your top federal capital gains rate from 37% down to roughly 26.8%—saving thousands of dollars in tax drag on identical market gains without any additional market risk.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-gray-300">How to Use the Tool</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Choose your planning mode: <strong>Target Net Goal → Required Gross</strong> (to plan your required trading profit) or <strong>Gross Profit → Net Take-Home</strong> (to estimate tax liability on existing gains).
          </li>
          <li>
            Enter your <strong>Target Dollar Amount</strong> or select one of the quick preset chips ($10k, $25k, $50k, $100k, $250k).
          </li>
          <li>
            Select your <strong>State of Residence</strong> from the dropdown. States with 0% state income tax, flat rates, or tiered brackets are automatically identified.
          </li>
          <li>
            Choose your <strong>Tax Filing Status</strong> (Single, Married Filing Jointly, or Head of Household) and enter your estimated <strong>Other Baseline Income</strong> to model bracket placement.
          </li>
          <li>
            Toggle between <strong>Equity Options</strong> (100% short-term) and <strong>Section 1256 Index Options</strong> (60/40 rule) to compare your tax obligations.
          </li>
          <li>
            (Optional) Enter your <strong>Account Net Liquidity</strong> to see the required annual pre-tax return percentage on your trading capital.
          </li>
          <li>
            Review the <strong>Trading Milestone Targets</strong> to see your daily profit target (based on 252 trading days) to engineer your daily theta decay target.
          </li>
          <li>
            Your inputs are automatically saved locally in your browser so your planning numbers persist on your next visit.
          </li>
        </ol>
      </div>
    </div>
  );
}
