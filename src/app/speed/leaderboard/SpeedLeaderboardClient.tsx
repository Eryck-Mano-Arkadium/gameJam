"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayerService } from "@/services/player/PlayerService";
import { useSpeedLeaderboard } from "@/hooks/useSpeedLeaderboard";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";

export default function SpeedLeaderboardClient() {
  const { records } = useSpeedLeaderboard();

  const [youName, setYouName] = useState("");
  const [run, setRun] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const ps = new PlayerService();
    setYouName(ps.getName() ?? "");
    setRun(Number(sessionStorage.getItem("speed:last") ?? "0"));
    setBest(Number(localStorage.getItem("speedrun_highscore") ?? "0"));
  }, []);

  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <h1>Speed Run — Leaderboard</h1>
      <SpeedLeaderboard
        records={records}
        youName={youName}
        youScore={run}
        youBestScore={best}
      />
      <p style={{ marginTop: 16 }}>
        <Link className="btn" href="/speed">
          Play
        </Link>
      </p>
    </main>
  );
}
