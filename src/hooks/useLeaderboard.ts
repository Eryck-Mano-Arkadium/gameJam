"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LeaderboardService,
  LeaderboardRecord,
} from "@/services/leaderboard/LeaderboardService";
import { ClockServiceTier1 } from "@/services/clock/ClockServiceTier1";

const svc = new LeaderboardService();
const clock = new ClockServiceTier1();

export function useLeaderboard() {
  const [rid, setRid] = useState(() => clock.roundId());
  const [records, setRecords] = useState<LeaderboardRecord[]>(() =>
    svc.getAllForRound(rid)
  ); // seeds now

  useEffect(() => {
    // Listen for store changes
    const unsub = svc.subscribe((roundId) => {
      if (roundId === rid) {
        setRecords(svc.getAllForRound(roundId));
      }
    });

    // Poll the clock to detect round changes (client-only Tier 1)
    const id = setInterval(() => {
      const current = clock.roundId();
      if (current !== rid) {
        setRid(current);
        setRecords(svc.getAllForRound(current)); // seeds new round immediately
      }
    }, 500);

    return () => {
      unsub();
      clearInterval(id);
    };
  }, [rid]);

  const submit = useCallback((rec: LeaderboardRecord) => {
    svc.submit(rec); // will trigger subscribers
  }, []);

  // Expose the sorted list for any round, but keep current cached in `records`
  const recordsForRound = useCallback(
    (roundId: number) => svc.getAllForRound(roundId),
    []
  );

  return { submit, recordsForRound, currentRoundId: () => rid };
}
