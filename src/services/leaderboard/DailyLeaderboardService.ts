import mock from "@/data/daily-leaderboard.mock.json";

export type DailyRecord = {
  name: string;
  score: number;
  lastUpdateTs: number; // earlier wins ties
  date: string; // YYYY-MM-DD
};

type Listener = (date: string) => void;

// LS is sharded per date key so each day is independent.
const LS_PREFIX = "dailylb:v1:";

// --- small date helpers (UTC) -----------------------------------------------
function todayKey(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
// ----------------------------------------------------------------------------

export class DailyLeaderboardService {
  /**
   * store = Map<date, Map<name, record>>
   */
  private store = new Map<string, Map<string, DailyRecord>>();
  /**
   * listeners = Map<date, Set<Listener>>
   */
  private listeners = new Map<string, Set<Listener>>();

  // PUBLIC --------------------------------------------------------------------

  submit(input: {
    name: string;
    score: number;
    date?: string;
    lastUpdateTs?: number;
  }) {
    if (!input.name) return;
    const date = input.date ?? todayKey();
    const rec: DailyRecord = {
      name: input.name,
      score: input.score,
      date,
      lastUpdateTs: input.lastUpdateTs ?? Date.now(),
    };
    const byName = this.ensureDate(date);
    const cur = byName.get(rec.name);

    if (
      !cur ||
      rec.score > cur.score ||
      (rec.score === cur.score && rec.lastUpdateTs < cur.lastUpdateTs) ||
      (rec.score === cur.score &&
        rec.lastUpdateTs === cur.lastUpdateTs &&
        rec.name.localeCompare(cur.name) < 0)
    ) {
      byName.set(rec.name, rec);
      this.save(date);
      this.emit(date);
    }
  }

  getAllForDate(date = todayKey()): DailyRecord[] {
    this.ensureSeed(date);
    const map = this.store.get(date);
    if (!map) return [];
    const list = Array.from(map.values());
    list.sort(this.compare);
    return list;
  }

  subscribe(date: string, fn: Listener): () => void {
    let set = this.listeners.get(date);
    if (!set) {
      set = new Set<Listener>();
      this.listeners.set(date, set);
    }
    set.add(fn);
    return () => {
      set!.delete(fn); // void cleanup
    };
  }

  // PRIVATE -------------------------------------------------------------------

  private compare(a: DailyRecord, b: DailyRecord) {
    if (a.score !== b.score) return b.score - a.score; // score desc
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs; // earlier first
    return a.name.localeCompare(b.name); // name asc
  }

  private ensureDate(date: string) {
    let m = this.store.get(date);
    if (!m) {
      m = new Map<string, DailyRecord>();
      // attempt to load existing
      this.load(date);
      if (!this.store.get(date)) this.store.set(date, m);
      m = this.store.get(date)!;
    }
    return m;
  }

  private emit(date: string) {
    const set = this.listeners.get(date);
    if (!set) return;
    for (const fn of set) fn(date);
  }

  private load(date: string) {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LS_PREFIX + date);
      if (raw) {
        const obj: Record<string, DailyRecord> = JSON.parse(raw);
        const map = new Map<string, DailyRecord>(Object.entries(obj));
        this.store.set(date, map);
      }
    } catch {}
  }

  private save(date: string) {
    if (typeof window === "undefined") return;
    const map = this.store.get(date);
    if (!map) return;
    const obj: Record<string, DailyRecord> = {};
    for (const [k, v] of map.entries()) obj[k] = v;
    localStorage.setItem(LS_PREFIX + date, JSON.stringify(obj));
  }

  private ensureSeed(date: string) {
    // if already loaded/seeded, bail
    if (this.store.has(date) && this.store.get(date)!.size > 0) return;

    // attempt to load persisted first
    this.load(date);
    if (this.store.has(date) && this.store.get(date)!.size > 0) return;

    // seed with mock
    const base = Date.parse(date + "T00:00:00Z");
    const map = new Map<string, DailyRecord>();
    (mock as Array<{ name: string; score: number }>).forEach((row, i) => {
      map.set(row.name, {
        name: row.name,
        score: row.score,
        date,
        lastUpdateTs: base + i * 1000,
      });
    });
    this.store.set(date, map);
    this.save(date);
  }
}

// Singleton
export const dailyLB = new DailyLeaderboardService();
export { todayKey };
