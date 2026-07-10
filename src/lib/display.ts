import type {
  AlertSeverity,
  AlertType,
  BiasDirection,
  BiasStrength,
  CentralBankStance,
  CurrencyPair,
  DivergenceSeverity,
  DivergenceType,
  FundamentalBias,
  FundamentalPhase,
  FundamentalTrendDirection,
  LiquidityPoolClassification,
  LiquidityPoolKind,
  LiquidityPoolType,
  LiquidityTimeAtLevel,
  LiquidityTimeframe,
  Phase,
  PhaseConfidence,
  SetupClassification,
  SetupModel,
  SetupStatus,
  TradeOutcome,
} from './types';

export const CURRENCY_PAIR_LABELS: Record<CurrencyPair, string> = {
  EURUSD: 'EUR/USD',
  GBPUSD: 'GBP/USD',
  USDJPY: 'USD/JPY',
  USDCAD: 'USD/CAD',
  AUDUSD: 'AUD/USD',
  NZDUSD: 'NZD/USD',
  USDCHF: 'USD/CHF',
  DXY: 'DXY',
};

export const ALL_CURRENCY_PAIRS: CurrencyPair[] = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'USDCAD',
  'AUDUSD',
  'NZDUSD',
  'USDCHF',
  'DXY',
];

export const BIAS_DIRECTION_LABELS: Record<BiasDirection, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
};

export const BIAS_STRENGTH_LABELS: Record<BiasStrength, string> = {
  strongly: 'Strongly',
  moderately: 'Moderately',
  tentatively: 'Tentatively',
};

export const PHASE_LABELS: Record<Phase, string> = {
  1: 'Capitulation',
  2: 'Accumulation',
  3: 'Trend',
  4: 'Maturity',
  5: 'Distribution',
  6: 'Decline',
};

export const PHASE_CONFIDENCE_LABELS: Record<PhaseConfidence, string> = {
  high_conviction: 'High Conviction',
  confirmed: 'Confirmed',
  developing: 'Developing',
  transitional: 'Transitional',
  insufficient_data: 'Insufficient Data',
};

export const SETUP_MODEL_LABELS: Record<SetupModel, string> = {
  fibonacci_retracement: 'Fibonacci Retracement',
  structure_break_and_retest: 'Structure Break + Retest',
  divergence_fade: 'Divergence Fade',
};

export const SETUP_STATUS_LABELS: Record<SetupStatus, string> = {
  active: 'Active',
  closed_target_1_hit: 'Target 1 hit',
  closed_target_2_hit: 'Target 2 hit',
  closed_target_3_hit: 'Target 3 hit',
  closed_stopped_out: 'Stopped out',
  closed_manual: 'Closed (manual)',
  expired: 'Expired',
  invalidated: 'Invalidated',
};

export const SETUP_CLASSIFICATION_LABELS: Record<SetupClassification, string> = {
  no_setup: 'No setup',
  active_setup: 'Active setup',
  high_conviction_setup: 'High conviction',
  max_conviction_setup: 'Max conviction',
};

export const LIQUIDITY_POOL_KIND_LABELS: Record<LiquidityPoolKind, string> = {
  buy_side_liquidity: 'Buy-side liquidity',
  sell_side_liquidity: 'Sell-side liquidity',
  fair_value_gap: 'Fair Value Gap',
  order_block: 'Order Block',
  breaker_block: 'Breaker Block',
  liquidity_void: 'Liquidity Void',
};

export const LIQUIDITY_POOL_TYPE_LABELS: Record<LiquidityPoolType, string> = {
  monthly_high_low: 'Monthly H/L',
  weekly_high_low: 'Weekly H/L',
  daily_high_low: 'Daily H/L',
  swing_high_low: 'Swing H/L',
  equal_high_low: 'Equal H/L',
  round_number: 'Round Number',
  consolidation: 'Consolidation',
};

export const LIQUIDITY_TIMEFRAME_LABELS: Record<LiquidityTimeframe, string> = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  daily: 'Daily',
  four_hour: '4H',
  one_hour: '1H',
};

export const LIQUIDITY_TIME_AT_LEVEL_LABELS: Record<LiquidityTimeAtLevel, string> = {
  single_candle: 'Single candle',
  few_candles: 'Few candles',
  multiple_hours: 'Multiple hours',
  consolidation_zone: 'Consolidation zone',
};

export const LIQUIDITY_POOL_CLASSIFICATION_LABELS: Record<LiquidityPoolClassification, string> = {
  primary_target: 'Primary target',
  significant_pool: 'Significant pool',
  moderate_pool: 'Moderate pool',
  weak_pool: 'Weak pool',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  high_conviction_setup: 'High-conviction setup',
  setup_invalidated: 'Setup invalidated',
  target_hit: 'Target hit',
  stop_hit: 'Stop hit',
  cot_phase_transition: 'COT phase shift',
  cot_bias_flip: 'COT bias flip',
  cross_report_rotation: 'Cross-report rotation',
  weekly_story_published: 'Weekly story published',
};

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  info: 'Info',
  notable: 'Notable',
  critical: 'Critical',
};

export const TRADE_OUTCOME_LABELS: Record<TradeOutcome, string> = {
  win: 'Win',
  loss: 'Loss',
  break_even: 'Break-even',
};

export const CONFLUENCE_FACTOR_LABELS: Record<string, string> = {
  cot_bias_aligned: 'COT bias aligned',
  price_at_fib_618: 'Price at Fib 61.8%',
  price_at_fib_500: 'Price at Fib 50%',
  divergence_present: 'Divergence present',
  kill_zone_session: 'Kill-zone session',
  four_hour_rejection: '4H rejection confirmed',
  structure_fib_double_confluence: 'Structure + Fib confluence',
  leveraged_funds_extreme_or_flip: 'LF extreme or flip',
  dealer_stop_hunt_wick: 'Dealer stop-hunt wick',
  fundamental_score_aligned: 'Fundamental score aligned',
  fundamental_momentum_aligned: 'Fundamental momentum aligned',
};

export const FUNDAMENTAL_BIAS_LABELS: Record<FundamentalBias, string> = {
  strongly_bullish: 'Strongly Bullish',
  bullish: 'Bullish',
  neutral: 'Neutral',
  bearish: 'Bearish',
  strongly_bearish: 'Strongly Bearish',
};

export const FUNDAMENTAL_PHASE_LABELS: Record<FundamentalPhase, string> = {
  tightening: 'Tightening',
  peak_bullish: 'Peak Bullish',
  loosening: 'Loosening',
  trough_bearish: 'Trough Bearish',
  transition: 'Transition',
};

export const FUNDAMENTAL_TREND_LABELS: Record<FundamentalTrendDirection, string> = {
  improving: 'Improving',
  stable: 'Stable',
  deteriorating: 'Deteriorating',
};

export const CENTRAL_BANK_STANCE_LABELS: Record<CentralBankStance, string> = {
  hawkish: 'Hawkish',
  neutral: 'Neutral',
  dovish: 'Dovish',
};

export const DIVERGENCE_TYPE_LABELS: Record<DivergenceType, string> = {
  fundamental_vs_cot: 'Fundamental vs COT',
  fundamental_vs_price: 'Fundamental vs Price',
  cot_vs_price: 'COT vs Price',
  triple_divergence: 'Triple divergence',
};

export const FUNDAMENTAL_COMPONENT_LABELS: Record<string, string> = {
  interest_rate: 'Interest rate',
  central_bank_stance: 'Central bank stance',
  economic_growth: 'Economic growth',
  inflation: 'Inflation',
  employment: 'Employment',
  trade_balance: 'Trade balance',
  political_stability: 'Political stability',
};


export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export const STATUS_TONE_TO_CSS_VAR: Record<StatusTone, string> = {
  success: 'var(--color-success)',
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  info: 'var(--color-accent-primary)',
  neutral: 'var(--color-text-muted)',
};

export function biasDirectionTone(direction: BiasDirection | null): StatusTone {
  if (direction === 'bullish') return 'success';
  if (direction === 'bearish') return 'danger';
  return 'neutral';
}

export function tradeOutcomeTone(outcome: TradeOutcome): StatusTone {
  if (outcome === 'win') return 'success';
  if (outcome === 'loss') return 'danger';
  return 'neutral';
}

export function setupClassificationTone(value: SetupClassification): StatusTone {
  if (value === 'max_conviction_setup') return 'success';
  if (value === 'high_conviction_setup') return 'success';
  if (value === 'active_setup') return 'info';
  return 'neutral';
}

export function fundamentalBiasTone(bias: FundamentalBias | null): StatusTone {
  if (bias === 'strongly_bullish' || bias === 'bullish') return 'success';
  if (bias === 'strongly_bearish' || bias === 'bearish') return 'danger';
  return 'neutral';
}

export function fundamentalTrendTone(direction: FundamentalTrendDirection): StatusTone {
  if (direction === 'improving') return 'success';
  if (direction === 'deteriorating') return 'danger';
  return 'neutral';
}

export function divergenceSeverityTone(severity: DivergenceSeverity): StatusTone {
  if (severity === 'critical') return 'danger';
  if (severity === 'high') return 'warning';
  if (severity === 'medium') return 'info';
  return 'neutral';
}

export function fundamentalScoreTone(score: number): StatusTone {
  if (score >= 60) return 'success';
  if (score < 40) return 'danger';
  return 'neutral';
}

export function liquidityPoolClassificationTone(
  value: LiquidityPoolClassification,
): StatusTone {
  if (value === 'primary_target') return 'success';
  if (value === 'significant_pool') return 'info';
  if (value === 'moderate_pool') return 'warning';
  return 'neutral';
}

export function alertSeverityTone(severity: AlertSeverity): StatusTone {
  if (severity === 'critical') return 'danger';
  if (severity === 'notable') return 'warning';
  return 'info';
}

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH_APPROXIMATE = 30;

export function formatDecimal(value: string | null | undefined, digits = 2): string {
  if (value === null || value === undefined || value === '') return '—';
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return value;
  return parsed.toFixed(digits);
}

export function formatPercentage(value: string | null | undefined, digits = 1): string {
  if (value === null || value === undefined || value === '') return '—';
  return `${formatDecimal(value, digits)}%`;
}

export function formatRMultiple(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return value;
  const sign = parsed > 0 ? '+' : '';
  return `${sign}${parsed.toFixed(2)}R`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return value;
  return dateValue.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return value;
  return dateValue.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return '';
  const eventTimestamp = new Date(value).getTime();
  const nowTimestamp = Date.now();
  const elapsedSeconds = Math.floor((nowTimestamp - eventTimestamp) / 1000);
  if (elapsedSeconds < SECONDS_PER_MINUTE) return 'just now';
  const elapsedMinutes = Math.floor(elapsedSeconds / SECONDS_PER_MINUTE);
  if (elapsedMinutes < MINUTES_PER_HOUR) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / MINUTES_PER_HOUR);
  if (elapsedHours < HOURS_PER_DAY) return `${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / HOURS_PER_DAY);
  if (elapsedDays < DAYS_PER_MONTH_APPROXIMATE) return `${elapsedDays}d ago`;
  return formatDate(value);
}
