import { BaseClockService } from '@/services/clock/ClockService';
import { EPOCH_MS, PHASES, ROUND_MS } from '@/services/clock/types';

class TestClock extends BaseClockService {
  setNow(t: number) { (this as any).offsetMs = t - Date.now(); }
}

describe('ClockService', () => {
  it('computes roundId deterministically from epoch', () => {
    const c = new TestClock();
    c.setNow(EPOCH_MS);
    expect(c.roundId()).toBe(0);
    c.setNow(EPOCH_MS + ROUND_MS * 3 + 1);
    expect(c.roundId()).toBe(3);
  });

  it('returns phase info with correct durations', () => {
    const c = new TestClock();
    c.setNow(EPOCH_MS);
    const infoQ = c.phaseInfo();
    expect(infoQ.phase).toBe('QUESTION');
    c.setNow(EPOCH_MS + PHASES[0].duration + 1);
    const infoR = c.phaseInfo();
    expect(infoR.phase).toBe('REVEAL');
  });
});
// TODO
