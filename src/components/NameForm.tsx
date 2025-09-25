"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayerService } from "@/services/player/PlayerService";

const ps = new PlayerService();

export default function NameForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setMounted(true);
    const existing = ps.getName();
    if (existing) setName(existing);
  }, []);

  if (!mounted) return null; // avoid SSR hydration mismatch

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        ps.setName(trimmed);
        router.push("/infinity");
      }}
      aria-labelledby="name-form-title"
    >
      <h2 id="name-form-title">Enter your player name</h2>
      <label htmlFor="player-name">Name</label>
      <input
        id="player-name"
        type="text"
        required
        aria-required="true"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", width: 320, padding: 8, margin: "8px 0" }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" type="submit" disabled={!name.trim()}>
          Save
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setName("");
            ps.setName("");
          }}
          aria-label="Clear saved name"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
