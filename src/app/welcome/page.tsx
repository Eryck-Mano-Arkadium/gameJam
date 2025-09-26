"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayerService } from "@/services/player/PlayerService";
import { navigate } from "@/utils/nav";

const ps = new PlayerService();

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState(() => ps.getName() ?? "");

  // If a name is already saved, skip this screen
  useEffect(() => {
    const existing = (ps.getName() || "").trim();
    if (existing) navigate(router as any, "/modes");
  }, []);

  return (
    <main className="container" style={{ padding: "48px 20px", maxWidth: 640 }}>
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>Welcome:</h1>

      <form
        className="card"
        style={{ padding: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          ps.setName(n);
          navigate(router as any, "/modes"); // → Page 3
        }}
      >
        <label htmlFor="name" style={{ display: "block", marginBottom: 6 }}>
          Your player name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
          style={{
            width: "100%",
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 18,
          }}
          placeholder="Type your name…"
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit" disabled={!name.trim()}>
            Save &amp; Play
          </button>
        </div>
      </form>
    </main>
  );
}
