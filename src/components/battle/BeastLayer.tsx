import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ConfigImage } from '../common/ConfigImage';
import { CharacterStateConfig, BeastSize } from '../../types/character';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BEAST_SIZES: Record<BeastSize, { width: number; height: number }> = {
  chibi: { width: 80, height: 80 },
  medium: { width: 160, height: 160 },
  large: { width: 280, height: 280 },
  fullscreen: { width: screenWidth, height: screenHeight * 0.6 },
};

interface BeastLayerProps {
  stateConfig: CharacterStateConfig;
}

export function BeastLayer({ stateConfig }: BeastLayerProps) {
  const { beast } = stateConfig;
  const targetSize = BEAST_SIZES[beast.size];

  const animWidth = useSharedValue(targetSize.width);
  const animHeight = useSharedValue(targetSize.height);
  const animX = useSharedValue(beast.position.x * screenWidth);
  const animY = useSharedValue(beast.position.y * screenHeight);

  useEffect(() => {
    const timing = { duration: 800, easing: Easing.out(Easing.cubic) };
    animWidth.value = withTiming(targetSize.width, timing);
    animHeight.value = withTiming(targetSize.height, timing);
    animX.value = withTiming(
      beast.position.x * screenWidth - targetSize.width / 2,
      timing,
    );
    animY.value = withTiming(
      beast.position.y * screenHeight - targetSize.height / 2,
      timing,
    );
  }, [beast.size, beast.position.x, beast.position.y]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: animWidth.value,
    height: animHeight.value,
    left: animX.value,
    top: animY.value,
    position: 'absolute' as const,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ConfigImage
        assetPath={beast.image}
        style={StyleSheet.absoluteFillObject}
        transition={600}
        contentFit="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 3,
  },
});
