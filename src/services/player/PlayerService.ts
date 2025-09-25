const NAME_KEY = "streaktrivia:name";
const STREAK_KEY = "streaktrivia:streak";
const STREAK_TS_KEY = "streaktrivia:streakTs"; // map<streak, timestamp>

export class PlayerService {
  getName(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(NAME_KEY);
  }
  setName(name: string) {
    localStorage.setItem(NAME_KEY, name);
  }
  getStreak(): number {
    if (typeof window === "undefined") return 0;
    const s = localStorage.getItem(STREAK_KEY);
    return s ? parseInt(s, 10) : 0;
  }
  setStreak(v: number) {
    localStorage.setItem(STREAK_KEY, String(v));
  }
  getStreakTimestamps(): Record<number, number> {
    if (typeof window === "undefined") return {};
    const s = localStorage.getItem(STREAK_TS_KEY);
    return s ? JSON.parse(s) : {};
  }
  setStreakTimestamps(map: Record<number, number>) {
    localStorage.setItem(STREAK_TS_KEY, JSON.stringify(map));
  }
}
