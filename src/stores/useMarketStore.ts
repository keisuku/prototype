import { create } from 'zustand';
import { Kline } from '../types/market';
import { EscalationLevel } from '../types/escalation';
import { fetchKlines, extractCloses } from '../services/binance';
import { computeNormalizedSigma } from '../core/sigma';
import { resolveState } from '../core/stateResolver';
import defaults from '../config/defaults.json';

interface MarketState {
  klines: Kline[];
  sigma: number;
  escalationState: EscalationLevel;
  previousEscalationState: EscalationLevel;
  currentPrice: number;
  priceChangePercent24h: number;
  lastUpdated: number;
  isLoading: boolean;
  error: string | null;
  // Debug override
  debugSigma: number | null;
  setDebugSigma: (sigma: number | null) => void;
  fetchMarketData: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  klines: [],
  sigma: 0,
  escalationState: 'calm',
  previousEscalationState: 'calm',
  currentPrice: 0,
  priceChangePercent24h: 0,
  lastUpdated: 0,
  isLoading: false,
  error: null,
  debugSigma: null,

  setDebugSigma: (sigma) => {
    if (sigma === null) {
      set({ debugSigma: null });
      // Re-evaluate from real data
      get().fetchMarketData();
      return;
    }
    const prev = get().escalationState;
    const newState = resolveState(sigma, prev);
    set({
      debugSigma: sigma,
      sigma,
      previousEscalationState: prev,
      escalationState: newState,
    });
  },

  fetchMarketData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const klines = await fetchKlines('BTCUSDT', '15m', 500);
      const closes = extractCloses(klines);
      const currentPrice = closes[closes.length - 1];

      // Calculate sigma (skip if debug override active)
      const debugSigma = get().debugSigma;
      const sigma =
        debugSigma !== null
          ? debugSigma
          : computeNormalizedSigma(
              closes,
              defaults.sigmaWindow,
              defaults.baselineSigmaWindow,
            );

      const prevState = get().escalationState;
      const newState = resolveState(sigma, prevState);

      // 24h change approximation (96 candles of 15m = 24h)
      const price24hAgo =
        closes.length >= 96 ? closes[closes.length - 96] : closes[0];
      const priceChangePercent24h =
        ((currentPrice - price24hAgo) / price24hAgo) * 100;

      set({
        klines,
        sigma,
        escalationState: newState,
        previousEscalationState: prevState,
        currentPrice,
        priceChangePercent24h,
        lastUpdated: Date.now(),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
}));
