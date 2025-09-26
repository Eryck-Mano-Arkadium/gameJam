import {
  Question,
  QuestionService,
} from "@/services/questions/QuestionService";

const DAILY_KEY = "daily:date";
const DAILY_SET_KEY = "daily:set"; // stores { date: string, questions: Question[] }
const DAILY_SCORE_KEY = "daily:score";
const DAILY_PROGRESS_KEY = "daily:progress"; // stores { date, idx, score, qStartMs, seen }

function todayKey(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return h >>> 0;
}

export class DailyService {
  private qs = new QuestionService();

  getTodayKey(): string {
    return todayKey();
  }

  hasPlayedToday(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DAILY_KEY) === this.getTodayKey();
  }

  markPlayedToday(score: number) {
    if (typeof window === "undefined") return;
    localStorage.setItem(DAILY_KEY, this.getTodayKey());
    localStorage.setItem(DAILY_SCORE_KEY, String(score));
  }

  getTodayScore(): number {
    if (typeof window === "undefined") return 0;
    const s = localStorage.getItem(DAILY_SCORE_KEY);
    return s ? parseInt(s, 10) : 0;
  }

  getTodaySet(count = 10): Question[] {
    const dateKey = this.getTodayKey();
    const all = this.qs.all();
    // If we have a cached set for today, reuse it
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DAILY_SET_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.date === dateKey && Array.isArray(saved?.questions)) {
            return saved.questions as Question[];
          }
        }
      } catch {}
    }

    const seed = hashStringToSeed(dateKey);
    const rnd = mulberry32(seed);
    const indices = Array.from({ length: all.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const pick = (
      all.length <= count
        ? indices.map((i) => all[i])
        : indices.slice(0, count).map((i) => all[i])
    ) as Question[];

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          DAILY_SET_KEY,
          JSON.stringify({ date: dateKey, questions: pick })
        );
      } catch {}
    }
    return pick;
  }

  getProgress(): {
    date: string;
    idx: number;
    score: number;
    qStartMs: number;
    seen?: Record<number, number>;
  } | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(DAILY_PROGRESS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (!p || p.date !== this.getTodayKey()) return null;
      return {
        date: p.date,
        idx: typeof p.idx === "number" ? p.idx : 0,
        score: typeof p.score === "number" ? p.score : 0,
        qStartMs: typeof p.qStartMs === "number" ? p.qStartMs : Date.now(),
        seen: p.seen && typeof p.seen === "object" ? p.seen : undefined,
      };
    } catch {
      return null;
    }
  }

  saveProgress(
    idx: number,
    score: number,
    qStartMs: number,
    seen?: Record<number, number>
  ) {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        date: this.getTodayKey(),
        idx,
        score,
        qStartMs,
        seen,
      };
      localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(payload));
    } catch {}
  }

  clearProgress() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(DAILY_PROGRESS_KEY);
    } catch {}
  }
}
