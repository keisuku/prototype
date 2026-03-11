import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useBotStore } from '../../stores/useBotStore';
import { useMarketStore } from '../../stores/useMarketStore';
import { calculatePnl } from '../../core/botEngine';
import defaults from '../../config/defaults.json';

interface BotStatusOverlayProps {
  accentColor: string;
}

export function BotStatusOverlay({ accentColor }: BotStatusOverlayProps) {
  const balance = useBotStore((s) => s.balance);
  const activePosition = useBotStore((s) => s.activePosition);
  const totalRealizedPnl = useBotStore((s) => s.totalRealizedPnl);
  const currentPrice = useMarketStore((s) => s.currentPrice);

  const unrealizedPnl = activePosition
    ? calculatePnl(activePosition, currentPrice)
    : 0;

  const totalPnl = totalRealizedPnl + unrealizedPnl;
  const pnlColor = totalPnl >= 0 ? '#00FF88' : '#FF4444';

  return (
    <View style={styles.container}>
      {/* Bot info card */}
      <View style={[styles.card, { borderColor: accentColor + '40' }]}>
        <View style={styles.row}>
          <Text style={styles.botName}>SARAH</Text>
          <Text style={styles.botTitle}>Flame Oracle</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.value}>
            ¥{balance.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>P&L</Text>
          <Text style={[styles.value, { color: pnlColor }]}>
            {totalPnl >= 0 ? '+' : ''}¥
            {totalPnl.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
          </Text>
        </View>

        {activePosition && (
          <View style={styles.row}>
            <Text style={styles.label}>Position</Text>
            <Text
              style={[
                styles.direction,
                {
                  color:
                    activePosition.direction === 'long' ? '#00FF88' : '#FF4444',
                },
              ]}
            >
              {activePosition.direction.toUpperCase()} @{' '}
              {activePosition.entryPrice.toFixed(2)}
            </Text>
          </View>
        )}

        {!activePosition && (
          <View style={styles.row}>
            <Text style={styles.label}>Position</Text>
            <Text style={styles.noPosition}>No position</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: '#00000080',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minWidth: 180,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  botName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botTitle: {
    color: '#FFFFFF60',
    fontSize: 10,
    fontWeight: '500',
  },
  label: {
    color: '#FFFFFF80',
    fontSize: 11,
    fontWeight: '500',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  direction: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  noPosition: {
    color: '#FFFFFF40',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
