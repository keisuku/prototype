import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useMarketStore } from '../../stores/useMarketStore';

const GAUGE_WIDTH = 200;
const MAX_SIGMA = 4.0;

const THRESHOLD_MARKS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

export function SigmaGauge() {
  const sigma = useMarketStore((s) => s.sigma);
  const escalationState = useMarketStore((s) => s.escalationState);

  const fillRatio = Math.min(sigma / MAX_SIGMA, 1.0);

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(fillRatio * GAUGE_WIDTH, { duration: 500 }),
  }));

  const gaugeColor = getGaugeColor(sigma);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>σ</Text>
        <Text style={styles.value}>{sigma.toFixed(2)}</Text>
        <Text style={styles.state}>{escalationState.toUpperCase()}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, fillStyle, { backgroundColor: gaugeColor }]}
        />
        {THRESHOLD_MARKS.map((t) => (
          <View
            key={t}
            style={[
              styles.mark,
              { left: (t / MAX_SIGMA) * GAUGE_WIDTH },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function getGaugeColor(sigma: number): string {
  if (sigma >= 3.0) return '#FFFFFF';
  if (sigma >= 2.5) return '#FFD700';
  if (sigma >= 2.0) return '#FF0000';
  if (sigma >= 1.5) return '#FF4500';
  if (sigma >= 1.0) return '#FF6347';
  if (sigma >= 0.5) return '#FFD700';
  return '#4A90D9';
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    color: '#FFFFFF80',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  state: {
    color: '#FFFFFF60',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  track: {
    width: GAUGE_WIDTH,
    height: 6,
    backgroundColor: '#FFFFFF20',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  mark: {
    position: 'absolute',
    top: 0,
    width: 1,
    height: '100%',
    backgroundColor: '#FFFFFF40',
  },
});
