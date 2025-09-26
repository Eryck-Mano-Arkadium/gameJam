"use client";

import { useEffect, useState, useCallback } from "react";
import {
  speedLB,
  SpeedRecord,
} from "@/services/leaderboard/SpeedLeaderboardService";

export function useSpeedLeaderboard() {
  const [records, setRecords] = useState<SpeedRecord[]>(() => speedLB.getAll());

  useEffect(() => {
    const unsubscribe: () => void = speedLB.subscribe(() => {
      setRecords(speedLB.getAll());
    });
    // initial refresh (in case seeding happened during subscribe)
    setRecords(speedLB.getAll());
    return () => {
      unsubscribe(); // <- explicit void cleanup
    };
  }, []);

  const submit = useCallback((name: string, score: number) => {
    if (!name) return;
    speedLB.submit({ name, score });
  }, []);

  return { records, submit };
}
