"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";
import { useSpeedLeaderboard } from "@/hooks/useSpeedLeaderboard";
import { PlayerService } from "@/services/player/PlayerService";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ps = new PlayerService();

export default function SpeedLeaderboardPage() {
  const { records } = useSpeedLeaderboard();
  const [getHigh] = useLocalStorage<number>("speedrun_highscore", 0);
  const [best, setBest] = useState(0);
  const [last, setLast] = useState<number | undefined>(undefined);

  useEffect(() => {
    setBest(getHigh());
    try {
      const raw = sessionStorage.getItem("speedrun:last");
      if (raw) setLast(Number(raw));
    } catch {}
  }, [getHigh]);

  const name = ps.getName();

  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <h1>Speed Run — Leaderboard</h1>

      <SpeedLeaderboard
        records={records}
        youName={name}
        youScore={last ?? best} // show latest run if available, else best
        youBestScore={best}
      />

      <div style={{ marginTop: 16 }}>
        <Link className="btn" href={"/speed" as Route}>
          Play
        </Link>
      </div>
    </main>
  );
}
