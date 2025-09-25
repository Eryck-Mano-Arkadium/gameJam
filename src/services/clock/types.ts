export type Phase = "QUESTION" | "REVEAL" | "LEADERBOARD";

export const EPOCH_MS = Date.parse("2025-01-01T00:00:00Z");
export const ROUND_MS = 60_000;
export const PHASES: readonly { name: Phase; duration: number }[] = [
  { name: "QUESTION", duration: 40_000 },
  { name: "REVEAL", duration: 10_000 },
  { name: "LEADERBOARD", duration: 10_000 },
] as const;

export type PhaseInfo = {
  nowMs: number;
  roundId: number;
  roundStartMs: number;
  phaseIndex: number;
  phase: Phase;
  phaseStartMs: number;
  phaseEndMs: number;
  remainingMs: number;
};

export interface ClockService {
  now(): number;
  roundId(nowMs?: number): number;
  phaseInfo(nowMs?: number): PhaseInfo;
  subscribe(cb: (i: PhaseInfo) => void): () => void;
}
