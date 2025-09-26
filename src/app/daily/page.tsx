import dynamic from 'next/dynamic';

export const metadata = { title: 'Streak Trivia – Daily' };

const DailyClient = dynamic(() => import('./DailyClient'), {
  ssr: false,
  loading: () => (
    <section className="container">
      <h1>Daily Challenge</h1>
      <p>Loading…</p>
    </section>
  ),
});

export default function Page() {
  return <DailyClient />;
}
