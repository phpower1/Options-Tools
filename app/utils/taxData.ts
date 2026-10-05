export type FilingStatus = "single" | "mfj" | "hoh";

export interface TaxBracket {
  rate: number;
  singleMin: number;
  singleMax: number;
  mfjMin: number;
  mfjMax: number;
  hohMin: number;
  hohMax: number;
}

// 2025/2026 Federal Ordinary Income Tax Brackets (Used for Equity Options & Short-Term Capital Gains)
export const FEDERAL_ORDINARY_BRACKETS: TaxBracket[] = [
  { rate: 0.10, singleMin: 0,       singleMax: 11925,   mfjMin: 0,       mfjMax: 23850,   hohMin: 0,       hohMax: 17000 },
  { rate: 0.12, singleMin: 11925,   singleMax: 48475,   mfjMin: 23850,   mfjMax: 96950,   hohMin: 17000,   hohMax: 64850 },
  { rate: 0.22, singleMin: 48475,   singleMax: 103350,  mfjMin: 96950,   mfjMax: 206700,  hohMin: 64850,   hohMax: 103350 },
  { rate: 0.24, singleMin: 103350,  singleMax: 197300,  mfjMin: 206700,  mfjMax: 394600,  hohMin: 103350,  hohMax: 197300 },
  { rate: 0.32, singleMin: 197300,  singleMax: 250525,  mfjMin: 394600,  mfjMax: 501050,  hohMin: 197300,  hohMax: 250500 },
  { rate: 0.35, singleMin: 250525,  singleMax: 626350,  mfjMin: 501050,  mfjMax: 751600,  hohMin: 250500,  hohMax: 626350 },
  { rate: 0.37, singleMin: 626350,  singleMax: Infinity,mfjMin: 751600,  mfjMax: Infinity,hohMin: 626350,  hohMax: Infinity },
];

// Federal Long-Term Capital Gains Brackets (Used for 60% of Section 1256 Index Options)
export const FEDERAL_LTCG_BRACKETS: TaxBracket[] = [
  { rate: 0.00, singleMin: 0,       singleMax: 48350,   mfjMin: 0,       mfjMax: 96700,   hohMin: 0,       hohMax: 64750 },
  { rate: 0.15, singleMin: 48350,   singleMax: 533400,  mfjMin: 96700,   mfjMax: 600050,  hohMin: 64750,   hohMax: 566700 },
  { rate: 0.20, singleMin: 533400,  singleMax: Infinity,mfjMin: 600050,  mfjMax: Infinity,hohMin: 566700,  hohMax: Infinity },
];

// Net Investment Income Tax (NIIT) - 3.8% on net investment income above threshold
export const NIIT_CONFIG = {
  rate: 0.038,
  thresholds: {
    single: 200000,
    mfj: 250000,
    hoh: 200000,
  },
};

export interface StateBracket {
  rate: number;
  singleMin: number;
  singleMax: number;
  mfjMin: number;
  mfjMax: number;
}

export interface StateTaxConfig {
  code: string;
  name: string;
  type: "none" | "flat" | "graduated";
  flatRate?: number;
  brackets?: StateBracket[];
  hasNycOption?: boolean;
  notes?: string;
  hasSpecialSTCGRule?: boolean; // e.g. Massachusetts 8.5% STCG
  stcgRate?: number;
}

// 50 US States + District of Columbia
export const US_STATES: Record<string, StateTaxConfig> = {
  AL: {
    code: "AL",
    name: "Alabama",
    type: "graduated",
    brackets: [
      { rate: 0.02, singleMin: 0, singleMax: 500, mfjMin: 0, mfjMax: 1000 },
      { rate: 0.04, singleMin: 500, singleMax: 3000, mfjMin: 1000, mfjMax: 6000 },
      { rate: 0.05, singleMin: 3000, singleMax: Infinity, mfjMin: 6000, mfjMax: Infinity },
    ],
  },
  AK: { code: "AK", name: "Alaska", type: "none", notes: "No state income or capital gains tax." },
  AZ: { code: "AZ", name: "Arizona", type: "flat", flatRate: 0.025, notes: "Flat 2.5% income tax." },
  AR: {
    code: "AR",
    name: "Arkansas",
    type: "graduated",
    brackets: [
      { rate: 0.02, singleMin: 0, singleMax: 4400, mfjMin: 0, mfjMax: 8800 },
      { rate: 0.035, singleMin: 4400, singleMax: 8800, mfjMin: 8800, mfjMax: 17600 },
      { rate: 0.039, singleMin: 8800, singleMax: Infinity, mfjMin: 17600, mfjMax: Infinity },
    ],
  },
  CA: {
    code: "CA",
    name: "California",
    type: "graduated",
    notes: "Taxes all capital gains as ordinary income up to 13.3% (includes 1% mental health surtax over $1M).",
    brackets: [
      { rate: 0.01, singleMin: 0, singleMax: 10756, mfjMin: 0, mfjMax: 21512 },
      { rate: 0.02, singleMin: 10756, singleMax: 25499, mfjMin: 21512, mfjMax: 50998 },
      { rate: 0.04, singleMin: 25499, singleMax: 40245, mfjMin: 50998, mfjMax: 80490 },
      { rate: 0.06, singleMin: 40245, singleMax: 55866, mfjMin: 80490, mfjMax: 111732 },
      { rate: 0.08, singleMin: 55866, singleMax: 70606, mfjMin: 111732, mfjMax: 141212 },
      { rate: 0.093, singleMin: 70606, singleMax: 360659, mfjMin: 141212, mfjMax: 721318 },
      { rate: 0.103, singleMin: 360659, singleMax: 432787, mfjMin: 721318, mfjMax: 865574 },
      { rate: 0.113, singleMin: 432787, singleMax: 721314, mfjMin: 865574, mfjMax: 1442628 },
      { rate: 0.123, singleMin: 721314, singleMax: 1000000, mfjMin: 1442628, mfjMax: 1442628 },
      { rate: 0.133, singleMin: 1000000, singleMax: Infinity, mfjMin: 1442628, mfjMax: Infinity },
    ],
  },
  CO: { code: "CO", name: "Colorado", type: "flat", flatRate: 0.044, notes: "Flat 4.4% income tax." },
  CT: {
    code: "CT",
    name: "Connecticut",
    type: "graduated",
    brackets: [
      { rate: 0.03, singleMin: 0, singleMax: 10000, mfjMin: 0, mfjMax: 20000 },
      { rate: 0.05, singleMin: 10000, singleMax: 50000, mfjMin: 20000, mfjMax: 100000 },
      { rate: 0.055, singleMin: 50000, singleMax: 100000, mfjMin: 100000, mfjMax: 200000 },
      { rate: 0.06, singleMin: 100000, singleMax: 200000, mfjMin: 200000, mfjMax: 400000 },
      { rate: 0.065, singleMin: 200000, singleMax: 250000, mfjMin: 400000, mfjMax: 500000 },
      { rate: 0.069, singleMin: 250000, singleMax: 500000, mfjMin: 500000, mfjMax: 1000000 },
      { rate: 0.0699, singleMin: 500000, singleMax: Infinity, mfjMin: 1000000, mfjMax: Infinity },
    ],
  },
  DE: {
    code: "DE",
    name: "Delaware",
    type: "graduated",
    brackets: [
      { rate: 0.022, singleMin: 2000, singleMax: 5000, mfjMin: 2000, mfjMax: 5000 },
      { rate: 0.039, singleMin: 5000, singleMax: 10000, mfjMin: 5000, mfjMax: 10000 },
      { rate: 0.048, singleMin: 10000, singleMax: 20000, mfjMin: 10000, mfjMax: 20000 },
      { rate: 0.052, singleMin: 20000, singleMax: 25000, mfjMin: 20000, mfjMax: 25000 },
      { rate: 0.0555, singleMin: 25000, singleMax: 60000, mfjMin: 25000, mfjMax: 60000 },
      { rate: 0.066, singleMin: 60000, singleMax: Infinity, mfjMin: 60000, mfjMax: Infinity },
    ],
  },
  DC: {
    code: "DC",
    name: "District of Columbia",
    type: "graduated",
    brackets: [
      { rate: 0.04, singleMin: 0, singleMax: 10000, mfjMin: 0, mfjMax: 10000 },
      { rate: 0.06, singleMin: 10000, singleMax: 40000, mfjMin: 10000, mfjMax: 40000 },
      { rate: 0.065, singleMin: 40000, singleMax: 60000, mfjMin: 40000, mfjMax: 60000 },
      { rate: 0.085, singleMin: 60000, singleMax: 250000, mfjMin: 60000, mfjMax: 250000 },
      { rate: 0.0925, singleMin: 250000, singleMax: 500000, mfjMin: 250000, mfjMax: 500000 },
      { rate: 0.0975, singleMin: 500000, singleMax: 1000000, mfjMin: 500000, mfjMax: 1000000 },
      { rate: 0.1075, singleMin: 1000000, singleMax: Infinity, mfjMin: 1000000, mfjMax: Infinity },
    ],
  },
  FL: { code: "FL", name: "Florida", type: "none", notes: "No state income or capital gains tax." },
  GA: { code: "GA", name: "Georgia", type: "flat", flatRate: 0.0539, notes: "Flat 5.39% income tax." },
  HI: {
    code: "HI",
    name: "Hawaii",
    type: "graduated",
    brackets: [
      { rate: 0.014, singleMin: 0, singleMax: 2400, mfjMin: 0, mfjMax: 4800 },
      { rate: 0.032, singleMin: 2400, singleMax: 4800, mfjMin: 4800, mfjMax: 9600 },
      { rate: 0.055, singleMin: 4800, singleMax: 9600, mfjMin: 9600, mfjMax: 19200 },
      { rate: 0.064, singleMin: 9600, singleMax: 14400, mfjMin: 19200, mfjMax: 28800 },
      { rate: 0.068, singleMin: 14400, singleMax: 19200, mfjMin: 28800, mfjMax: 38400 },
      { rate: 0.072, singleMin: 19200, singleMax: 24000, mfjMin: 38400, mfjMax: 48000 },
      { rate: 0.076, singleMin: 24000, singleMax: 36000, mfjMin: 48000, mfjMax: 72000 },
      { rate: 0.079, singleMin: 36000, singleMax: 48000, mfjMin: 72000, mfjMax: 96000 },
      { rate: 0.0825, singleMin: 48000, singleMax: 150000, mfjMin: 96000, mfjMax: 300000 },
      { rate: 0.09, singleMin: 150000, singleMax: 175000, mfjMin: 300000, mfjMax: 350000 },
      { rate: 0.10, singleMin: 175000, singleMax: 200000, mfjMin: 350000, mfjMax: 400000 },
      { rate: 0.11, singleMin: 200000, singleMax: Infinity, mfjMin: 400000, mfjMax: Infinity },
    ],
  },
  ID: { code: "ID", name: "Idaho", type: "flat", flatRate: 0.05695, notes: "Flat 5.695% income tax." },
  IL: { code: "IL", name: "Illinois", type: "flat", flatRate: 0.0495, notes: "Flat 4.95% income tax." },
  IN: { code: "IN", name: "Indiana", type: "flat", flatRate: 0.0305, notes: "Flat 3.05% state income tax (local county tax may add 1-2%)." },
  IA: { code: "IA", name: "Iowa", type: "flat", flatRate: 0.038, notes: "Flat 3.8% state income tax." },
  KS: {
    code: "KS",
    name: "Kansas",
    type: "graduated",
    brackets: [
      { rate: 0.031, singleMin: 0, singleMax: 15000, mfjMin: 0, mfjMax: 30000 },
      { rate: 0.0525, singleMin: 15000, singleMax: 30000, mfjMin: 30000, mfjMax: 60000 },
      { rate: 0.057, singleMin: 30000, singleMax: Infinity, mfjMin: 60000, mfjMax: Infinity },
    ],
  },
  KY: { code: "KY", name: "Kentucky", type: "flat", flatRate: 0.04, notes: "Flat 4.0% income tax." },
  LA: {
    code: "LA",
    name: "Louisiana",
    type: "graduated",
    brackets: [
      { rate: 0.0185, singleMin: 0, singleMax: 12500, mfjMin: 0, mfjMax: 25000 },
      { rate: 0.035, singleMin: 12500, singleMax: 50000, mfjMin: 25000, mfjMax: 100000 },
      { rate: 0.0425, singleMin: 50000, singleMax: Infinity, mfjMin: 100000, mfjMax: Infinity },
    ],
  },
  ME: {
    code: "ME",
    name: "Maine",
    type: "graduated",
    brackets: [
      { rate: 0.058, singleMin: 0, singleMax: 26050, mfjMin: 0, mfjMax: 52100 },
      { rate: 0.0675, singleMin: 26050, singleMax: 61600, mfjMin: 52100, mfjMax: 123250 },
      { rate: 0.0715, singleMin: 61600, singleMax: Infinity, mfjMin: 123250, mfjMax: Infinity },
    ],
  },
  MD: {
    code: "MD",
    name: "Maryland",
    type: "graduated",
    notes: "State top rate 5.75% plus standard local county tax (typically ~3.2%, modeled at average 8.95% top marginal).",
    brackets: [
      { rate: 0.052, singleMin: 0, singleMax: 100000, mfjMin: 0, mfjMax: 150000 },
      { rate: 0.0795, singleMin: 100000, singleMax: 150000, mfjMin: 150000, mfjMax: 200000 },
      { rate: 0.0845, singleMin: 150000, singleMax: 250000, mfjMin: 200000, mfjMax: 300000 },
      { rate: 0.0895, singleMin: 250000, singleMax: Infinity, mfjMin: 300000, mfjMax: Infinity },
    ],
  },
  MA: {
    code: "MA",
    name: "Massachusetts",
    type: "graduated",
    hasSpecialSTCGRule: true,
    stcgRate: 0.085, // 8.5% on short-term capital gains!
    notes: "Short-term capital gains are taxed at 8.5%. Includes 4% Fair Share surtax on income over $1,053,750.",
    brackets: [
      { rate: 0.05, singleMin: 0, singleMax: 1053750, mfjMin: 0, mfjMax: 1053750 },
      { rate: 0.09, singleMin: 1053750, singleMax: Infinity, mfjMin: 1053750, mfjMax: Infinity },
    ],
  },
  MI: { code: "MI", name: "Michigan", type: "flat", flatRate: 0.0425, notes: "Flat 4.25% income tax." },
  MN: {
    code: "MN",
    name: "Minnesota",
    type: "graduated",
    brackets: [
      { rate: 0.0535, singleMin: 0, singleMax: 31690, mfjMin: 0, mfjMax: 46330 },
      { rate: 0.068, singleMin: 31690, singleMax: 104090, mfjMin: 46330, mfjMax: 184080 },
      { rate: 0.0785, singleMin: 104090, singleMax: 193240, mfjMin: 184080, mfjMax: 321450 },
      { rate: 0.0985, singleMin: 193240, singleMax: 1000000, mfjMin: 321450, mfjMax: 1000000 },
      { rate: 0.1085, singleMin: 1000000, singleMax: Infinity, mfjMin: 1000000, mfjMax: Infinity }, // 1% investment surtax > $1M
    ],
  },
  MS: { code: "MS", name: "Mississippi", type: "flat", flatRate: 0.047, notes: "Flat 4.7% income tax." },
  MO: {
    code: "MO",
    name: "Missouri",
    type: "graduated",
    brackets: [
      { rate: 0.02, singleMin: 0, singleMax: 1273, mfjMin: 0, mfjMax: 1273 },
      { rate: 0.025, singleMin: 1273, singleMax: 2546, mfjMin: 1273, mfjMax: 2546 },
      { rate: 0.03, singleMin: 2546, singleMax: 3819, mfjMin: 2546, mfjMax: 3819 },
      { rate: 0.035, singleMin: 3819, singleMax: 5092, mfjMin: 3819, mfjMax: 5092 },
      { rate: 0.04, singleMin: 5092, singleMax: 6365, mfjMin: 5092, mfjMax: 6365 },
      { rate: 0.045, singleMin: 6365, singleMax: 7638, mfjMin: 6365, mfjMax: 7638 },
      { rate: 0.048, singleMin: 7638, singleMax: Infinity, mfjMin: 7638, mfjMax: Infinity },
    ],
  },
  MT: {
    code: "MT",
    name: "Montana",
    type: "graduated",
    brackets: [
      { rate: 0.047, singleMin: 0, singleMax: 20500, mfjMin: 0, mfjMax: 41000 },
      { rate: 0.059, singleMin: 20500, singleMax: Infinity, mfjMin: 41000, mfjMax: Infinity },
    ],
  },
  NE: {
    code: "NE",
    name: "Nebraska",
    type: "graduated",
    brackets: [
      { rate: 0.0246, singleMin: 0, singleMax: 3700, mfjMin: 0, mfjMax: 7390 },
      { rate: 0.0351, singleMin: 3700, singleMax: 22170, mfjMin: 7390, mfjMax: 44350 },
      { rate: 0.0501, singleMin: 22170, singleMax: 35730, mfjMin: 44350, mfjMax: 71460 },
      { rate: 0.0584, singleMin: 35730, singleMax: Infinity, mfjMin: 71460, mfjMax: Infinity },
    ],
  },
  NV: { code: "NV", name: "Nevada", type: "none", notes: "No state income or capital gains tax." },
  NH: { code: "NH", name: "New Hampshire", type: "none", notes: "No state income tax on trading capital gains." },
  NJ: {
    code: "NJ",
    name: "New Jersey",
    type: "graduated",
    brackets: [
      { rate: 0.014, singleMin: 0, singleMax: 20000, mfjMin: 0, mfjMax: 20000 },
      { rate: 0.0175, singleMin: 20000, singleMax: 35000, mfjMin: 20000, mfjMax: 50000 },
      { rate: 0.035, singleMin: 35000, singleMax: 40000, mfjMin: 50000, mfjMax: 70000 },
      { rate: 0.05525, singleMin: 40000, singleMax: 75000, mfjMin: 70000, mfjMax: 80000 },
      { rate: 0.0637, singleMin: 75000, singleMax: 500000, mfjMin: 80000, mfjMax: 150000 },
      { rate: 0.0897, singleMin: 500000, singleMax: 1000000, mfjMin: 150000, mfjMax: 500000 },
      { rate: 0.1075, singleMin: 1000000, singleMax: Infinity, mfjMin: 1000000, mfjMax: Infinity },
    ],
  },
  NM: {
    code: "NM",
    name: "New Mexico",
    type: "graduated",
    brackets: [
      { rate: 0.017, singleMin: 0, singleMax: 5500, mfjMin: 0, mfjMax: 8000 },
      { rate: 0.032, singleMin: 5500, singleMax: 11000, mfjMin: 8000, mfjMax: 16000 },
      { rate: 0.047, singleMin: 11000, singleMax: 16000, mfjMin: 16000, mfjMax: 24000 },
      { rate: 0.049, singleMin: 16000, singleMax: 210000, mfjMin: 24000, mfjMax: 315000 },
      { rate: 0.059, singleMin: 210000, singleMax: Infinity, mfjMin: 315000, mfjMax: Infinity },
    ],
  },
  NY: {
    code: "NY",
    name: "New York",
    type: "graduated",
    hasNycOption: true,
    notes: "State top rate 10.9%. NYC residents add an additional ~3.08%–3.88% local income tax.",
    brackets: [
      { rate: 0.04, singleMin: 0, singleMax: 8500, mfjMin: 0, mfjMax: 17150 },
      { rate: 0.045, singleMin: 8500, singleMax: 11700, mfjMin: 17150, mfjMax: 23600 },
      { rate: 0.0525, singleMin: 11700, singleMax: 13900, mfjMin: 23600, mfjMax: 27900 },
      { rate: 0.0585, singleMin: 13900, singleMax: 80650, mfjMin: 27900, mfjMax: 161550 },
      { rate: 0.0625, singleMin: 80650, singleMax: 215400, mfjMin: 161550, mfjMax: 323200 },
      { rate: 0.0685, singleMin: 215400, singleMax: 1077550, mfjMin: 323200, mfjMax: 2155350 },
      { rate: 0.0965, singleMin: 1077550, singleMax: 5000000, mfjMin: 2155350, mfjMax: 5000000 },
      { rate: 0.103, singleMin: 5000000, singleMax: 25000000, mfjMin: 5000000, mfjMax: 25000000 },
      { rate: 0.109, singleMin: 25000000, singleMax: Infinity, mfjMin: 25000000, mfjMax: Infinity },
    ],
  },
  NC: { code: "NC", name: "North Carolina", type: "flat", flatRate: 0.045, notes: "Flat 4.5% income tax." },
  ND: {
    code: "ND",
    name: "North Dakota",
    type: "graduated",
    brackets: [
      { rate: 0.00, singleMin: 0, singleMax: 44725, mfjMin: 0, mfjMax: 74750 },
      { rate: 0.0195, singleMin: 44725, singleMax: 225975, mfjMin: 74750, mfjMax: 275100 },
      { rate: 0.025, singleMin: 225975, singleMax: Infinity, mfjMin: 275100, mfjMax: Infinity },
    ],
  },
  OH: {
    code: "OH",
    name: "Ohio",
    type: "graduated",
    brackets: [
      { rate: 0.00, singleMin: 0, singleMax: 26050, mfjMin: 0, mfjMax: 26050 },
      { rate: 0.0275, singleMin: 26050, singleMax: 100000, mfjMin: 26050, mfjMax: 100000 },
      { rate: 0.035, singleMin: 100000, singleMax: Infinity, mfjMin: 100000, mfjMax: Infinity },
    ],
  },
  OK: {
    code: "OK",
    name: "Oklahoma",
    type: "graduated",
    brackets: [
      { rate: 0.0025, singleMin: 0, singleMax: 1000, mfjMin: 0, mfjMax: 2000 },
      { rate: 0.0075, singleMin: 1000, singleMax: 2500, mfjMin: 2000, mfjMax: 5000 },
      { rate: 0.0175, singleMin: 2500, singleMax: 3750, mfjMin: 5000, mfjMax: 7500 },
      { rate: 0.0275, singleMin: 3750, singleMax: 4900, mfjMin: 7500, mfjMax: 9800 },
      { rate: 0.0375, singleMin: 4900, singleMax: 7200, mfjMin: 9800, mfjMax: 12200 },
      { rate: 0.0475, singleMin: 7200, singleMax: Infinity, mfjMin: 12200, mfjMax: Infinity },
    ],
  },
  OR: {
    code: "OR",
    name: "Oregon",
    type: "graduated",
    brackets: [
      { rate: 0.0475, singleMin: 0, singleMax: 4050, mfjMin: 0, mfjMax: 8100 },
      { rate: 0.0675, singleMin: 4050, singleMax: 10200, mfjMin: 8100, mfjMax: 20400 },
      { rate: 0.0875, singleMin: 10200, singleMax: 125000, mfjMin: 20400, mfjMax: 250000 },
      { rate: 0.099, singleMin: 125000, singleMax: Infinity, mfjMin: 250000, mfjMax: Infinity },
    ],
  },
  PA: { code: "PA", name: "Pennsylvania", type: "flat", flatRate: 0.0307, notes: "Flat 3.07% income tax (no deductions allowed for options losses against ordinary income)." },
  RI: {
    code: "RI",
    name: "Rhode Island",
    type: "graduated",
    brackets: [
      { rate: 0.0375, singleMin: 0, singleMax: 77450, mfjMin: 0, mfjMax: 77450 },
      { rate: 0.0475, singleMin: 77450, singleMax: 176050, mfjMin: 77450, mfjMax: 176050 },
      { rate: 0.0599, singleMin: 176050, singleMax: Infinity, mfjMin: 176050, mfjMax: Infinity },
    ],
  },
  SC: {
    code: "SC",
    name: "South Carolina",
    type: "graduated",
    brackets: [
      { rate: 0.00, singleMin: 0, singleMax: 3460, mfjMin: 0, mfjMax: 3460 },
      { rate: 0.03, singleMin: 3460, singleMax: 17330, mfjMin: 3460, mfjMax: 17330 },
      { rate: 0.064, singleMin: 17330, singleMax: Infinity, mfjMin: 17330, mfjMax: Infinity },
    ],
  },
  SD: { code: "SD", name: "South Dakota", type: "none", notes: "No state income or capital gains tax." },
  TN: { code: "TN", name: "Tennessee", type: "none", notes: "No state income or capital gains tax." },
  TX: { code: "TX", name: "Texas", type: "none", notes: "No state income or capital gains tax." },
  UT: { code: "UT", name: "Utah", type: "flat", flatRate: 0.0465, notes: "Flat 4.65% income tax." },
  VT: {
    code: "VT",
    name: "Vermont",
    type: "graduated",
    brackets: [
      { rate: 0.0335, singleMin: 0, singleMax: 45400, mfjMin: 0, mfjMax: 75850 },
      { rate: 0.066, singleMin: 45400, singleMax: 110050, mfjMin: 75850, mfjMax: 183250 },
      { rate: 0.076, singleMin: 110050, singleMax: 229550, mfjMin: 183250, mfjMax: 279300 },
      { rate: 0.0875, singleMin: 229550, singleMax: Infinity, mfjMin: 279300, mfjMax: Infinity },
    ],
  },
  VA: {
    code: "VA",
    name: "Virginia",
    type: "graduated",
    brackets: [
      { rate: 0.02, singleMin: 0, singleMax: 3000, mfjMin: 0, mfjMax: 3000 },
      { rate: 0.03, singleMin: 3000, singleMax: 5000, mfjMin: 3000, mfjMax: 5000 },
      { rate: 0.05, singleMin: 5000, singleMax: 17000, mfjMin: 5000, mfjMax: 17000 },
      { rate: 0.0575, singleMin: 17000, singleMax: Infinity, mfjMin: 17000, mfjMax: Infinity },
    ],
  },
  WA: {
    code: "WA",
    name: "Washington",
    type: "none",
    notes: "0% on equity options and short-term capital gains. (7% tax only applies to net long-term capital gains exceeding $250,000).",
  },
  WV: {
    code: "WV",
    name: "West Virginia",
    type: "graduated",
    brackets: [
      { rate: 0.0236, singleMin: 0, singleMax: 10000, mfjMin: 0, mfjMax: 10000 },
      { rate: 0.0315, singleMin: 10000, singleMax: 25000, mfjMin: 10000, mfjMax: 25000 },
      { rate: 0.0354, singleMin: 25000, singleMax: 40000, mfjMin: 25000, mfjMax: 40000 },
      { rate: 0.0472, singleMin: 40000, singleMax: 60000, mfjMin: 40000, mfjMax: 60000 },
      { rate: 0.0512, singleMin: 60000, singleMax: Infinity, mfjMin: 60000, mfjMax: Infinity },
    ],
  },
  WI: {
    code: "WI",
    name: "Wisconsin",
    type: "graduated",
    brackets: [
      { rate: 0.035, singleMin: 0, singleMax: 14320, mfjMin: 0, mfjMax: 19090 },
      { rate: 0.044, singleMin: 14320, singleMax: 28640, mfjMin: 19090, mfjMax: 38190 },
      { rate: 0.053, singleMin: 28640, singleMax: 315310, mfjMin: 38190, mfjMax: 420420 },
      { rate: 0.0765, singleMin: 315310, singleMax: Infinity, mfjMin: 420420, mfjMax: Infinity },
    ],
  },
  WY: { code: "WY", name: "Wyoming", type: "none", notes: "No state income or capital gains tax." },
};
