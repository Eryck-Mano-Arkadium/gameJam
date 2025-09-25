import { ClockService, EPOCH_MS, PHASES, PhaseInfo, ROUND_MS } from "./types";

export abstract class BaseClockService implements ClockService {
  protected offsetMs = 0;

  now(): number {
    return Date.now() + this.offsetMs;
  }

  roundId(nowMs?: number): number {
    const t = (nowMs ?? this.now()) - EPOCH_MS;
    const rid = Math.floor(t / ROUND_MS);
    return rid < 0 ? 0 : rid;
  }

  phaseInfo(nowMs?: number): PhaseInfo {
    const n = nowMs ?? this.now();
    const rid = this.roundId(n);
    const roundStartMs = EPOCH_MS + rid * ROUND_MS;
    const delta = n - roundStartMs;

    let acc = 0,
      phaseIndex = 0;
    for (let i = 0; i < PHASES.length; i++) {
      if (delta < acc + PHASES[i].duration) {
        phaseIndex = i;
        break;
      }
      acc += PHASES[i].duration;
    }

    const phase = PHASES[phaseIndex];
    const phaseStartMs = roundStartMs + acc;
    const phaseEndMs = phaseStartMs + phase.duration;

    return {
      nowMs: n,
      roundId: rid,
      roundStartMs,
      phaseIndex,
      phase: phase.name,
      phaseStartMs,
      phaseEndMs,
      remainingMs: Math.max(0, phaseEndMs - n),
    };
  }

  subscribe(cb: (i: PhaseInfo) => void): () => void {
    const id = setInterval(() => cb(this.phaseInfo()), 150);
    return () => clearInterval(id);
  }
}
