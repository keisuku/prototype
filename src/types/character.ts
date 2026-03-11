import { EscalationLevel } from './escalation';

export type BeastSize = 'chibi' | 'medium' | 'large' | 'fullscreen';

export interface CharacterStateConfig {
  character: {
    image: string;
    animation: string | null;
  };
  beast: {
    image: string;
    size: BeastSize;
    position: { x: number; y: number };
  };
  background: {
    image: string;
    tint: string | null;
  };
  effects: Array<{
    type: 'lottie';
    source: string;
    position: string;
  }>;
  sound: {
    ambient: string;
    bgm: string;
    sfx_enter: string | null;
  };
  ui: {
    accentColor: string;
    particleDensity: number;
  };
}

export interface CharacterTransitions {
  default_duration_ms: number;
  escalation_type: string;
  de_escalation_type: string;
  fizzle_type: string;
}

export interface CharacterManifest {
  id: string;
  name: string;
  title: string;
  beast: string;
  timeframe: string;
  symbol: string;
  strategy: string;
  states: Record<EscalationLevel, CharacterStateConfig>;
  transitions: CharacterTransitions;
}
