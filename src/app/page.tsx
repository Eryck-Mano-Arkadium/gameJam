"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navigate } from "@/utils/nav";
import { PlayerService } from "@/services/player/PlayerService";
import { splashRoot, content } from "./splash.css";
import { srOnly } from "@/styles/utils.css";

export default function SplashPage() {
  const router = useRouter();
  const ps = new PlayerService();

  // useEffect(() => {
  //   const t = setTimeout(() => router.push("/welcome"), 3000);
  //   return () => clearTimeout(t);
  // }, [router]);

  const go = () => {
    const hasName = (ps.getName() || "").trim().length > 0;
    navigate(router as any, hasName ? "/modes" : "/welcome");
  };

  return (
    <main
      className={splashRoot}
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
      aria-label="Go to name screen"
    >
      {/* Accessible text (hidden visually, useful for screen readers) */}
      <div className={content}>
        <h1 className={srOnly}>Streak Trivia</h1>
        <p className={srOnly}>
          A synchronized, multiplayer-feel trivia game. Click to continue to the
          name screen.
        </p>
      </div>
    </main>
  );
}
