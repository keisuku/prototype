import { EscalationLevel, ESCALATION_ORDER, ThresholdConfig } from '../types/escalation';
import thresholdsJson from '../config/thresholds.json';

const thresholds = thresholdsJson as unknown as ThresholdConfig;

const FIZZLE_MIN_INDEX = ESCALATION_ORDER.indexOf(
  thresholds.fizzle.dropFromMinLevel,
);

function getBaseLevel(sigma: number): EscalationLevel {
  if (sigma >= (thresholds.critical as { min: number }).min) return 'critical';
  if (sigma >= thresholds.awakening.min) return 'awakening';
  if (sigma >= thresholds.intense.min) return 'intense';
  if (sigma >= thresholds.clash.min) return 'clash';
  if (sigma >= thresholds.quickening.min) return 'quickening';
  if (sigma >= thresholds.sense.min) return 'sense';
  return 'calm';
}

/**
 * Resolves the current escalation state based on sigma and previous state.
 * Handles the "fizzle" condition: if we were at quickening or above and
 * sigma drops back to calm range, we enter fizzle instead.
 */
export function resolveState(
  currentSigma: number,
  previousState: EscalationLevel,
): EscalationLevel {
  const baseLevel = getBaseLevel(currentSigma);
  const baseLevelIndex = ESCALATION_ORDER.indexOf(baseLevel);
  const prevIndex =
    previousState === 'fizzle'
      ? -1
      : ESCALATION_ORDER.indexOf(previousState);

  // Check fizzle condition: was at quickening+ and dropped to calm
  if (
    prevIndex >= FIZZLE_MIN_INDEX &&
    currentSigma <= thresholds.fizzle.dropToMax
  ) {
    return 'fizzle';
  }

  // Recovery from fizzle: need to reach sense or above to exit
  if (previousState === 'fizzle' && baseLevelIndex < 1) {
    return 'fizzle';
  }

  return baseLevel;
}
