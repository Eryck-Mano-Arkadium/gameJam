import mock from "@/data/infinityLb.json";

export type LeaderboardRecord = {
  name: string;
  streak: number;
  lastUpdateTs: number; // lower = earlier
  roundId: number;
};

type Listener = (roundId: number) => void;

/**
 * In-memory leaderboard with per-round storage.
 * First time a roundId is requested, we SEED it from mock data,
 * with deterministic timestamps offset by roundId.
 */
export class LeaderboardService {
  private store = new Map<number, Map<string, LeaderboardRecord>>();
  private listeners = new Set<Listener>();

  private static BASE_TS = Date.parse("2025-01-01T00:00:00Z"); // deterministic
  private static SEED_SPACING_MS = 1000; // 1s between mock rows
  private static ROUND_OFFSET_MS = 60_000; // shift per round (deterministic)

  // Insert/update a record for the given round
  submit(rec: LeaderboardRecord) {
    const byName = this.ensureRound(rec.roundId); // seeds if needed

    const current = byName.get(rec.name);
    if (!current) {
      byName.set(rec.name, { ...rec });
    } else {
      // Only replace if strictly better streak, or equal streak with earlier timestamp, then name asc
      if (
        rec.streak > current.streak ||
        (rec.streak === current.streak &&
          rec.lastUpdateTs < current.lastUpdateTs) ||
        (rec.streak === current.streak &&
          rec.lastUpdateTs === current.lastUpdateTs &&
          rec.name.localeCompare(current.name) < 0)
      ) {
        byName.set(rec.name, { ...rec });
      }
    }

    this.emit(rec.roundId);
  }

  // Sorted records for a round (caller can slice Top 10)
  getAllForRound(roundId: number): LeaderboardRecord[] {
    const wasMissing = !this.store.has(roundId);
    const byName = this.ensureRound(roundId); // seeds if needed
    if (wasMissing) this.emit(roundId); // notify consumers first time

    const list = Array.from(byName.values());
    list.sort(this.compare);
    return list;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // --- helpers ---------------------------------------------------------------

  private ensureRound(roundId: number) {
    let m = this.store.get(roundId);
    if (!m) {
      m = new Map<string, LeaderboardRecord>();
      this.store.set(roundId, m);

      // Seed from mock – deterministic timestamps & roundId
      const offset = roundId * LeaderboardService.ROUND_OFFSET_MS;
      (mock as Array<{ name: string; streak: number }>).forEach((row, i) => {
        const rec: LeaderboardRecord = {
          name: row.name,
          streak: row.streak,
          lastUpdateTs:
            LeaderboardService.BASE_TS +
            i * LeaderboardService.SEED_SPACING_MS +
            offset,
          roundId,
        };
        m!.set(rec.name, rec);
      });
    }
    return m;
  }

  private emit(roundId: number) {
    for (const fn of this.listeners) fn(roundId);
  }

  private compare(a: LeaderboardRecord, b: LeaderboardRecord) {
    if (a.streak !== b.streak) return b.streak - a.streak; // streak desc
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs; // earlier first
    return a.name.localeCompare(b.name); // name asc
  }
}
