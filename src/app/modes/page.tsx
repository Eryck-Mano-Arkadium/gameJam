// src/app/modes/page.tsx
import { resolveHref } from "@/utils/nav";

function Card({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={resolveHref(href)}
      className="card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "#444" }}>{desc}</p>
    </a>
  );
}

export default function ModesPage() {
  return (
    <main className="container" style={{ padding: "32px 20px" }}>
      <h1>Select a mode</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card
          title="Daily Challenge"
          desc="One shared puzzle per day. (stub)"
          href="/daily"
        />
        <Card
          title="Speed Run"
          desc="Fixed number of questions; go fast. (stub)"
          href="/speed"
        />
        <Card
          title="Infinity"
          desc="One global 30s loop anyone can join anytime."
          href="/infinity"
        />
      </div>
    </main>
  );
}
