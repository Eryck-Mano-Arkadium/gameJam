"use client";

import React from "react";
import { LeaderboardRecord } from "@/services/leaderboard/LeaderboardService";

type Props = {
  roundId: number;
  youName: string;
  youStreak: number;
  records: LeaderboardRecord[]; // already sorted by service; may be empty
};

export default function Leaderboard({
  roundId,
  youName,
  youStreak,
  records,
}: Props) {
  const youKey = youName?.trim().toLowerCase();

  // If your record isn't in the incoming list yet, virtually add it so you show up.
  const hasYou =
    youKey && records.some((r) => r.name.trim().toLowerCase() === youKey);
  const merged =
    hasYou || !youName
      ? records.slice()
      : [
          ...records,
          {
            name: youName,
            streak: youStreak,
            lastUpdateTs: 0, // treat as earliest so ties still look sane locally
            roundId,
          },
        ];

  // Sort again defensively (in case caller passed unsorted)
  merged.sort((a, b) => {
    if (a.streak !== b.streak) return b.streak - a.streak;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  const top10 = merged.slice(0, 10);
  const youInTop10 = top10.some((r) => r.name.trim().toLowerCase() === youKey);

  const youRow: LeaderboardRecord | null = youName
    ? {
        name: youName,
        streak: youStreak,
        lastUpdateTs: 0,
        roundId,
      }
    : null;

  return (
    <section aria-labelledby="lb-title">
      <h3 id="lb-title">Leaderboard — Round #{roundId}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3rem 1fr 6rem",
          gap: 8,
          maxWidth: 420,
        }}
      >
        <div style={{ fontWeight: 600 }}>#</div>
        <div style={{ fontWeight: 600 }}>Player</div>
        <div style={{ fontWeight: 600, textAlign: "right" }}>Streak</div>

        {top10.length === 0 && (
          <>
            <div>—</div>
            <div>No entries yet</div>
            <div style={{ textAlign: "right" }}>—</div>
          </>
        )}

        {top10.map((r, i) => {
          const isYou = youKey && r.name.trim().toLowerCase() === youKey;
          return (
            <React.Fragment key={`${r.name}-${i}`}>
              <div>{i + 1}</div>
              <div
                aria-current={isYou ? "true" : undefined}
                style={isYou ? { fontWeight: 600 } : undefined}
              >
                {r.name}
              </div>
              <div style={{ textAlign: "right" }}>{r.streak}</div>
            </React.Fragment>
          );
        })}

        {/* Always show "you" when not in Top 10 */}
        {!youInTop10 && youRow && (
          <>
            <div aria-label="Your position">•</div>
            <div style={{ fontWeight: 600 }}>{youRow.name} (you)</div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>
              {youRow.streak}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
