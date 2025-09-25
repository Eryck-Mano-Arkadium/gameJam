export const metadata = {
    title: 'Streak Trivia',
    description: 'Multiplayer-feel synchronized trivia – Jam MVP'
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
          <header style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
            <nav
              aria-label="Main"
              style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <a href="/" className="nav-link">Home</a>
              <a href="/name" className="nav-link">Insert Name</a>
              <a href="/infinity" className="nav-link">Play Infinity</a>
              <a href="/leaderboard" className="nav-link">Leaderboard</a>
              <a href="/daily" className="nav-link">Daily (stub)</a>
              <a href="/speed" className="nav-link">Speed Run (stub)</a>
            </nav>
          </header>
          <main style={{ padding: '16px' }}>{children}</main>
        </body>
      </html>
    );
  }