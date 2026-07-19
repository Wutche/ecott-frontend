export type CurrencyPair =
  | 'EURUSD'
  | 'GBPUSD'
  | 'USDJPY'
  | 'USDCAD'
  | 'AUDUSD'
  | 'NZDUSD'
  | 'USDCHF'
  | 'DXY';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'NZD' | 'CHF';

export type BiasDirection = 'bullish' | 'bearish' | 'neutral';
export type BiasStrength = 'strongly' | 'moderately' | 'tentatively';

export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

export type PhaseConfidence =
  | 'high_conviction'
  | 'confirmed'
  | 'developing'
  | 'transitional'
  | 'insufficient_data';

export type SetupModel =
  | 'fibonacci_retracement'
  | 'structure_break_and_retest'
  | 'divergence_fade';

export type SetupDirection = 'long' | 'short';

export type SetupStatus =
  | 'active'
  | 'closed_target_1_hit'
  | 'closed_target_2_hit'
  | 'closed_target_3_hit'
  | 'closed_stopped_out'
  | 'closed_manual'
  | 'expired'
  | 'invalidated';

export type SetupClassification =
  | 'no_setup'
  | 'active_setup'
  | 'high_conviction_setup'
  | 'max_conviction_setup';

export type LiquidityPoolKind =
  | 'buy_side_liquidity'
  | 'sell_side_liquidity'
  | 'fair_value_gap'
  | 'order_block'
  | 'breaker_block'
  | 'liquidity_void';

export type LiquidityPoolType =
  | 'monthly_high_low'
  | 'weekly_high_low'
  | 'daily_high_low'
  | 'swing_high_low'
  | 'equal_high_low'
  | 'round_number'
  | 'consolidation';

export type LiquidityTimeframe =
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'four_hour'
  | 'one_hour';

export type LiquidityTimeAtLevel =
  | 'single_candle'
  | 'few_candles'
  | 'multiple_hours'
  | 'consolidation_zone';

export type LiquidityPoolClassification =
  | 'primary_target'
  | 'significant_pool'
  | 'moderate_pool'
  | 'weak_pool';

export type LiquidityPoolStatus = 'active' | 'swept' | 'expired';

export type TradeOutcome = 'win' | 'loss' | 'break_even';

export type AlertType =
  | 'high_conviction_setup'
  | 'setup_invalidated'
  | 'target_hit'
  | 'stop_hit'
  | 'cot_phase_transition'
  | 'cot_bias_flip'
  | 'cross_report_rotation'
  | 'weekly_story_published';

export type AlertSeverity = 'info' | 'notable' | 'critical';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  next_cursor: string | null;
  has_more: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  account_balance_usd: string | null;
  default_risk_percentage: string | null;
  primary_trading_pair: CurrencyPair | null;
  preferred_pairs: CurrencyPair[];
  timezone: string;
  experience_level: ExperienceLevel | null;
  notification_preferences: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface ConfluenceFactor {
  name: string;
  points_awarded: string;
  passed: boolean;
}

export interface UserSetup {
  id: string;
  user_id: string;
  pair_code: CurrencyPair;
  model: SetupModel;
  direction: SetupDirection;
  swing_high: string;
  swing_low: string;
  entry_zone_low: string;
  entry_zone_high: string;
  stop_loss_price: string;
  target_1_price: string;
  target_2_price: string | null;
  target_3_price: string | null;
  confluence_score: string;
  confluence_classification: SetupClassification;
  confluence_factors: ConfluenceFactor[];
  cot_report_date: string;
  status: SetupStatus;
  notes: string | null;
  activated_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiquidityPool {
  id: string;
  user_id: string;
  pair_code: CurrencyPair;
  kind: LiquidityPoolKind;
  pool_type: LiquidityPoolType;
  timeframe: LiquidityTimeframe;
  price_level: string;
  zone_upper_price: string | null;
  zone_lower_price: string | null;
  obviousness_rating: number;
  is_untested: boolean;
  time_at_level: LiquidityTimeAtLevel;
  is_cot_direction_aligned: boolean;
  timeframe_visibility_count: number;
  validation_score: string;
  classification: LiquidityPoolClassification;
  status: LiquidityPoolStatus;
  notes: string | null;
  created_at: string;
}

export interface TradeJournalEntry {
  id: string;
  user_id: string;
  setup_id: string;
  close_price: string;
  r_multiple: string;
  pips_gained: string;
  outcome: TradeOutcome;
  closed_at: string;
  reflection_notes: string | null;
  lessons_learned: string | null;
  screenshots: string[];
  created_at: string;
  updated_at: string;
}

export interface PairPerformance {
  total_trades: number;
  wins: number;
  losses: number;
  break_evens: number;
  win_rate_percentage: string;
  average_r_multiple: string;
}

export interface PerformanceStats {
  total_trades: number;
  wins: number;
  losses: number;
  break_evens: number;
  win_rate_percentage: string;
  average_r_multiple: string;
  total_r_multiple: string;
  expectancy_r_multiple: string;
  largest_win_r_multiple: string;
  largest_loss_r_multiple: string;
  current_streak_length: number;
  current_streak_outcome: TradeOutcome | null;
  by_pair_code: Record<string, PairPerformance>;
  by_setup_model: Record<string, PairPerformance>;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface WatchlistItem {
  pair_code: CurrencyPair;
  sort_order: number;
  latest_report_date: string | null;
  bias_direction: BiasDirection | null;
  bias_strength: BiasStrength | null;
  bias_statement_text: string | null;
  phase: Phase | null;
  phase_confidence: PhaseConfidence | null;
  phase_confidence_percentage: string | null;
  leveraged_funds_cot_index_value: string | null;
  active_setup_count: number;
  active_liquidity_pool_count: number;
}

export interface WatchlistDetail extends Watchlist {
  items: WatchlistItem[];
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  body: string;
  payload_json: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export type FundamentalBias =
  | 'strongly_bullish'
  | 'bullish'
  | 'neutral'
  | 'bearish'
  | 'strongly_bearish';

export type FundamentalPhase =
  | 'tightening'
  | 'peak_bullish'
  | 'loosening'
  | 'trough_bearish'
  | 'transition';

export type FundamentalTrendDirection = 'improving' | 'stable' | 'deteriorating';

export type CentralBankStance = 'hawkish' | 'neutral' | 'dovish';

export type DivergenceType =
  | 'fundamental_vs_cot'
  | 'fundamental_vs_price'
  | 'cot_vs_price'
  | 'triple_divergence';

export type DivergenceSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ComponentScore {
  component: string;
  score: string;
  weight: string;
}

export interface FundamentalScore {
  asset_code: string;
  score_date: string;
  total_score: string;
  bias: FundamentalBias;
  phase: FundamentalPhase | null;
  component_scores: ComponentScore[];
}

export interface CurrencyRanking {
  rank: number;
  currency_code: Currency;
  score: string;
  bias: FundamentalBias;
}

export interface StrengthPairIdea {
  long_currency_code: Currency;
  short_currency_code: Currency;
  score_gap: string;
}

export interface CurrencyStrengthMatrix {
  rankings: CurrencyRanking[];
  best_pair_ideas: StrengthPairIdea[];
}

export interface FundamentalTrend {
  asset_code: string;
  current_score: string;
  change_4_week: string | null;
  change_12_week: string | null;
  change_26_week: string | null;
  consecutive_weeks: number;
  direction: FundamentalTrendDirection;
}

export interface DivergenceAlert {
  id: string;
  asset_code: string;
  pair_code: CurrencyPair | null;
  divergence_type: DivergenceType;
  severity: DivergenceSeverity;
  fundamental_bias: FundamentalBias;
  cot_bias: BiasDirection;
  magnitude: string;
  message: string;
  detected_date: string;
  resolved_date: string | null;
}

export interface CentralBankStanceRecord {
  central_bank_code: string;
  currency_code: Currency;
  stance: CentralBankStance;
  stance_score: string;
  decision: string | null;
  next_meeting: string | null;
  updated_at: string;
}

// --- Commodities & Indices (Phase 12) ---

export type AssetClass = 'currency' | 'commodity' | 'index';

export type CotReportType = 'tff' | 'disaggregated';

export type MarketCode =
  | 'GOLD'
  | 'CRUDE_OIL'
  | 'SILVER'
  | 'COPPER'
  | 'SP500'
  | 'NASDAQ100'
  | 'VIX';

export type CommodityPhase =
  | 'capitulation'
  | 'accumulation'
  | 'trend'
  | 'maturity'
  | 'distribution'
  | 'decline';

export type HedgeRatioSignal =
  | 'under_hedged_bullish'
  | 'normal_neutral'
  | 'heavily_hedged_bearish'
  | 'extreme_hedged_strong_bearish';

export type CommercialSpeculatorSignal =
  | 'aligned'
  | 'divergent_commercials_bullish'
  | 'divergent_commercials_bearish';

export type RiskRegime = 'risk_on' | 'neutral' | 'risk_off';

export interface MarketDefinition {
  market_code: MarketCode;
  market_name: string;
  asset_class: AssetClass;
  report_type: CotReportType;
  cftc_code: string;
  contract_size: string | null;
  primary_correlation_currency: string | null;
  correlation_strength: string | null;
}

export interface DisaggregatedCategory {
  category: string;
  long_contracts: number;
  short_contracts: number;
  net_contracts: number;
}

export interface CommodityCotReport {
  market_code: MarketCode;
  report_date: string;
  open_interest: number;
  open_interest_total_change: number;
  categories: DisaggregatedCategory[];
}

export interface HedgeRatio {
  hedge_ratio_percentage: string;
  signal: HedgeRatioSignal;
}

export interface CommercialSpeculator {
  commercial_net: number;
  speculator_net: number;
  is_divergent: boolean;
  signal: CommercialSpeculatorSignal;
}

export interface CommodityAnalysis {
  report: CommodityCotReport;
  hedge_ratio: HedgeRatio;
  commercial_speculator: CommercialSpeculator;
  phase: CommodityPhase | null;
  producer_net: number;
  managed_money_net: number;
}

export interface CommodityHistoryPoint {
  report_date: string;
  producer_net: number;
  managed_money_net: number;
  open_interest: number;
}

export interface IndexReport {
  market_code: MarketCode;
  report_date: string;
  leveraged_funds_net: number;
  asset_manager_net: number;
  dealer_net: number;
  open_interest: number;
  open_interest_total_change: number;
}

export interface RiskSentimentComponent {
  name: string;
  net_position: number;
  component_score: string;
  weight: string;
}

export interface RiskSentiment {
  score_date: string;
  score: string;
  regime: RiskRegime;
  components: RiskSentimentComponent[];
}

export interface RiskSentimentHistoryPoint {
  score_date: string;
  score: string;
  regime: RiskRegime;
}

export interface CommodityBiasSummary {
  market_code: MarketCode;
  market_name: string;
  phase: CommodityPhase | null;
  hedge_signal: HedgeRatioSignal;
  producer_net: number;
  managed_money_net: number;
}

export interface IndexBiasSummary {
  market_code: MarketCode;
  market_name: string;
  leveraged_funds_net: number;
}

export interface MultiAssetOverview {
  risk_sentiment: RiskSentiment | null;
  commodities: CommodityBiasSummary[];
  indices: IndexBiasSummary[];
}

export interface WeeklyStory {
  pair_code: CurrencyPair;
  report_date: string;
  chapter_1_institutional_narrative: string;
  chapter_2_price_structure: string | null;
  chapter_3_liquidity: string | null;
  chapter_4_timing: string | null;
  chapter_5_execution: string | null;
  is_auto_generated: boolean;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
}
