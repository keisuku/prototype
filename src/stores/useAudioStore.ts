import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EscalationLevel } from '../types/escalation';
import { CharacterStateConfig } from '../types/character';

interface AudioState {
  isMuted: boolean;
  currentAmbientPath: string | null;
  currentBgmPath: string | null;
  targetState: EscalationLevel;
  setMuted: (muted: boolean) => void;
  transitionTo: (state: EscalationLevel, config: CharacterStateConfig) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isMuted: false,
      currentAmbientPath: null,
      currentBgmPath: null,
      targetState: 'calm',

      setMuted: (muted) => set({ isMuted: muted }),

      transitionTo: (state, config) => {
        set({
          targetState: state,
          currentAmbientPath: config.sound.ambient,
          currentBgmPath: config.sound.bgm,
        });
      },
    }),
    {
      name: 'audio-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isMuted: state.isMuted }),
    },
  ),
);
