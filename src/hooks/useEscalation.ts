import { useEffect, useRef } from 'react';
import { useMarketStore } from '../stores/useMarketStore';
import { useAudioStore } from '../stores/useAudioStore';
import { EscalationLevel } from '../types/escalation';
import { CharacterManifest } from '../types/character';
import sarahConfig from '../config/characters/sarah.json';

const character = sarahConfig as unknown as CharacterManifest;

/**
 * Derives visual/audio state from current escalation level.
 * Returns the current state config for rendering.
 */
export function useEscalation() {
  const escalationState = useMarketStore((s) => s.escalationState);
  const previousState = useMarketStore((s) => s.previousEscalationState);
  const transitionTo = useAudioStore((s) => s.transitionTo);
  const prevStateRef = useRef<EscalationLevel>(escalationState);

  const stateConfig = character.states[escalationState];

  useEffect(() => {
    if (prevStateRef.current !== escalationState) {
      transitionTo(escalationState, stateConfig);
      prevStateRef.current = escalationState;
    }
  }, [escalationState, stateConfig, transitionTo]);

  return {
    escalationState,
    previousState,
    stateConfig,
    character,
    isEscalating:
      previousState !== 'fizzle' &&
      escalationState !== 'fizzle' &&
      escalationState !== previousState,
  };
}
