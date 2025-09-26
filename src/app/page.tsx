"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navigate } from "@/utils/nav";
import { PlayerService } from "@/services/player/PlayerService";

export default function SplashPage() {
  const router = useRouter();
  const ps = new PlayerService();

  useEffect(() => {
    const hasName = (ps.getName() || "").trim().length > 0;
    const target = hasName ? "/modes" : "/welcome";
    const t = setTimeout(() => navigate(router as any, target), 1500);
    return () => clearTimeout(t);
  }, [router]);

  const go = () => {
    const hasName = (ps.getName() || "").trim().length > 0;
    navigate(router as any, hasName ? "/modes" : "/welcome");
  };

  return (
    <main
      className="container"
      style={{ padding: "48px 20px", minHeight: "100vh", cursor: "pointer" }}
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
      aria-label="Go to name screen"
    >
      <h1 style={{ fontSize: 48, marginBottom: 12 }}>Streak Trivia</h1>
      <p style={{ maxWidth: 720, lineHeight: 1.6 }}>
        A synchronized, multiplayer-feel trivia game. This MVP focuses on
        <strong> Infinity Mode</strong>. Click anywhere to continue…
      </p>
    </main>
  );
}
