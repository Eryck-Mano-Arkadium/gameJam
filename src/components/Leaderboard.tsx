"use client";

import React from "react";
import { LeaderboardRecord } from "@/services/leaderboard/LeaderboardService";

type Props = {
  roundId: number;
  records: LeaderboardRecord[]; // may be empty; assumed sorted or will be re-sorted here
  youName: string;
  youStreak: number;
  youBestStreak: number;
};

export default function Leaderboard({
  roundId,
  records,
  youName,
  youStreak,
  youBestStreak,
}: Props) {
  const youKey = youName?.trim().toLowerCase();

  // Merge "you" in case your submission didn't land yet (first frame of LEADERBOARD)
  const hasYou =
    youKey && records.some((r) => r.name.trim().toLowerCase() === youKey);
  const merged: LeaderboardRecord[] =
    hasYou || !youName
      ? records.slice()
      : [
          ...records,
          { name: youName, streak: youStreak, lastUpdateTs: 0, roundId },
        ];

  // Deterministic sort: streak desc, time asc, name asc
  merged.sort((a, b) => {
    if (a.streak !== b.streak) return b.streak - a.streak;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  // Compute rank (1-based) if you have a name
  const rank = youKey
    ? (() => {
        const idx = merged.findIndex(
          (r) => r.name.trim().toLowerCase() === youKey
        );
        return idx >= 0 ? idx + 1 : undefined;
      })()
    : undefined;

  const top10 = merged.slice(0, 10);
  const youInTop10 = youKey
    ? top10.some((r) => r.name.trim().toLowerCase() === youKey)
    : false;

  return (
    <section aria-labelledby="lb-title">
      <h3 id="lb-title">Leaderboard — Round #{roundId}</h3>

      {/* Top 10 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3rem 1fr 6rem",
          gap: 8,
          maxWidth: 520,
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
                style={isYou ? { fontWeight: 700 } : undefined}
              >
                {r.name}
                {isYou ? " (you)" : ""}
              </div>
              <div style={{ textAlign: "right" }}>{r.streak}</div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Your stats (always shown) */}
      <div className="card" style={{ marginTop: 16 }}>
        <h4>Your stats</h4>
        {youName ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              maxWidth: 520,
            }}
          >
            <div>
              <div style={{ color: "#555" }}>Name</div>
              <div style={{ fontWeight: 600 }}>{youName}</div>
            </div>
            <div>
              <div style={{ color: "#555" }}>Current streak</div>
              <div style={{ fontWeight: 600 }}>{youStreak}</div>
            </div>
            <div>
              <div style={{ color: "#555" }}>Position</div>
              <div style={{ fontWeight: 600 }}>{rank ? `#${rank}` : "—"}</div>
            </div>
            <div>
              <div style={{ color: "#555" }}>Personal best</div>
              <div style={{ fontWeight: 700 }}>{youBestStreak}</div>
            </div>
            <div style={{ gridColumn: "1 / -1", color: "#666", fontSize: 12 }}>
              {youInTop10
                ? "You are currently in the Top 10."
                : "You are outside the Top 10."}
            </div>
          </div>
        ) : (
          <p>
            <em>Set your name to appear on the leaderboard.</em>
          </p>
        )}
      </div>
    </section>
  );
}
