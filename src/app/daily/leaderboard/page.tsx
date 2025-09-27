import dynamic from "next/dynamic";

export const metadata = { title: "Streak Trivia – Daily Leaderboard" };

const DailyLeaderboardClient = dynamic(
  () => import("./DailyLeaderboardClient"),
  {
    ssr: false,
    loading: () => (
      <main className="container">
        <h1>Daily Challenge — Leaderboard</h1>
        <p>Loading…</p>
      </main>
    ),
  }
);

export default function Page() {
  return <DailyLeaderboardClient />;
}
