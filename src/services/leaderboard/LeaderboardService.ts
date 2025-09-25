export type LeaderboardRecord = {
  name: string;
  streak: number;
  lastUpdateTs: number; // lower = earlier
  roundId: number;
};

type Listener = (roundId: number) => void;

export class LeaderboardService {
  private store = new Map<number, Map<string, LeaderboardRecord>>();
  private listeners = new Set<Listener>();

  // Insert/update a record for the given round
  submit(rec: LeaderboardRecord) {
    const byName = this.ensureRound(rec.roundId);

    const current = byName.get(rec.name);
    if (!current) {
      byName.set(rec.name, { ...rec });
    } else {
      // Only replace if strictly better streak, or equal streak with earlier timestamp.
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

  // Sorted records for a round (all of them; caller can slice Top 10)
  getAllForRound(roundId: number): LeaderboardRecord[] {
    const byName = this.store.get(roundId);
    if (!byName) return [];
    const list = Array.from(byName.values());
    list.sort(this.compare);
    return list;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // helpers
  private ensureRound(roundId: number) {
    let m = this.store.get(roundId);
    if (!m) {
      m = new Map<string, LeaderboardRecord>();
      this.store.set(roundId, m);
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
