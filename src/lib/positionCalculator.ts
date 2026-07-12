// Position size calculator (Position Size Calculator Addendum).
//
// This mirrors the authoritative backend engine (cot_engine.position_plan),
// which is the single source of truth and fully unit-tested against the
// spec's POS vectors. It runs client-side so the tool is interactive before
// the backend is hosted; once wired it will POST to /api/calculator/position-plan.
// Rates are the same fixed stub the backend ships until a live feed is added.

export type AccountCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'AUD' | 'CAD' | 'NZD';

export type InstrumentCategory =
  | 'major_usd_quote'
  | 'major_usd_base'
  | 'jpy_pair'
  | 'cross'
  | 'metal'
  | 'index';

export const ACCOUNT_CURRENCIES: AccountCurrency[] = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CHF',
  'AUD',
  'CAD',
  'NZD',
];

// Fixed USD-major snapshot — matches the backend StubExchangeRateProvider.
const RATES: Record<string, number> = {
  EURUSD: 1.085,
  GBPUSD: 1.27,
  AUDUSD: 0.66,
  NZDUSD: 0.6,
  USDJPY: 150.0,
  USDCHF: 0.9,
  USDCAD: 1.36,
};

const METALS: Record<string, { pipSize: number; contract: number }> = {
  XAUUSD: { pipSize: 0.01, contract: 100 },
  XAGUSD: { pipSize: 0.001, contract: 5000 },
  XPTUSD: { pipSize: 0.01, contract: 50 },
  XPDUSD: { pipSize: 0.01, contract: 100 },
};

const INDEX_QUOTE: Record<string, string> = {
  SPX500: 'USD',
  NAS100: 'USD',
  US30: 'USD',
  UK100: 'GBP',
  GER40: 'EUR',
  JPN225: 'JPY',
};

export interface InstrumentOption {
  symbol: string;
  label: string;
  group: string;
}

// The curated instrument list shown in the dropdown (grouped by category).
export const INSTRUMENTS: InstrumentOption[] = [
  { symbol: 'EUR/USD', label: 'EUR/USD', group: 'Majors' },
  { symbol: 'GBP/USD', label: 'GBP/USD', group: 'Majors' },
  { symbol: 'AUD/USD', label: 'AUD/USD', group: 'Majors' },
  { symbol: 'NZD/USD', label: 'NZD/USD', group: 'Majors' },
  { symbol: 'USD/CHF', label: 'USD/CHF', group: 'Majors' },
  { symbol: 'USD/CAD', label: 'USD/CAD', group: 'Majors' },
  { symbol: 'USD/JPY', label: 'USD/JPY', group: 'JPY pairs' },
  { symbol: 'EUR/JPY', label: 'EUR/JPY', group: 'JPY pairs' },
  { symbol: 'GBP/JPY', label: 'GBP/JPY', group: 'JPY pairs' },
  { symbol: 'EUR/GBP', label: 'EUR/GBP', group: 'Crosses' },
  { symbol: 'EUR/AUD', label: 'EUR/AUD', group: 'Crosses' },
  { symbol: 'GBP/CHF', label: 'GBP/CHF', group: 'Crosses' },
  { symbol: 'XAU/USD', label: 'Gold (XAU/USD)', group: 'Metals' },
  { symbol: 'XAG/USD', label: 'Silver (XAG/USD)', group: 'Metals' },
  { symbol: 'SPX500', label: 'S&P 500', group: 'Indices' },
  { symbol: 'NAS100', label: 'Nasdaq 100', group: 'Indices' },
];

interface Instrument {
  symbol: string;
  category: InstrumentCategory;
  base: string;
  quote: string;
  pipSize: number;
  lotSize: number;
}

function normalise(symbol: string): string {
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function classifyInstrument(symbol: string): Instrument {
  const code = normalise(symbol);
  if (code in METALS) {
    return { symbol: code, category: 'metal', base: code.slice(0, 3), quote: 'USD', pipSize: METALS[code].pipSize, lotSize: 1 };
  }
  if (code in INDEX_QUOTE) {
    return { symbol: code, category: 'index', base: code, quote: INDEX_QUOTE[code], pipSize: 1, lotSize: 1 };
  }
  const base = code.slice(0, 3);
  const quote = code.slice(3, 6);
  if (base === 'JPY' || quote === 'JPY') {
    return { symbol: code, category: 'jpy_pair', base, quote, pipSize: 0.01, lotSize: 100000 };
  }
  let category: InstrumentCategory = 'cross';
  if (quote === 'USD') category = 'major_usd_quote';
  else if (base === 'USD') category = 'major_usd_base';
  return { symbol: code, category, base, quote, pipSize: 0.0001, lotSize: 100000 };
}

function usdPerUnit(currency: string): number {
  if (currency === 'USD') return 1;
  const direct: Record<string, string> = { EUR: 'EURUSD', GBP: 'GBPUSD', AUD: 'AUDUSD', NZD: 'NZDUSD' };
  const inverse: Record<string, string> = { JPY: 'USDJPY', CHF: 'USDCHF', CAD: 'USDCAD' };
  if (currency in direct) return RATES[direct[currency]];
  if (currency in inverse) return 1 / RATES[inverse[currency]];
  return 1;
}

function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  return (amount * usdPerUnit(from)) / usdPerUnit(to);
}

export function pipValuePerLot(
  instrument: Instrument,
  accountCurrency: string,
  metalContract?: number,
  indexPipValue?: number,
): number {
  let pipValueQuote: number;
  if (instrument.category === 'metal') {
    pipValueQuote = instrument.pipSize * (metalContract ?? METALS[instrument.symbol].contract);
  } else if (instrument.category === 'index') {
    pipValueQuote = indexPipValue ?? 1;
  } else {
    pipValueQuote = instrument.pipSize * instrument.lotSize;
  }
  return convert(pipValueQuote, instrument.quote, accountCurrency);
}

export function confluenceMultiplier(score: number | null): number {
  if (score === null) return 1;
  if (score >= 8.0) return 1.25;
  if (score >= 6.0) return 1.0;
  if (score >= 5.0) return 0.75;
  if (score >= 4.0) return 0.5;
  return 0;
}

const PHASE_MULTIPLIER: Record<number, number> = { 6: 1.0, 5: 1.0, 3: 1.0, 2: 0.7, 4: 0.6, 1: 0.5 };

export function phaseMultiplier(phase: number | null): number {
  if (phase === null) return 1;
  return PHASE_MULTIPLIER[phase] ?? 0.3;
}

export type SafetyLevel = 'warning' | 'block';

export interface SafetyFinding {
  level: SafetyLevel;
  code: string;
  message: string;
}

export interface PositionPlanInput {
  accountBalance: number;
  accountCurrency: AccountCurrency;
  riskPercentage: number; // fraction, e.g. 0.01
  instrumentSymbol: string;
  entryPrice: number;
  stopPrice: number;
  target1Price: number | null;
  target2Price: number | null;
  confluenceScore: number | null;
  phase: number | null;
  metalContract?: number;
  indexPipValue?: number;
}

export interface PositionPlanResult {
  blocked: boolean;
  findings: SafetyFinding[];
  finalRiskPercentage: number;
  riskAmount: number;
  stopPips: number;
  pipValuePerLot: number;
  lotSize: number | null;
  positionUnits: number | null;
  riskRewardTarget1: number | null;
  riskRewardTarget2: number | null;
  potentialProfitTarget1: number | null;
  potentialProfitTarget2: number | null;
}

function collectFindings(input: PositionPlanInput, stopPips: number): SafetyFinding[] {
  const findings: SafetyFinding[] = [];
  if (input.entryPrice === input.stopPrice || stopPips <= 0) {
    findings.push({ level: 'block', code: 'invalid_stop', message: 'Stop distance is zero. Enter a stop different from entry.' });
  }
  if (input.riskPercentage > 0.05) {
    findings.push({ level: 'block', code: 'risk_above_5pct', message: 'Risk above 5% is not permitted. This protects your account from catastrophic loss.' });
  } else if (input.riskPercentage > 0.02) {
    findings.push({ level: 'warning', code: 'risk_above_2pct', message: 'Risking more than 2% per trade significantly increases drawdown risk.' });
  }
  if (input.confluenceScore !== null && input.confluenceScore < 4.0) {
    findings.push({ level: 'block', code: 'confluence_below_threshold', message: 'Setup does not meet the minimum 4.0 confluence threshold. Wait for a better setup.' });
  }
  if (stopPips > 0 && stopPips < 10) {
    findings.push({ level: 'warning', code: 'stop_too_tight', message: 'Very tight stop. Normal price variance may trigger it — verify your analysis.' });
  } else if (stopPips > 200) {
    findings.push({ level: 'warning', code: 'stop_too_wide', message: 'Very wide stop. Position size will be small — verify this is intentional.' });
  }
  return findings;
}

function roundDown(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.floor(value * factor) / factor;
}

function reward(entry: number, stop: number, target: number | null, riskAmount: number): [number | null, number | null] {
  if (target === null) return [null, null];
  const stopDistance = Math.abs(entry - stop);
  if (stopDistance === 0) return [null, null];
  const ratio = Math.round((Math.abs(target - entry) / stopDistance) * 10) / 10;
  return [ratio, roundDown(riskAmount * ratio, 2)];
}

export function calculatePositionPlan(input: PositionPlanInput): PositionPlanResult {
  const instrument = classifyInstrument(input.instrumentSymbol);
  const stopPips = Math.round((Math.abs(input.entryPrice - input.stopPrice) / instrument.pipSize) * 10) / 10;
  const finalRisk = input.riskPercentage * confluenceMultiplier(input.confluenceScore) * phaseMultiplier(input.phase);
  const pipValue = pipValuePerLot(instrument, input.accountCurrency, input.metalContract, input.indexPipValue);
  const riskAmount = roundDown(input.accountBalance * finalRisk, 2);

  const findings = collectFindings(input, stopPips);
  const blocked = findings.some((f) => f.level === 'block');

  const base: PositionPlanResult = {
    blocked,
    findings,
    finalRiskPercentage: finalRisk,
    riskAmount,
    stopPips,
    pipValuePerLot: pipValue,
    lotSize: null,
    positionUnits: null,
    riskRewardTarget1: null,
    riskRewardTarget2: null,
    potentialProfitTarget1: null,
    potentialProfitTarget2: null,
  };
  if (blocked || stopPips <= 0 || pipValue <= 0) return base;

  const lotSize = roundDown(riskAmount / (stopPips * pipValue), 2);
  const units =
    instrument.category === 'metal'
      ? lotSize * (input.metalContract ?? METALS[instrument.symbol].contract)
      : instrument.category === 'index'
        ? lotSize
        : lotSize * instrument.lotSize;
  const [rr1, profit1] = reward(input.entryPrice, input.stopPrice, input.target1Price, riskAmount);
  const [rr2, profit2] = reward(input.entryPrice, input.stopPrice, input.target2Price, riskAmount);

  return {
    ...base,
    lotSize,
    positionUnits: units,
    riskRewardTarget1: rr1,
    riskRewardTarget2: rr2,
    potentialProfitTarget1: profit1,
    potentialProfitTarget2: profit2,
  };
}
