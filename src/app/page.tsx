import ModeSwitcher from '@/components/ModeSwitcher';

export default function Page() {
  return (
    <section className="container">
      <h1>Streak Trivia</h1>
      <p>A synchronized, multiplayer-feel trivia game. This MVP focuses on <strong>Infinity Mode</strong>.</p>

      <div className="card" aria-labelledby="modes-h">
        <h2 id="modes-h">Modes</h2>
        <ul>
          <li><strong>Infinity</strong>: one global 30s round loop anyone can join anytime.</li>
          <li><strong>Daily Challenge</strong>: one shared puzzle per day. (stub)</li>
          <li><strong>Speed Run</strong>: fixed number of questions, go fast. (stub)</li>
        </ul>
      </div>

      <ModeSwitcher />

      <div style={{ marginTop: 16 }}>
        <a className="btn" href="/infinity" aria-label="Start Infinity Mode">Play Infinity</a>
        <a className="btn" href="/name" style={{ marginLeft: 8 }}>Insert Name</a>
      </div>
    </section>
  );
}