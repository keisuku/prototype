import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useBotStore } from '../src/stores/useBotStore';
import { Trade } from '../src/types/bot';

function TradeItem({ trade }: { trade: Trade }) {
  const isProfit = trade.pnl >= 0;
  const pnlColor = isProfit ? '#00FF88' : '#FF4444';
  const dirColor = trade.direction === 'long' ? '#00FF88' : '#FF4444';

  const entryDate = new Date(trade.entryTime);
  const exitDate = new Date(trade.exitTime);

  return (
    <View style={styles.tradeCard}>
      <View style={styles.tradeHeader}>
        <Text style={[styles.direction, { color: dirColor }]}>
          {trade.direction.toUpperCase()}
        </Text>
        <Text style={[styles.pnl, { color: pnlColor }]}>
          {isProfit ? '+' : ''}¥{trade.pnl.toFixed(0)}
        </Text>
      </View>
      <View style={styles.tradeDetails}>
        <Text style={styles.detail}>
          Entry: ${trade.entryPrice.toFixed(2)}
        </Text>
        <Text style={styles.detail}>
          Exit: ${trade.exitPrice.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.time}>
        {entryDate.toLocaleDateString()} {entryDate.toLocaleTimeString()} →{' '}
        {exitDate.toLocaleTimeString()}
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const tradeHistory = useBotStore((s) => s.tradeHistory);
  const totalPnl = useBotStore((s) => s.totalRealizedPnl);
  const totalColor = totalPnl >= 0 ? '#00FF88' : '#FF4444';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trade History</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total Realized P&L</Text>
        <Text style={[styles.summaryValue, { color: totalColor }]}>
          {totalPnl >= 0 ? '+' : ''}¥{totalPnl.toFixed(0)}
        </Text>
        <Text style={styles.summaryCount}>
          {tradeHistory.length} trades
        </Text>
      </View>

      <FlatList
        data={tradeHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TradeItem trade={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No trades yet. SARAH is analyzing the market...</Text>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>Back to Battle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  summary: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  summaryCount: {
    color: '#FFFFFF40',
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
  },
  tradeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  direction: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pnl: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detail: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  time: {
    color: '#FFFFFF40',
    fontSize: 10,
  },
  empty: {
    color: '#FFFFFF40',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF60',
    fontSize: 14,
  },
});
