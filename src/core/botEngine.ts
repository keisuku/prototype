import { Position, Trade, TradeSignal, PositionDirection } from '../types/bot';

const POSITION_SIZE_RATIO = 0.1; // Use 10% of balance per trade

/**
 * Simple MA crossover trend-following strategy for SARAH (15m timeframe).
 * Uses fast (5) and slow (20) simple moving averages.
 */
function sma(values: number[], period: number): number {
  if (values.length < period) return 0;
  const slice = values.slice(-period);
  return slice.reduce((s, v) => s + v, 0) / period;
}

export function evaluateSignal(
  closes: number[],
  activePosition: Position | null,
  fastPeriod: number = 5,
  slowPeriod: number = 20,
): TradeSignal | null {
  if (closes.length < slowPeriod + 1) return null;

  const currentPrice = closes[closes.length - 1];
  const now = Date.now();

  const fastMA = sma(closes, fastPeriod);
  const slowMA = sma(closes, slowPeriod);
  const prevFastMA = sma(closes.slice(0, -1), fastPeriod);
  const prevSlowMA = sma(closes.slice(0, -1), slowPeriod);

  const crossedUp = prevFastMA <= prevSlowMA && fastMA > slowMA;
  const crossedDown = prevFastMA >= prevSlowMA && fastMA < slowMA;

  if (activePosition) {
    // Close on opposite crossover
    if (activePosition.direction === 'long' && crossedDown) {
      return { action: 'close', price: currentPrice, timestamp: now };
    }
    if (activePosition.direction === 'short' && crossedUp) {
      return { action: 'close', price: currentPrice, timestamp: now };
    }
    return null;
  }

  // Open new position on crossover
  if (crossedUp) {
    return { action: 'open_long', price: currentPrice, timestamp: now };
  }
  if (crossedDown) {
    return { action: 'open_short', price: currentPrice, timestamp: now };
  }

  return null;
}

export function calculatePositionSize(
  balance: number,
  price: number,
): number {
  return (balance * POSITION_SIZE_RATIO) / price;
}

export function calculatePnl(
  position: Position,
  currentPrice: number,
): number {
  const priceDiff =
    position.direction === 'long'
      ? currentPrice - position.entryPrice
      : position.entryPrice - currentPrice;
  return priceDiff * position.size;
}

export function closeTrade(
  position: Position,
  exitPrice: number,
): Trade {
  return {
    id: `${position.entryTime}-${Date.now()}`,
    direction: position.direction,
    entryPrice: position.entryPrice,
    exitPrice,
    size: position.size,
    pnl: calculatePnl(position, exitPrice),
    entryTime: position.entryTime,
    exitTime: Date.now(),
  };
}
