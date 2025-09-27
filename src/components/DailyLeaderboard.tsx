"use client";

import React from "react";
import type { DailyRecord } from "@/services/leaderboard/DailyLeaderboardService";
// ✅ Reuse the Infinity leaderboard styles & assets
import * as L from "@/components/leaderboard.css";

type Props = {
  date: string; // YYYY-MM-DD
  records: DailyRecord[];
  youName?: string | null;
  youScore?: number; // today’s score (from DailyService)
};

// Choose how many rows to show (same as Infinity look)
const ROW_COUNT = 5;

function avatarFor(rank: number, isYou: boolean) {
  if (isYou) return "/assets/me-avatar.png";
  if (rank === 1) return "/assets/1stPlace.png";
  if (rank === 2) return "/assets/2ndPlace.png";
  if (rank === 3) return "/assets/3rdPlace.png";
  return "/assets/normal-avatar.png";
}

function Row({
  rank,
  name,
  score,
  isYou,
}: {
  rank: number;
  name: string;
  score: number;
  isYou: boolean;
}) {
  const rowClass = isYou ? `${L.row} ${L.rowUser}` : L.row;
  return (
    <div className={rowClass} role="row">
      <div className={L.rankCell}>{rank}</div>
      <img
        className={L.avatar}
        src={avatarFor(rank, isYou)}
        alt={isYou ? "Your avatar" : `${name} avatar`}
      />
      <div className={L.name} aria-current={isYou ? "true" : undefined}>
        {isYou ? `${name} (Me)` : name}
      </div>
      <div className={L.score}>{score}</div>
    </div>
  );
}

export default function DailyLeaderboard({
  date,
  records,
  youName,
  youScore = 0,
}: Props) {
  const youKey = (youName ?? "").trim().toLowerCase();

  // If you're not persisted yet, virtually add you so rank shows up.
  const merged: DailyRecord[] = (() => {
    if (!youKey) return records.slice();
    const present = records.some((r) => r.name.trim().toLowerCase() === youKey);
    if (present) return records.slice();
    return [
      ...records,
      { name: youName!, score: youScore, lastUpdateTs: 0, date },
    ];
  })();

  // Sort same as service: score desc, earlier ts wins ties, name asc
  merged.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  // Your true rank if present
  const youIndex = youKey
    ? merged.findIndex((r) => r.name.trim().toLowerCase() === youKey)
    : -1;
  const youRank = youIndex >= 0 ? youIndex + 1 : undefined;

  // Build the display list (Top N). If you're outside Top N, show your row as last.
  const top = merged.slice(0, ROW_COUNT);
  let display = top.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    score: r.score,
    isYou: youKey && r.name.trim().toLowerCase() === youKey,
  }));

  if (youRank && youRank > ROW_COUNT && youName) {
    display[display.length - 1] = {
      rank: youRank,
      name: youName,
      score: youScore,
      isYou: true,
    };
  }

  return (
    <section className={L.wrapper} aria-labelledby="daily-lb-title">
      <h3 id="speed-lb-title" className={L.title}>
        Leaderboard
      </h3>

      <div className={L.subtitle}>
        Daily
      </div>

      <div className={L.list} role="table" aria-label="Top players">
        {display.length === 0 ? (
          <div className={L.empty}>No scores yet</div>
        ) : (
          display.map((row) => (
            <Row
              key={`${row.name}-${row.rank}`}
              rank={row.rank}
              name={row.name}
              score={row.score}
              isYou={row.isYou as boolean}
            />
          ))
        )}
      </div>
    </section>
  );
}
