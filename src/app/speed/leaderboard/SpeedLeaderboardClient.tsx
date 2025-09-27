"use client";

import { useEffect, useState } from "react";
import { PlayerService } from "@/services/player/PlayerService";
import { useSpeedLeaderboard } from "@/hooks/useSpeedLeaderboard";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";
import * as S from "../speed.css";

export default function SpeedLeaderboardClient() {
  const { records } = useSpeedLeaderboard();

  const [youName, setYouName] = useState("");
  const [run, setRun] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const ps = new PlayerService();
    setYouName(ps.getName() ?? "");
    setRun(Number(sessionStorage.getItem("speedrun:last") ?? "0"));
    setBest(Number(localStorage.getItem("speedrun_highscore") ?? "0"));
  }, []);

  return (
    <main className={S.screen}>
      <SpeedLeaderboard
        records={records}
        youName={youName}
        youScore={run}
        youBestScore={best}
      />
    </main>
  );
}
