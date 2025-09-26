import { scoreForElapsed, DEFAULT_SCORE } from '@/services/daily/scoring';

describe('daily scoring', () => {
  it('monotonically decreases with elapsed time buckets', () => {
    const s0 = scoreForElapsed(0, DEFAULT_SCORE);       // 0s
    const s5 = scoreForElapsed(5000, DEFAULT_SCORE);    // <10s
    const s15 = scoreForElapsed(15000, DEFAULT_SCORE);  // 10-20s
    const s25 = scoreForElapsed(25000, DEFAULT_SCORE);  // 20-30s
    const s35 = scoreForElapsed(35000, DEFAULT_SCORE);  // 30-40s
    const s55 = scoreForElapsed(55000, DEFAULT_SCORE);  // 50-60s
    const s65 = scoreForElapsed(65000, DEFAULT_SCORE);  // >=60s

    expect(s0).toBeGreaterThanOrEqual(s5);
    expect(s5).toBeGreaterThanOrEqual(s15);
    expect(s15).toBeGreaterThanOrEqual(s25);
    expect(s25).toBeGreaterThanOrEqual(s35);
    expect(s35).toBeGreaterThanOrEqual(s55);
    expect(s55).toBeGreaterThanOrEqual(s65);
  });

  it('respects min and base bounds', () => {
    const cfg = { basePoints: 1000, minPoints: 100 };
    expect(scoreForElapsed(0, cfg)).toBeLessThanOrEqual(cfg.basePoints);
    expect(scoreForElapsed(120000, cfg)).toBeGreaterThanOrEqual(cfg.minPoints);
  });
});


