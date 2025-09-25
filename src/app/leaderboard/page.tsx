'use client';

import { useLeaderboard } from '@/hooks/useLeaderboard';
import Leaderboard from '@/components/Leaderboard';
import { useEffect, useState } from 'react';
import { PlayerService } from '@/services/player/PlayerService';

const ps = new PlayerService();

export default function LeaderboardPage() {
  const { currentRoundId, recordsForRound } = useLeaderboard();
  const [name, setName] = useState(ps.getName() ?? '');
  const [streak, setStreak] = useState(ps.getStreak());

  useEffect(() => {
    setName(ps.getName() ?? '');
    setStreak(ps.getStreak());
  }, []);

  return (
    <section className="container">
      <h1>Leaderboard (current round)</h1>
      <Leaderboard
        roundId={currentRoundId()}
        records={recordsForRound(currentRoundId())}
        youName={name}
        youStreak={streak}
      />
    </section>
  );
}