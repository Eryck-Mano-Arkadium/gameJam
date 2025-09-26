export type ScoreConfig = {
  /** Hidden per-question time limit */
  limitMs: number; // default 30_000

  /** Bucket thresholds (in seconds, inclusive lower bound) */
  highFromSec: number; // 25
  midFromSec: number; // 15
  lowFromSec: number; // 1

  /** Weights (points per 1 second of remaining time) */
  weightHigh: number; // 40
  weightMid: number; // 30
  weightLow: number; // 20

  /** Floors for edge cases */
  underOneSecondPoints: number; // 10 when 0 < remaining < 1s
  overtimePoints: number; // 10 when elapsed > limit
};

export const DEFAULT_SCORE: ScoreConfig = {
  limitMs: 30_000,
  highFromSec: 25,
  midFromSec: 15,
  lowFromSec: 1,
  weightHigh: 40,
  weightMid: 30,
  weightLow: 20,
  underOneSecondPoints: 10,
  overtimePoints: 10,
};

/**
 * Compute score from elapsed time since the question was first shown.
 * We convert to *remaining* time and apply a bucketed weight:
 *   - 30–25s → ×40
 *   - 25–15s → ×30
 *   - 15–1s  → ×20
 *   - <1s    → 10 pts
 *   - overtime (>30s) → 10 pts
 */
export function scoreForElapsed(
  elapsedMs: number,
  cfg: ScoreConfig = DEFAULT_SCORE
): number {
  const remainingMs = cfg.limitMs - elapsedMs;

  // Overtime → base points
  if (remainingMs <= 0) return cfg.overtimePoints;

  const remainingSec = remainingMs / 1000;

  if (remainingSec >= cfg.highFromSec) {
    return Math.round(remainingSec * cfg.weightHigh);
  }
  if (remainingSec >= cfg.midFromSec) {
    return Math.round(remainingSec * cfg.weightMid);
  }
  if (remainingSec >= cfg.lowFromSec) {
    return Math.round(remainingSec * cfg.weightLow);
  }

  // < 1s left
  return cfg.underOneSecondPoints;
}
