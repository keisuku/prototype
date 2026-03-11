import { Kline } from '../types/market';

const BASE_URL = 'https://fapi.binance.com/fapi/v1/klines';

/**
 * Fetches kline (candlestick) data from Binance Futures API.
 * No authentication required for public market data.
 */
export async function fetchKlines(
  symbol: string = 'BTCUSDT',
  interval: string = '15m',
  limit: number = 100,
): Promise<Kline[]> {
  const url = `${BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
  }

  const raw: any[][] = await response.json();
  return raw.map(parseKline);
}

function parseKline(raw: any[]): Kline {
  return {
    openTime: raw[0],
    open: parseFloat(raw[1]),
    high: parseFloat(raw[2]),
    low: parseFloat(raw[3]),
    close: parseFloat(raw[4]),
    volume: parseFloat(raw[5]),
    closeTime: raw[6],
  };
}

/**
 * Extracts close prices from kline array.
 */
export function extractCloses(klines: Kline[]): number[] {
  return klines.map((k) => k.close);
}
