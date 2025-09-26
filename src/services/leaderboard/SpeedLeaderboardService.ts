import mock from "@/data/speed-leaderboard.mock.json";

export type SpeedRecord = {
  name: string;
  score: number;
  lastUpdateTs: number; // earlier wins ties
};

type Listener = () => void;

const LS_KEY = "speedlb:v1";

export class SpeedLeaderboardService {
  private map = new Map<string, SpeedRecord>();
  private listeners = new Set<Listener>();
  private seeded = false;

  constructor() {
    this.load();
  }

  // PUBLIC --------------------------------------------------------------------

  submit(rec: Omit<SpeedRecord, "lastUpdateTs"> & { lastUpdateTs?: number }) {
    const r: SpeedRecord = {
      ...rec,
      lastUpdateTs: rec.lastUpdateTs ?? Date.now(),
    };
    const current = this.map.get(r.name);

    if (
      !current ||
      r.score > current.score ||
      (r.score === current.score && r.lastUpdateTs < current.lastUpdateTs) ||
      (r.score === current.score &&
        r.lastUpdateTs === current.lastUpdateTs &&
        r.name.localeCompare(current.name) < 0)
    ) {
      this.map.set(r.name, r);
      this.save();
      this.emit();
    }
  }

  getAll(): SpeedRecord[] {
    this.ensureSeed();
    const list = Array.from(this.map.values());
    list.sort(this.compare);
    return list;
  }

  // ✅ Return a VOID cleanup (not the boolean from Set.delete)
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  // PRIVATE -------------------------------------------------------------------

  private compare(a: SpeedRecord, b: SpeedRecord) {
    if (a.score !== b.score) return b.score - a.score; // score desc
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs; // earlier first
    return a.name.localeCompare(b.name); // name asc
  }

  private emit() {
    for (const fn of this.listeners) fn();
  }

  private load() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const obj: Record<string, SpeedRecord> = JSON.parse(raw);
        this.map = new Map(Object.entries(obj));
        this.seeded = true;
      }
    } catch {}
  }

  private save() {
    if (typeof window === "undefined") return;
    const obj: Record<string, SpeedRecord> = {};
    for (const [k, v] of this.map.entries()) obj[k] = v;
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  }

  private ensureSeed() {
    if (this.seeded) return;
    const base = Date.parse("2025-01-01T00:00:00Z");
    (mock as Array<{ name: string; score: number }>).forEach((row, i) => {
      this.map.set(row.name, {
        name: row.name,
        score: row.score,
        lastUpdateTs: base + i * 1000,
      });
    });
    this.seeded = true;
    this.save();
  }
}

// Singleton instance (simple for client-only usage)
export const speedLB = new SpeedLeaderboardService();
