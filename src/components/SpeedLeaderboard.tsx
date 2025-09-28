"use client";
import React from "react";
import type { SpeedRecord } from "@/services/leaderboard/SpeedLeaderboardService";
import * as L from "@/components/leaderboard.css";

type Props = {
  records: SpeedRecord[];
  youName?: string | null;
  youScore?: number;
  youBestScore?: number;
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
}: Props) {
  const youKey = (youName ?? "").trim().toLowerCase();
  const N = 6;

  // 1) Always fold "you" into the dataset (even if service already has you).
  const withYou: SpeedRecord[] = React.useMemo(() => {
    const map = new Map<string, SpeedRecord>();
    for (const r of records) map.set(r.name.trim().toLowerCase(), r);
    if (youKey) {
      const prev = map.get(youKey);
      const merged: SpeedRecord = prev
        ? { ...prev, score: Math.max(prev.score, youScore) } // prefer current run score
        : { name: youName!, score: youScore, lastUpdateTs: 0 };
      map.set(youKey, merged);
    }
    return Array.from(map.values());
  }, [records, youKey, youName, youScore]);

  // 2) Sort
  withYou.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  // 3) Rank & display
  const youIndex = youKey
    ? withYou.findIndex((r) => r.name.trim().toLowerCase() === youKey)
    : -1;
  const youRank = youIndex >= 0 ? youIndex + 1 : undefined;

  const top = withYou.slice(0, N);
  let display = top.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    score: r.score,
    isYou: Boolean(youKey && r.name.trim().toLowerCase() === youKey),
  }));

  // If you're outside top-N, show you in the last row (keep list length = N)
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
      <div className={L.subtitle}>Speed Run</div>
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
              isYou={r.isYou}
            />
          ))
        )}
      </div>
    </section>
  );
}
