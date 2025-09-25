import dynamic from 'next/dynamic';

export const metadata = { title: 'Streak Trivia – Speedrun' };

const SpeedClient = dynamic(() => import('./SpeedClient'), {
  ssr: false,
  loading: () => (
    <section className="container">
      <h1>Speedrun</h1>
      <p>Loading…</p>
    </section>
  ),
});

export default function SpeedPage() {
  return <SpeedClient />;
}
