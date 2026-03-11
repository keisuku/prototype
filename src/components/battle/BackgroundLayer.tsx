import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ConfigImage } from '../common/ConfigImage';
import { CharacterStateConfig } from '../../types/character';

interface BackgroundLayerProps {
  stateConfig: CharacterStateConfig;
}

export function BackgroundLayer({ stateConfig }: BackgroundLayerProps) {
  return (
    <View style={styles.container}>
      <ConfigImage
        assetPath={stateConfig.background.image}
        style={styles.background}
        transition={1000}
        contentFit="cover"
      />
      {stateConfig.background.tint && (
        <View
          style={[
            styles.tintOverlay,
            { backgroundColor: stateConfig.background.tint },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
