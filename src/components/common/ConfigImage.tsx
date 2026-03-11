import React from 'react';
import { Image } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';
import { resolveAsset } from '../../assets/registry';

interface ConfigImageProps {
  assetPath: string;
  style?: StyleProp<ImageStyle>;
  transition?: number;
  contentFit?: 'cover' | 'contain' | 'fill';
}

export function ConfigImage({
  assetPath,
  style,
  transition = 800,
  contentFit = 'cover',
}: ConfigImageProps) {
  const source = resolveAsset(assetPath);
  if (!source) return null;

  return (
    <Image
      source={source}
      style={style}
      transition={transition}
      contentFit={contentFit}
    />
  );
}
