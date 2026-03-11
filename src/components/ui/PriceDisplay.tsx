import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useMarketStore } from '../../stores/useMarketStore';

export function PriceDisplay() {
  const currentPrice = useMarketStore((s) => s.currentPrice);
  const change24h = useMarketStore((s) => s.priceChangePercent24h);
  const lastUpdated = useMarketStore((s) => s.lastUpdated);
  const error = useMarketStore((s) => s.error);

  const isPositive = change24h >= 0;
  const changeColor = isPositive ? '#00FF88' : '#FF4444';

  const formattedPrice = currentPrice > 0
    ? `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '---';

  const formattedChange = change24h !== 0
    ? `${isPositive ? '+' : ''}${change24h.toFixed(2)}%`
    : '';

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>BTC/USDT</Text>
      <Text style={styles.price}>{formattedPrice}</Text>
      {formattedChange !== '' && (
        <Text style={[styles.change, { color: changeColor }]}>
          {formattedChange}
        </Text>
      )}
      {error && <Text style={styles.error}>⚠ {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  symbol: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 10,
    marginTop: 4,
  },
});
