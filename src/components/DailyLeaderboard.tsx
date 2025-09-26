"use client";

import React from "react";
import type { DailyRecord } from "@/services/leaderboard/DailyLeaderboardService";

type Props = {
  date: string; // YYYY-MM-DD
  records: DailyRecord[];
  youName?: string | null;
  youScore?: number; // today’s score
};

export default function DailyLeaderboard({
  date,
  records,
  youName,
  youScore = 0,
}: Props) {
  const youKey = (youName ?? "").trim().toLowerCase();

  const merged = (() => {
    if (!youKey) return records.slice();
    const present = records.some((r) => r.name.trim().toLowerCase() === youKey);
    if (present) return records.slice();
    // show your row even if not persisted yet
    return [
      ...records,
      { name: youName!, score: youScore, lastUpdateTs: 0, date },
    ];
  })();

  merged.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  const top10 = merged.slice(0, 10);
  const rank = youKey
    ? merged.findIndex((r) => r.name.trim().toLowerCase() === youKey) + 1 ||
      undefined
    : undefined;
  const youInTop10 = youKey
    ? top10.some((r) => r.name.trim().toLowerCase() === youKey)
    : false;

  return (
    <section aria-labelledby="daily-lb-title">
      <h3 id="daily-lb-title">Daily Leaderboard — {date}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3rem 1fr 7rem",
          gap: 8,
          maxWidth: 520,
        }}
      >
        <div style={{ fontWeight: 600 }}>#</div>
        <div style={{ fontWeight: 600 }}>Player</div>
        <div style={{ fontWeight: 600, textAlign: "right" }}>Score</div>

        {top10.length === 0 && (
          <>
            <div>—</div>
            <div>No scores yet</div>
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
              <div style={{ textAlign: "right" }}>{r.score}</div>
            </React.Fragment>
          );
        })}
      </div>

      {youName && (
        <div className="card" style={{ marginTop: 16 }}>
          <h4>Your stats</h4>
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
              <div style={{ color: "#555" }}>Today’s score</div>
              <div style={{ fontWeight: 700 }}>{youScore}</div>
            </div>
            <div>
              <div style={{ color: "#555" }}>Position</div>
              <div style={{ fontWeight: 700 }}>{rank ? `#${rank}` : "—"}</div>
            </div>
            <div style={{ gridColumn: "1 / -1", color: "#666", fontSize: 12 }}>
              {youInTop10
                ? "You are currently in the Top 10."
                : "You are outside the Top 10."}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
