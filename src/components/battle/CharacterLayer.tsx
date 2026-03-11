import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ConfigImage } from '../common/ConfigImage';
import { CharacterStateConfig } from '../../types/character';

const { width, height } = Dimensions.get('window');

interface CharacterLayerProps {
  stateConfig: CharacterStateConfig;
}

export function CharacterLayer({ stateConfig }: CharacterLayerProps) {
  return (
    <View style={styles.container}>
      <ConfigImage
        assetPath={stateConfig.character.image}
        style={styles.character}
        transition={800}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  character: {
    width: width * 0.7,
    height: height * 0.5,
    marginBottom: height * 0.05,
  },
});
