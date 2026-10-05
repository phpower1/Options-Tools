import {
  FilingStatus,
  FEDERAL_ORDINARY_BRACKETS,
  FEDERAL_LTCG_BRACKETS,
  NIIT_CONFIG,
  US_STATES,
  StateBracket,
} from "./taxData";

export interface TaxCalculationParams {
  grossProfit: number;
  baselineIncome: number;
  filingStatus: FilingStatus;
  stateCode: string;
  isNycResident?: boolean;
  contractType: "equity" | "section1256";
}

export interface TaxBreakdown {
  grossProfit: number;
  netProfit: number;
  federalOrdinaryTax: number;
  federalLtcgTax: number;
  federalTax: number;
  stateTax: number;
  nycTax: number;
  niitTax: number;
  totalTax: number;
  effectiveRate: number; // 0 to 100
  marginalRate: number;  // Combined top marginal rate %
  contractType: "equity" | "section1256";
}

// NYC progressive tax brackets
const NYC_BRACKETS: StateBracket[] = [
  { rate: 0.03078, singleMin: 0, singleMax: 12000, mfjMin: 0, mfjMax: 21600 },
  { rate: 0.03762, singleMin: 12000, singleMax: 25000, mfjMin: 21600, mfjMax: 45000 },
  { rate: 0.03819, singleMin: 25000, singleMax: 50000, mfjMin: 45000, mfjMax: 90000 },
  { rate: 0.03876, singleMin: 50000, singleMax: Infinity, mfjMin: 90000, mfjMax: Infinity },
];

/**
 * Calculates progressive tax across an income span [startIncome, startIncome + additionalIncome]
 */
function calculateSpanTax(
  startIncome: number,
  additionalIncome: number,
  brackets: { rate: number; min: number; max: number }[]
): number {
  if (additionalIncome <= 0) return 0;
  const endIncome = startIncome + additionalIncome;
  let tax = 0;

  for (const b of brackets) {
    if (endIncome <= b.min) break;
    if (startIncome >= b.max) continue;

    const taxableStart = Math.max(startIncome, b.min);
    const taxableEnd = Math.min(endIncome, b.max);
    const taxableInBracket = Math.max(0, taxableEnd - taxableStart);
    tax += taxableInBracket * b.rate;
  }

  return tax;
}

/**
 * Calculates marginal ordinary federal tax on an additional slice of income
 */
export function calculateFederalOrdinaryTax(
  baselineIncome: number,
  additionalIncome: number,
  filingStatus: FilingStatus
): number {
  const brackets = FEDERAL_ORDINARY_BRACKETS.map((b) => ({
    rate: b.rate,
    min: filingStatus === "mfj" ? b.mfjMin : filingStatus === "hoh" ? b.hohMin : b.singleMin,
    max: filingStatus === "mfj" ? b.mfjMax : filingStatus === "hoh" ? b.hohMax : b.singleMax,
  }));

  return calculateSpanTax(baselineIncome, additionalIncome, brackets);
}

/**
 * Calculates federal LTCG tax on capital gains stacked on top of existing taxable income
 */
export function calculateFederalLtcgTax(
  incomeUnderLtcg: number,
  ltcgAmount: number,
  filingStatus: FilingStatus
): number {
  if (ltcgAmount <= 0) return 0;

  const brackets = FEDERAL_LTCG_BRACKETS.map((b) => ({
    rate: b.rate,
    min: filingStatus === "mfj" ? b.mfjMin : filingStatus === "hoh" ? b.hohMin : b.singleMin,
    max: filingStatus === "mfj" ? b.mfjMax : filingStatus === "hoh" ? b.hohMax : b.singleMax,
  }));

  return calculateSpanTax(incomeUnderLtcg, ltcgAmount, brackets);
}

/**
 * Calculates Net Investment Income Tax (NIIT 3.8%)
 */
export function calculateNiit(
  baselineIncome: number,
  investmentProfit: number,
  filingStatus: FilingStatus
): number {
  if (investmentProfit <= 0) return 0;
  const threshold = NIIT_CONFIG.thresholds[filingStatus];
  const totalIncome = baselineIncome + investmentProfit;

  if (totalIncome <= threshold) return 0;

  const subjectToNiit = Math.min(investmentProfit, totalIncome - threshold);
  return subjectToNiit * NIIT_CONFIG.rate;
}

/**
 * Calculates state tax on incremental trading gains
 */
export function calculateStateTax(
  baselineIncome: number,
  grossProfit: number,
  contractType: "equity" | "section1256",
  filingStatus: FilingStatus,
  stateCode: string,
  isNycResident?: boolean
): { stateTax: number; nycTax: number } {
  if (grossProfit <= 0) return { stateTax: 0, nycTax: 0 };
  const state = US_STATES[stateCode] || US_STATES.TX;

  let stateTax = 0;
  let nycTax = 0;

  if (state.type === "none") {
    // Washington special rule: 7% on net long-term capital gains over $250,000
    if (state.code === "WA" && contractType === "section1256") {
      const ltcgPortion = grossProfit * 0.6;
      if (ltcgPortion > 250000) {
        stateTax = (ltcgPortion - 250000) * 0.07;
      }
    }
  } else if (state.type === "flat" && state.flatRate) {
    stateTax = grossProfit * state.flatRate;
  } else if (state.code === "MA" && state.hasSpecialSTCGRule) {
    // Massachusetts: 8.5% on STCG, 5% on ordinary/LTCG, + 4% surtax over $1,053,750
    const totalIncome = baselineIncome + grossProfit;
    const surtaxThreshold = 1053750;
    const surtaxPortion = Math.max(0, totalIncome - Math.max(baselineIncome, surtaxThreshold));
    const surtax = surtaxPortion * 0.04;

    if (contractType === "equity") {
      stateTax = grossProfit * 0.085 + surtax;
    } else {
      const stcg = grossProfit * 0.4;
      const ltcg = grossProfit * 0.6;
      stateTax = stcg * 0.085 + ltcg * 0.05 + surtax;
    }
  } else if (state.brackets && state.brackets.length > 0) {
    const brackets = state.brackets.map((b) => ({
      rate: b.rate,
      min: filingStatus === "mfj" ? b.mfjMin : b.singleMin,
      max: filingStatus === "mfj" ? b.mfjMax : b.singleMax,
    }));
    stateTax = calculateSpanTax(baselineIncome, grossProfit, brackets);
  }

  // Check NYC resident tax
  if (state.code === "NY" && isNycResident) {
    const nycBrackets = NYC_BRACKETS.map((b) => ({
      rate: b.rate,
      min: filingStatus === "mfj" ? b.mfjMin : b.singleMin,
      max: filingStatus === "mfj" ? b.mfjMax : b.singleMax,
    }));
    nycTax = calculateSpanTax(baselineIncome, grossProfit, nycBrackets);
  }

  return { stateTax, nycTax };
}

/**
 * Forward Tax Calculation: Computes all taxes given gross trading profit
 */
export function calculateTaxes(params: TaxCalculationParams): TaxBreakdown {
  const { grossProfit, baselineIncome, filingStatus, stateCode, isNycResident, contractType } = params;

  if (grossProfit <= 0) {
    return {
      grossProfit: 0,
      netProfit: 0,
      federalOrdinaryTax: 0,
      federalLtcgTax: 0,
      federalTax: 0,
      stateTax: 0,
      nycTax: 0,
      niitTax: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0,
      contractType,
    };
  }

  let federalOrdinaryTax = 0;
  let federalLtcgTax = 0;

  if (contractType === "equity") {
    // 100% Short-term capital gains (ordinary rates)
    federalOrdinaryTax = calculateFederalOrdinaryTax(baselineIncome, grossProfit, filingStatus);
  } else {
    // Section 1256: 60% Long-term, 40% Short-term
    const stcgPart = grossProfit * 0.4;
    const ltcgPart = grossProfit * 0.6;

    federalOrdinaryTax = calculateFederalOrdinaryTax(baselineIncome, stcgPart, filingStatus);
    federalLtcgTax = calculateFederalLtcgTax(baselineIncome + stcgPart, ltcgPart, filingStatus);
  }

  const federalTax = federalOrdinaryTax + federalLtcgTax;
  const niitTax = calculateNiit(baselineIncome, grossProfit, filingStatus);
  const { stateTax, nycTax } = calculateStateTax(
    baselineIncome,
    grossProfit,
    contractType,
    filingStatus,
    stateCode,
    isNycResident
  );

  const totalTax = federalTax + stateTax + nycTax + niitTax;
  const netProfit = grossProfit - totalTax;
  const effectiveRate = grossProfit > 0 ? (totalTax / grossProfit) * 100 : 0;

  // Approximate top combined marginal rate at the top dollar of profit
  const delta = 100;
  const deltaTax =
    calculateTaxes({
      ...params,
      grossProfit: grossProfit + delta,
    }).totalTax - totalTax;
  const marginalRate = Math.min(100, Math.max(0, (deltaTax / delta) * 100));

  return {
    grossProfit,
    netProfit,
    federalOrdinaryTax,
    federalLtcgTax,
    federalTax,
    stateTax,
    nycTax,
    niitTax,
    totalTax,
    effectiveRate,
    marginalRate,
    contractType,
  };
}

/**
 * Reverse Solver: Solves for required gross profit to achieve a desired after-tax net profit
 * Uses high-precision bisection (binary search) over strictly monotonic net profit curve.
 */
export function solveRequiredGrossProfit(
  desiredNetProfit: number,
  baselineIncome: number,
  filingStatus: FilingStatus,
  stateCode: string,
  contractType: "equity" | "section1256",
  isNycResident?: boolean
): TaxBreakdown {
  if (desiredNetProfit <= 0) {
    return calculateTaxes({
      grossProfit: 0,
      baselineIncome,
      filingStatus,
      stateCode,
      isNycResident,
      contractType,
    });
  }

  // Upper bound discovery: tax will not exceed 75% in the US, so gross <= net * 4
  let low = desiredNetProfit;
  let high = Math.max(10000, desiredNetProfit * 3);

  while (
    calculateTaxes({
      grossProfit: high,
      baselineIncome,
      filingStatus,
      stateCode,
      isNycResident,
      contractType,
    }).netProfit < desiredNetProfit
  ) {
    high *= 2;
    if (high > 100000000) break; // Guard against overflow
  }

  // Binary search for exact gross within 1 cent ($0.01)
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const res = calculateTaxes({
      grossProfit: mid,
      baselineIncome,
      filingStatus,
      stateCode,
      isNycResident,
      contractType,
    });

    if (Math.abs(res.netProfit - desiredNetProfit) < 0.005) {
      return res;
    }

    if (res.netProfit < desiredNetProfit) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return calculateTaxes({
    grossProfit: (low + high) / 2,
    baselineIncome,
    filingStatus,
    stateCode,
    isNycResident,
    contractType,
  });
}
