import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ConfigLottie } from '../common/ConfigLottie';
import { CharacterStateConfig } from '../../types/character';

interface EffectsLayerProps {
  stateConfig: CharacterStateConfig;
  zIndex: number;
}

export function EffectsLayer({ stateConfig, zIndex }: EffectsLayerProps) {
  if (stateConfig.effects.length === 0) return null;

  return (
    <View style={[styles.container, { zIndex }]}>
      {stateConfig.effects.map((effect, index) => (
        <ConfigLottie
          key={`${effect.source}-${index}`}
          assetPath={effect.source}
          style={styles.effect}
          autoPlay
          loop
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  effect: {
    ...StyleSheet.absoluteFillObject,
  },
});
