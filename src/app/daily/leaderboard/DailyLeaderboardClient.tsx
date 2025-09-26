"use client";

import { useEffect, useState } from "react";
import { PlayerService } from "@/services/player/PlayerService";
import { DailyService } from "@/services/daily/DailyService";
import { useDailyLeaderboard } from "@/hooks/useDailyLeaderboard";
import DailyLeaderboard from "@/components/DailyLeaderboard";

export default function DailyLeaderboardClient() {
  const { date, records } = useDailyLeaderboard();

  const [youName, setYouName] = useState("");
  const [todayScore, setTodayScore] = useState(0);

  useEffect(() => {
    const ps = new PlayerService();
    const ds = new DailyService();
    setYouName(ps.getName() ?? "");
    setTodayScore(ds.getTodayScore());
  }, []);

  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <h1>Daily Challenge — Leaderboard</h1>
      <DailyLeaderboard
        date={date}
        records={records}
        youName={youName}
        youScore={todayScore}
      />
      {/* No "Play today" button here — daily is one run per day */}
    </main>
  );
}
