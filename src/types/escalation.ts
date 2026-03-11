export type EscalationLevel =
  | 'calm'
  | 'sense'
  | 'quickening'
  | 'clash'
  | 'intense'
  | 'awakening'
  | 'critical'
  | 'fizzle';

export const ESCALATION_ORDER: EscalationLevel[] = [
  'calm',
  'sense',
  'quickening',
  'clash',
  'intense',
  'awakening',
  'critical',
];

export interface ThresholdConfig {
  calm: { max: number };
  sense: { min: number; max: number };
  quickening: { min: number; max: number };
  clash: { min: number; max: number };
  intense: { min: number; max: number };
  awakening: { min: number; max: number };
  critical: { min: number };
  fizzle: { dropFromMinLevel: EscalationLevel; dropToMax: number };
}
