import { LeaderboardRecord } from "@/services/leaderboard/LeaderboardService";

export function sortLeaderboard(arr: LeaderboardRecord[]): LeaderboardRecord[] {
  return [...arr].sort((a, b) => {
    if (b.streak !== a.streak) return b.streak - a.streak;
    if (a.lastUpdateTs !== b.lastUpdateTs)
      return a.lastUpdateTs - b.lastUpdateTs;
    return a.name.localeCompare(b.name);
  });
}
