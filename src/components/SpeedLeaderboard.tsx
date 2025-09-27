"use client";

import React from "react";
import type { SpeedRecord } from "@/services/leaderboard/SpeedLeaderboardService";
import * as L from "@/components/leaderboard.css";

type Props = {
  records: SpeedRecord[];
  youName?: string | null;
  youScore?: number;      // current run
  youBestScore?: number;  // PB from localStorage
};

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

export default function SpeedLeaderboard({
  records,
  youName,
  youScore = 0,
  youBestScore = 0,
}: Props) {
  const youKey = (youName ?? "").trim().toLowerCase();

  // If you're not in the list yet, virtually add your current run
  const merged: SpeedRecord[] = (() => {
    if (!youKey) return records.slice();
    const hasYou = records.some(
      (r) => r.name.trim().toLowerCase() === youKey
    );
    if (hasYou) return records.slice();
    return [...records, { name: youName!, score: youScore, lastUpdateTs: 0 }];
  })();

  // Sort (desc score, then earlier time, then name)
  merged.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  // Compute your true rank if present
  const youIndex = youKey
    ? merged.findIndex((r) => r.name.trim().toLowerCase() === youKey)
    : -1;
  const youRank = youIndex >= 0 ? youIndex + 1 : undefined;

  // Top-10 display list using Infinity’s table visual
  const N = 6;
  const top = merged.slice(0, N);
  let display = top.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    score: r.score,
    isYou: youKey && r.name.trim().toLowerCase() === youKey,
  }));

  // If you're outside top-10, replace last row with your row (show your true rank)
  if (youRank && youRank > N && youName) {
    display[display.length - 1] = {
      rank: youRank,
      name: youName,
      score: youScore,
      isYou: true,
    };
  }

  return (
    <section className={L.wrapper} aria-labelledby="speed-lb-title">
      <h3 id="speed-lb-title" className={L.title}>
        Leaderboard
      </h3>

      <div className={L.subtitle}>
        Speed Run
      </div>

      <div className={L.list} role="table" aria-label="Top players">
        {display.length === 0 ? (
          <div className={L.empty}>No scores yet</div>
        ) : (
          display.map((r) => (
            <Row
              key={`${r.name}-${r.rank}`}
              rank={r.rank}
              name={r.name}
              score={r.score}
              isYou={r.isYou as boolean}
            />
          ))
        )}
      </div>
    </section>
  );
}