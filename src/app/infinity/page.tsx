import dynamic from "next/dynamic";

export const metadata = { title: "Streak Trivia – Infinity" };

const InfinityClient = dynamic(() => import("./InfinityClient"), {
  ssr: false,
  loading: () => (
    <main className="container" style={{ padding: "32px 20px" }}>
      <h1>Infinity Mode</h1>
      <p>Loading…</p>
    </main>
  ),
});

export default function Page() {
  return <InfinityClient />;
}
