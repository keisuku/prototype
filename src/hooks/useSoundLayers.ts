import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioPlayer } from 'expo-audio';
import { useAudioStore } from '../stores/useAudioStore';
import { resolveAsset } from '../assets/registry';

/**
 * Manages 3 audio layers: ambient, bgm, sfx.
 * Ambient and BGM loop and crossfade on state transitions.
 * SFX plays once on state entry.
 */
export function useSoundLayers() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const ambientPath = useAudioStore((s) => s.currentAmbientPath);
  const bgmPath = useAudioStore((s) => s.currentBgmPath);

  // For MVP, we use a simple approach: just track what should be playing.
  // Full crossfade implementation requires managing multiple player instances.
  // This hook provides the interface; actual audio playback is a Phase 5 enhancement.

  return {
    isMuted,
    ambientPath,
    bgmPath,
  };
}
