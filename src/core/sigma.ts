/**
 * Calculates rolling standard deviation of log-returns from close prices.
 * This single number drives the entire visual escalation system.
 */

export function computeLogReturns(closes: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0 && closes[i] > 0) {
      returns.push(Math.log(closes[i] / closes[i - 1]));
    }
  }
  return returns;
}

export function computeStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Compute normalized sigma: current window stddev divided by baseline average stddev.
 * Returns a ratio where 1.0 = normal volatility.
 *
 * @param closes - Array of close prices (most recent last)
 * @param window - Rolling window size for current sigma (default: 20)
 * @param baselineWindow - Longer window for baseline sigma (default: 480)
 */
export function computeNormalizedSigma(
  closes: number[],
  window: number = 20,
  baselineWindow: number = 480,
): number {
  if (closes.length < window + 1) return 0;

  const allReturns = computeLogReturns(closes);

  // Current window sigma
  const recentReturns = allReturns.slice(-window);
  const currentSigma = computeStdDev(recentReturns);

  // Baseline sigma (longer window, or all available data)
  const baselineReturns = allReturns.slice(
    -Math.min(baselineWindow, allReturns.length),
  );
  const baselineSigma = computeStdDev(baselineReturns);

  if (baselineSigma === 0) return 0;

  return currentSigma / baselineSigma;
}
