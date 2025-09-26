import dynamic from "next/dynamic";

export const metadata = { title: "Streak Trivia – Speed Leaderboard" };

const SpeedLeaderboardClient = dynamic(
  () => import("./SpeedLeaderboardClient"),
  {
    ssr: false,
    loading: () => (
      <main className="container" style={{ padding: "48px 20px" }}>
        <h1>Speed Run — Leaderboard</h1>
        <p>Loading…</p>
      </main>
    ),
  }
);

export default function Page() {
  return <SpeedLeaderboardClient />;
}
