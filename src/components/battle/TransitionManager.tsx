import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { EscalationLevel } from '../../types/escalation';

interface TransitionManagerProps {
  escalationState: EscalationLevel;
  previousState: EscalationLevel;
  children: React.ReactNode;
}

export function TransitionManager({
  escalationState,
  previousState,
  children,
}: TransitionManagerProps) {
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    if (escalationState === previousState) return;

    if (escalationState === 'fizzle') {
      // Comedy drop: brief gray flash
      flashOpacity.value = withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 600 }),
      );
    } else if (
      escalationState === 'critical' ||
      escalationState === 'awakening'
    ) {
      // Dramatic: white flash
      flashOpacity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(0, { duration: 400 }),
      );
    } else {
      // Standard crossfade: subtle flash
      flashOpacity.value = withSequence(
        withTiming(0.3, { duration: 150 }),
        withTiming(0, { duration: 350 }),
      );
    }
  }, [escalationState]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
    backgroundColor:
      escalationState === 'fizzle' ? '#808080' : '#FFFFFF',
  }));

  return (
    <>
      {children}
      <Animated.View
        style={[styles.flash, flashStyle]}
        pointerEvents="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
