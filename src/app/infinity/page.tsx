import dynamic from 'next/dynamic';

export const metadata = { title: 'Streak Trivia – Infinity' };

// 👇 Load the client component only on the client (no SSR → no hydration)
const InfinityClient = dynamic(() => import('./InfinityClient'), {
  ssr: false,
  loading: () => (
    <section className="container">
      <h1>Infinity Mode</h1>
      <p>Loading…</p>
    </section>
  ),
});

export default function Page() {
  return <InfinityClient />;
}