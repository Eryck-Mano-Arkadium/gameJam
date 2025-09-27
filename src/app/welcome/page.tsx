"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayerService } from "@/services/player/PlayerService";
import { navigate } from "@/utils/nav";
import * as S from "./name.css";

const ps = new PlayerService();

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState(() => ps.getName() ?? "");

  // Load existing name if available, but allow changes
  useEffect(() => {
    const existing = ps.getName();
    if (existing) setName(existing);
  }, []);

  return (
    <main className={S.wrapper}>
      <img src="/assets/Logo.png" alt="logo" width={410} height={276} className={S.logo} />

      <form
        className={S.form}
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          ps.setName(n);
          navigate(router as any, "/modes"); // → Page 3
        }}
      >
        <label htmlFor="name" className={S.label}>
          Enter your name
        </label>
        <input
          id="name"
          value={name}
          className={S.input}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
        />
        <div>
          <button className={S.btn} type="submit" disabled={!name.trim()}>
            OK
          </button>
        </div>
      </form>
    </main>
  );
}
