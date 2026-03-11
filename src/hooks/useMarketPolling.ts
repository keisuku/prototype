import { useEffect, useRef } from 'react';
import { useMarketStore } from '../stores/useMarketStore';
import { useBotStore } from '../stores/useBotStore';
import { extractCloses } from '../services/binance';
import defaults from '../config/defaults.json';

export function useMarketPolling() {
  const fetchMarketData = useMarketStore((s) => s.fetchMarketData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchMarketData();

    // Poll at configured interval
    intervalRef.current = setInterval(() => {
      fetchMarketData();

      // After market data updates, run bot evaluation
      const { klines, currentPrice } = useMarketStore.getState();
      if (klines.length > 0 && currentPrice > 0) {
        const closes = extractCloses(klines);
        useBotStore.getState().updateBot(closes, currentPrice);
      }
    }, defaults.pollingIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMarketData]);
}
