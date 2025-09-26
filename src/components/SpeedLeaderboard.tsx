"use client";

import React from "react";
import type { SpeedRecord } from "@/services/leaderboard/SpeedLeaderboardService";

type Props = {
  records: SpeedRecord[];
  youName?: string | null;
  youScore?: number; // current run result
  youBestScore?: number; // personal best (from localStorage)
};

export default function SpeedLeaderboard({
  records,
  youName,
  youScore = 0,
  youBestScore = 0,
}: Props) {
  const youKey = (youName ?? "").trim().toLowerCase();

  // If "you" isn't in the list yet, virtually add current run so you see rank
  const merged = (() => {
    if (!youKey) return records.slice();
    const hasYou = records.some((r) => r.name.trim().toLowerCase() === youKey);
    if (hasYou) return records.slice();
    return [...records, { name: youName!, score: youScore, lastUpdateTs: 0 }];
  })();

  // Sort defensively (service already sorts)
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
    <section aria-labelledby="speed-lb-title">
      <h3 id="speed-lb-title">Speed Run — Leaderboard</h3>

      {/* Top 10 list */}
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

      {/* Your stats */}
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
              <div style={{ color: "#555" }}>Current run</div>
              <div style={{ fontWeight: 600 }}>{youScore}</div>
            </div>
            <div>
              <div style={{ color: "#555" }}>Personal best</div>
              <div style={{ fontWeight: 700 }}>{youBestScore}</div>
            </div>
            <div style={{ gridColumn: "1 / -1", color: "#666", fontSize: 12 }}>
              {rank
                ? `Your current rank: #${rank} ${youInTop10 ? "(Top 10)" : ""}`
                : "—"}
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
