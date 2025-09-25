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
  const [rid, setRid] = useState(clock.roundId());
  const [records, setRecords] = useState<LeaderboardRecord[]>(
    svc.getAllForRound(rid)
  );

  useEffect(() => {
    const unsub = svc.subscribe((newRid) => {
      setRid(newRid);
      setRecords(svc.getAllForRound(newRid));
    });

    const id = setInterval(() => {
      const current = clock.roundId();
      setRid((prev) => {
        if (prev !== current) {
          setRecords(svc.getAllForRound(current));
          return current;
        }
        return prev;
      });
    }, 500);

    return () => {
      unsub();
      clearInterval(id);
    };
  }, []);

  const submit = useCallback((rec: LeaderboardRecord) => {
    svc.submit(rec);
    setRid(rec.roundId);
    setRecords(svc.getAllForRound(rec.roundId));
  }, []);

  const recordsForRound = useCallback(
    (roundId: number) => svc.getAllForRound(roundId),
    []
  );
  const currentRoundId = useCallback(() => rid, [rid]);

  return { submit, recordsForRound, currentRoundId };
}
