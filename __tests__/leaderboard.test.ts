import { LeaderboardService } from '@/services/leaderboard/LeaderboardService';

describe('LeaderboardService', () => {
  it('keeps best streak and sorts records', () => {
    const svc = new LeaderboardService();
    svc.submit({ name: 'A', streak: 3, lastUpdateTs: 10, roundId: 1 });
    svc.submit({ name: 'B', streak: 5, lastUpdateTs: 20, roundId: 1 });
    svc.submit({ name: 'A', streak: 4, lastUpdateTs: 15, roundId: 1 });

    const list = svc.getAllForRound(1);
    expect(list[0].name).toBe('B');
    expect(list[0].streak).toBe(5);
    expect(list.find((r) => r.name === 'A')?.streak).toBe(4);
  });
});
// TODO
