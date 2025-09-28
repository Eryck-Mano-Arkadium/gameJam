"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import { DailyService } from "@/services/daily/DailyService";
import {
  DEFAULT_SCORE,
  scoreForElapsed,
  type ScoreConfig,
} from "@/services/daily/scoring";
import { PlayerService } from "@/services/player/PlayerService";
import { useDailyLeaderboard } from "@/hooks/useDailyLeaderboard";
import * as S from "./daily.css";
import { audioService } from "@/services/audio/AudioService";
import ModeIntro from "@/components/ModeIntro";

const svc = new DailyService();
const ps = new PlayerService();

export default function DailyClient({
  config,
}: {
  config?: Partial<ScoreConfig>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cfg: ScoreConfig = {
    ...DEFAULT_SCORE,
    ...(config ?? {}),
  } as ScoreConfig;

  const initialProgress =
    (typeof window !== "undefined" && svc.getProgress()) || null;

  // null = unknown yet; true|false after first effect
  const [blocked, setBlocked] = useState<boolean | null>(null);

  const [questions] = useState(() => svc.getTodaySet(10));
  const [idx, setIdx] = useState(() => initialProgress?.idx ?? 0);
  const [score, setScore] = useState(() => initialProgress?.score ?? 0);
  const [choice, setChoice] = useState<"a" | "b" | "c" | "d" | undefined>(
    undefined
  );
  const [message, setMessage] = useState("");
  const [qStart, setQStart] = useState(
    () => initialProgress?.qStartMs ?? Date.now()
  );
  const [seenMap, setSeenMap] = useState<Record<number, number>>(
    () => initialProgress?.seen ?? {}
  );
  const [done, setDone] = useState(false);
  const mountedRef = useRef(false);

  const showAnswer = searchParams.get("showanswer") === "true";
  const { date, records, submit } = useDailyLeaderboard(); // today
  const name = ps.getName();

  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowIntro(localStorage.getItem("intro:seen:daily") !== "1");
  }, []);
  const handleIntroClose = () => {
    try {
      localStorage.setItem("intro:seen:daily", "1");
    } catch {}
    setShowIntro(false);
  };

  // On mount: detect if the user already played, and redirect to leaderboard
  useEffect(() => {
    const played = svc.hasPlayedToday();
    setBlocked(played);
    if (played) {
      router.replace("/daily/leaderboard");
    }
  }, [router]);

  const q = useMemo(() => questions[idx], [questions, idx]);

  useEffect(() => {
    if (mountedRef.current) {
      setChoice(undefined);
      setQStart((prev) => {
        const existing = seenMap[idx];
        if (existing != null) return existing;
        const now = Date.now();
        setSeenMap((m) => ({ ...m, [idx]: now }));
        return now;
      });
    }
    mountedRef.current = true;
  }, [idx, seenMap]);

  // Persist progress while playing
  useEffect(() => {
    if (!done && blocked === false) {
      svc.saveProgress(idx, score, qStart, seenMap);
    }
  }, [idx, score, qStart, seenMap, done, blocked]);

  useEffect(() => {
    const handler = () => {
      if (!done && blocked === false) {
        try {
          svc.saveProgress(idx, score, qStart, seenMap);
        } catch {}
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [idx, score, qStart, seenMap, done, blocked]);

  const onPick = (val: "a" | "b" | "c" | "d") => {
    if (done || blocked) return;
    setChoice(val);

    let gained = 0;
    if (val === q.correct) {
      const elapsedMs = Date.now() - qStart;
      gained = scoreForElapsed(elapsedMs, cfg);
      setScore((s) => s + gained);
      setMessage(`Correct! +${gained} points`);
      audioService.playCorrect();
    } else {
      setMessage(`Wrong. +0 points`);
      audioService.playWrong();
    }

    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      setDone(true); // finalize in effect below
    }
  };

  // Finalize once and redirect to /daily/leaderboard
  const pushedRef = useRef(false);
  useEffect(() => {
    if (!done || pushedRef.current) return;
    pushedRef.current = true;

    const final = score;
    svc.markPlayedToday(final);
    svc.clearProgress();
    if (name && name.trim()) submit(name.trim(), final);

    try {
      sessionStorage.setItem("daily:last", String(final));
    } catch {}

    router.replace("/daily/leaderboard");
  }, [done, score, name, submit, router]);

  // While we decide/redirect (blocked === null OR blocked === true), render a tiny placeholder
  if (blocked === null || blocked === true) {
    return (
      <section className="container">
        <h1>Daily Challenge</h1>
        <p>Redirecting…</p>
      </section>
    );
  }

  // Normal play UI
  return (
    <section className={S.screen}>
      {showIntro && <ModeIntro mode="daily" onClose={handleIntroClose} />}
      {!showIntro && (
        <div className={S.container}>
          <img src="/assets/daily-logo.png" alt="logo" className={S.logo} />

          <div className={S.questionContainer}>
            <div className={S.scoreContainer}>
              <img
                src="/assets/daily-score.png"
                alt="score"
                className={S.score}
              />
              <span className={S.questionText}>
                {" "}
                {idx + 1} / {questions.length} Question{" "}
              </span>
              <span className={S.scoreText}>{score}</span>
            </div>
            <div className="card" style={{ flex: 2, minWidth: 320 }}>
              <QuestionCard
                category={q.category}
                prompt={q.question}
                options={{ a: q.a, b: q.b, c: q.c, d: q.d }}
                value={choice}
                onChange={onPick}
                disabled={false}
                correct={q.correct}
                revealCorrectInline={showAnswer}
              />
            </div>
          </div>
        </div>
      )}
      {/* <LiveRegion message={message} /> */}
    </section>
  );
}
