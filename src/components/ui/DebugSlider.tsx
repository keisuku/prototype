import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const TRACK_WIDTH = 280;
const THUMB_SIZE = 24;

interface DebugSliderProps {
  value: number;
  onValueChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function DebugSlider({
  value,
  onValueChange,
  min,
  max,
  step,
}: DebugSliderProps) {
  const ratio = (value - min) / (max - min);
  const position = useSharedValue(ratio * TRACK_WIDTH);

  const updateValue = (pos: number) => {
    const r = Math.max(0, Math.min(1, pos / TRACK_WIDTH));
    const raw = min + r * (max - min);
    const stepped = Math.round(raw / step) * step;
    onValueChange(Math.max(min, Math.min(max, stepped)));
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const newPos = Math.max(0, Math.min(TRACK_WIDTH, e.x));
      position.value = newPos;
      runOnJS(updateValue)(newPos);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value - THUMB_SIZE / 2 }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.labelText}>{min.toFixed(1)}</Text>
        <Text style={styles.valueText}>{value.toFixed(1)}</Text>
        <Text style={styles.labelText}>{max.toFixed(1)}</Text>
      </View>
      <GestureDetector gesture={pan}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelText: {
    color: '#FFFFFF40',
    fontSize: 10,
  },
  valueText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    width: TRACK_WIDTH,
    height: 6,
    backgroundColor: '#FFFFFF20',
    borderRadius: 3,
    alignSelf: 'center',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
