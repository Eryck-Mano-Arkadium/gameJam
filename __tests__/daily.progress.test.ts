import { DailyService } from '@/services/daily/DailyService';

// Polyfill window/localStorage for node test env
const memoryStore: Record<string, string> = {};
beforeAll(() => {
  (global as any).window = {};
  (global as any).localStorage = {
    getItem: (k: string) => (k in memoryStore ? memoryStore[k] : null),
    setItem: (k: string, v: string) => {
      memoryStore[k] = v;
    },
    removeItem: (k: string) => {
      delete memoryStore[k];
    },
    clear: () => {
      for (const k of Object.keys(memoryStore)) delete memoryStore[k];
    },
  };
});

afterEach(() => {
  (global as any).localStorage.clear();
});

describe('daily progress', () => {
  it('saves and loads progress for today', () => {
    const svc = new DailyService();
    const key = svc.getTodayKey();
    svc.saveProgress(3, 250, 123456, { 3: 111000 });
    const p = svc.getProgress();
    expect(p?.date).toBe(key);
    expect(p?.idx).toBe(3);
    expect(p?.score).toBe(250);
    expect(p?.qStartMs).toBe(123456);
    expect(p?.seen?.[3]).toBe(111000);
    svc.clearProgress();
    expect(svc.getProgress()).toBeNull();
  });
});


