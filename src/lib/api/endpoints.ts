// Server-side typed API calls against the live backend. Each wraps `apiFetch`
// (which attaches the Supabase bearer token) and returns a backend response
// shape. Used from server components.

import { apiFetch, apiFetchOrNull } from '@/lib/api';
import type {
  Alert,
  CentralBankStanceRecord,
  CommodityAnalysis,
  CommodityHistoryPoint,
  CurrencyStrengthMatrix,
  DivergenceAlert,
  FundamentalScore,
  FundamentalTrend,
  IndexReport,
  LiquidityPool,
  MarketDefinition,
  MultiAssetOverview,
  Paginated,
  PerformanceStats,
  RiskSentiment,
  RiskSentimentHistoryPoint,
  TradeJournalEntry,
  UserProfile,
  UserSetup,
  Watchlist,
  WatchlistDetail,
  WeeklyStory,
} from '@/lib/types';

// ----- User ---------------------------------------------------------------
export const getUserProfile = () => apiFetch<UserProfile>('/api/user/profile');

// ----- Watchlists ---------------------------------------------------------
export const getWatchlists = () => apiFetch<Watchlist[]>('/api/watchlists');
export const getWatchlist = (id: string) => apiFetch<WatchlistDetail>(`/api/watchlists/${id}`);

// ----- Setups -------------------------------------------------------------
export const getSetups = () => apiFetch<Paginated<UserSetup>>('/api/setup');
export const getSetup = (id: string) => apiFetch<UserSetup>(`/api/setup/${id}`);

// ----- Liquidity ----------------------------------------------------------
export const getLiquidityPools = () => apiFetch<Paginated<LiquidityPool>>('/api/liquidity');
export const getLiquidityPool = (id: string) =>
  apiFetch<LiquidityPool>(`/api/liquidity/${id}`);

// ----- Fundamentals -------------------------------------------------------
export const getCurrencyMatrix = () =>
  apiFetch<CurrencyStrengthMatrix>('/api/fundamental/matrix/currencies');
export const getFundamentalScore = (asset: string) =>
  apiFetchOrNull<FundamentalScore>(`/api/fundamental/score/${asset}`);
export const getFundamentalTrend = (asset: string) =>
  apiFetchOrNull<FundamentalTrend>(`/api/fundamental/trends/${asset}`);
export const getDivergences = () =>
  apiFetch<DivergenceAlert[]>('/api/fundamental/divergences');
export const getCentralBankStances = () =>
  apiFetch<CentralBankStanceRecord[]>('/api/fundamental/cb-stances');

// ----- Commodities & indices ---------------------------------------------
export const getCommodityMarkets = () =>
  apiFetch<MarketDefinition[]>('/api/commodity/markets');
export const getCommodityOverview = () =>
  apiFetch<MultiAssetOverview>('/api/commodity/overview');
export const getCommodityAnalysis = (market: string) =>
  apiFetchOrNull<CommodityAnalysis>(`/api/commodity/${market}`);
export const getCommodityHistory = (market: string, weeks: number) =>
  apiFetch<CommodityHistoryPoint[]>(`/api/commodity/${market}/history/${weeks}`);
export const getIndexReport = (market: string) =>
  apiFetchOrNull<IndexReport>(`/api/commodity/index/${market}`);
export const getRiskSentiment = () =>
  apiFetchOrNull<RiskSentiment>('/api/commodity/risk-sentiment');
export const getRiskSentimentHistory = (weeks: number) =>
  apiFetch<RiskSentimentHistoryPoint[]>(`/api/commodity/risk-sentiment/history/${weeks}`);

// ----- Journal ------------------------------------------------------------
export const getJournalEntries = () =>
  apiFetch<Paginated<TradeJournalEntry>>('/api/journal');
export const getJournalEntry = (id: string) =>
  apiFetch<TradeJournalEntry>(`/api/journal/${id}`);
export const getJournalStats = () => apiFetch<PerformanceStats>('/api/journal/stats');

// ----- Story --------------------------------------------------------------
export const getWeeklyStory = (pair: string, reportDate: string) =>
  apiFetchOrNull<WeeklyStory>(`/api/story/${pair}/${reportDate}`);

// ----- Alerts -------------------------------------------------------------
export const getAlerts = () => apiFetch<Paginated<Alert>>('/api/alerts');
