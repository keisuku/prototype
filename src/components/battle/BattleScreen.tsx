import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BackgroundLayer } from './BackgroundLayer';
import { CharacterLayer } from './CharacterLayer';
import { BeastLayer } from './BeastLayer';
import { EffectsLayer } from './EffectsLayer';
import { TransitionManager } from './TransitionManager';
import { BotStatusOverlay } from '../ui/BotStatusOverlay';
import { SigmaGauge } from '../ui/SigmaGauge';
import { PriceDisplay } from '../ui/PriceDisplay';
import { useEscalation } from '../../hooks/useEscalation';
import { useMarketPolling } from '../../hooks/useMarketPolling';

export function BattleScreen() {
  useMarketPolling();
  const { escalationState, previousState, stateConfig } = useEscalation();

  return (
    <View style={styles.container}>
      <TransitionManager
        escalationState={escalationState}
        previousState={previousState}
      >
        {/* Z-index 0: Background */}
        <BackgroundLayer stateConfig={stateConfig} />

        {/* Z-index 1: Effects behind character */}
        <EffectsLayer stateConfig={stateConfig} zIndex={1} />

        {/* Z-index 2: Character */}
        <CharacterLayer stateConfig={stateConfig} />

        {/* Z-index 3: Beast */}
        <BeastLayer stateConfig={stateConfig} />

        {/* Z-index 4: Effects in front */}
        <EffectsLayer stateConfig={stateConfig} zIndex={4} />

        {/* Z-index 5: UI Overlay */}
        <View style={styles.uiOverlay}>
          <PriceDisplay />
          <SigmaGauge />
          <BotStatusOverlay accentColor={stateConfig.ui.accentColor} />
        </View>
      </TransitionManager>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
});
