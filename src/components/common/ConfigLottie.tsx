import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleProp, ViewStyle } from 'react-native';
import { resolveAsset } from '../../assets/registry';

interface ConfigLottieProps {
  assetPath: string;
  style?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  loop?: boolean;
}

export function ConfigLottie({
  assetPath,
  style,
  autoPlay = true,
  loop = true,
}: ConfigLottieProps) {
  const source = resolveAsset(assetPath);
  if (!source) return null;

  return (
    <LottieView
      source={source}
      style={style}
      autoPlay={autoPlay}
      loop={loop}
    />
  );
}
