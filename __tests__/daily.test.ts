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

describe('DailyService', () => {
  it('returns 10 deterministic questions for a given day', () => {
    const svc = new DailyService();
    const a = svc.getTodaySet(10);
    const b = svc.getTodaySet(10);
    expect(a.map(q => q.question)).toEqual(b.map(q => q.question));
    expect(a.length).toBe(10);
  });
});


