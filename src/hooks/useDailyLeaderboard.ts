"use client";

import { useEffect, useState, useCallback } from "react";
import {
  dailyLB,
  type DailyRecord,
  todayKey,
} from "@/services/leaderboard/DailyLeaderboardService";

export function useDailyLeaderboard(date: string = todayKey()) {
  const [records, setRecords] = useState<DailyRecord[]>(() =>
    dailyLB.getAllForDate(date)
  );

  useEffect(() => {
    setRecords(dailyLB.getAllForDate(date));
    const unsub = dailyLB.subscribe(date, () => {
      setRecords(dailyLB.getAllForDate(date));
    });
    return () => {
      unsub();
    };
  }, [date]);

  const submit = useCallback(
    (name: string, score: number) => {
      if (!name) return;
      dailyLB.submit({ name, score, date });
    },
    [date]
  );

  return { records, submit, date };
}
