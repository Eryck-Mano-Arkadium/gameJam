"use client";

import React from "react";
import { LeaderboardRecord } from "@/services/leaderboard/LeaderboardService";
import * as S from "./leaderboard.css";

type Props = {
  roundId: number;
  records: LeaderboardRecord[];
  youName: string;
  youStreak: number;
  youBestStreak: number; // kept for future use; not displayed in this compact mock
};

type RowProps = {
  rank: number;
  name: string;
  streak: number;
  isYou: boolean;
};

function avatarFor(rank: number, isYou: boolean) {
  if (isYou) return "/assets/me-avatar.png";
  if (rank === 1) return "/assets/1stPlace.png";
  if (rank === 2) return "/assets/2ndPlace.png";
  if (rank === 3) return "/assets/3rdPlace.png";
  return "/assets/normal-avatar.png";
}

function LBRow({ rank, name, streak, isYou }: RowProps) {
  const rowClass = isYou ? `${S.row} ${S.rowUser}` : S.row;
  const label = isYou ? `${name} (Me)` : name;
  const avatar = avatarFor(rank, isYou);

  return (
    <div className={rowClass} role="row">
      <div className={S.rankCell}>{rank}</div>
      <img
        className={S.avatar}
        src={avatar}
        alt={isYou ? "Your avatar" : `${name} avatar`}
      />
      <div className={S.name} aria-current={isYou ? "true" : undefined}>
        {label}
      </div>
      <div className={S.score}>{streak}</div>
    </div>
  );
}

export default function Leaderboard({
  roundId,
  records,
  youName,
  youStreak,
  youBestStreak,
}: Props) {
  const youKey = youName?.trim().toLowerCase();

  // Merge "you" in case your submission hasn't landed yet
  const hasYou =
    !!youKey && records.some((r) => r.name.trim().toLowerCase() === youKey);
  const merged: LeaderboardRecord[] =
    hasYou || !youName
      ? records.slice()
      : [
          ...records,
          { name: youName, streak: youStreak, lastUpdateTs: 0, roundId },
        ];

  // Sort (streak desc, time asc, name asc)
  merged.sort((a, b) => {
    if (a.streak !== b.streak) return b.streak - a.streak;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });

  const youIndex = youKey
    ? merged.findIndex((r) => r.name.trim().toLowerCase() === youKey)
    : -1;
  const youRank = youIndex >= 0 ? youIndex + 1 : undefined;
  const youInTop5 = !!youRank && youRank <= 5;

  const top5 = merged.slice(0, 5);

  return (
    <section className={S.wrapper} aria-labelledby="lb-title">
      <h3 id="lb-title" className={S.title}>
        Leaderboard
      </h3>

      <div className={S.list} role="table" aria-label="Top players">
        {top5.length === 0 && <div className={S.empty}>No entries yet</div>}

        {top5.map((r, i) => {
          const isYou = !!youKey && r.name.trim().toLowerCase() === youKey;
          return (
            <LBRow
              key={`${r.name}-${i}`}
              rank={i + 1}
              name={r.name}
              streak={r.streak}
              isYou={isYou}
            />
          );
        })}

        {/* If you are NOT in the Top 5, append your row at the bottom */}
        {youName && !youInTop5 && youRank && (
          <LBRow
            rank={youRank}
            name={youName}
            streak={youStreak}
            isYou={true}
          />
        )}
      </div>
    </section>
  );
}
