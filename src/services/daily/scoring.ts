export type ScoreConfig = { basePoints: number; minPoints: number };

export const DEFAULT_SCORE: ScoreConfig = { basePoints: 1000, minPoints: 100 };

// elapsedMs -> non-linear bucketed weight in 10s segments up to 60s
export function scoreForElapsed(
  elapsedMs: number,
  config: ScoreConfig = DEFAULT_SCORE,
  weights: number[] = [13, 11, 9, 7, 5, 3]
): number {
  const seg = Math.max(0, Math.min(5, Math.floor(elapsedMs / 10000)));
  const maxW = weights[0];
  const minW = weights[weights.length - 1];
  const ratio = (weights[seg] - minW) / (maxW - minW); // 0..1
  const { basePoints, minPoints } = config;
  return Math.max(
    minPoints,
    Math.round(minPoints + (basePoints - minPoints) * ratio)
  );
}


