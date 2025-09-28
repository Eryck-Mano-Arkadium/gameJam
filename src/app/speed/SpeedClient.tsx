"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";
import ModeIntro from "@/components/ModeIntro";
import { QuestionService } from "@/services/questions/QuestionService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSpeedLeaderboard } from "@/hooks/useSpeedLeaderboard";
import { PlayerService } from "@/services/player/PlayerService";
import { audioService } from "@/services/audio/AudioService";
import type { Route } from "next";
import * as S from "./speed.css";

type SpeedrunConfig = {
  durationMs: number;
  pointsCorrect: number;
  pointsWrong: number;
};
const DEFAULT_CONFIG: SpeedrunConfig = {
  durationMs: 40_000,
  pointsCorrect: 50,
  pointsWrong: -20,
};

const svc = new QuestionService();
const ps = new PlayerService();

export default function SpeedClient({
  config,
}: {
  config?: Partial<SpeedrunConfig>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, submit } = useSpeedLeaderboard();
  const cfg: SpeedrunConfig = {
    ...DEFAULT_CONFIG,
    ...(config ?? {}),
  } as SpeedrunConfig;

  // ---- Intro gate -----------------------------------------------------------
  const [showIntro, setShowIntro] = useState<boolean | null>(null); // null = unresolved
  useEffect(() => {
    if (typeof window === "undefined") return;
    const needIntro = localStorage.getItem("intro:seen:speed") !== "1";
    setShowIntro(needIntro);
    if (!needIntro) {
      setStartTs(Date.now()); // <-- start immediately if no intro needed
    }
  }, []);

  const handleIntroClose = () => {
    try {
      localStorage.setItem("intro:seen:speed", "1");
    } catch {}
    setShowIntro(false);
    setStartTs(Date.now()); // <-- start when user closes intro
  };

  // ---- Game state -----------------------------------------------------------
  const [startTs, setStartTs] = useState<number | null>(null); // ⟵ null until intro closes

  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | "c" | "d" | undefined>(
    undefined
  );
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  // Finish when timer ends (only after intro closed / startTs set)
  useEffect(() => {
    if (startTs == null) return;
    const id = setInterval(() => {
      if (!finished && Date.now() >= startTs + cfg.durationMs)
        setFinished(true);
    }, 100);
    return () => clearInterval(id);
  }, [startTs, cfg.durationMs, finished]);

  const addScore = useCallback(
    (delta: number) => setScore((s) => Math.max(0, s + delta)),
    []
  );

  const showAnswer = searchParams.get("showanswer") === "true";
  const [getHigh, setHigh] = useLocalStorage<number>("speedrun_highscore", 0);
  const [highScore, setHighScore] = useState<number>(0);
  const name = ps.getName();

  const endTs = startTs ? startTs + cfg.durationMs : 0;
  const nowFn = useCallback(() => Date.now(), []);
  const question = useMemo(() => {
    const all = svc.all();
    const safeIndex = ((index % all.length) + all.length) % all.length;
    return all[safeIndex];
  }, [index]);

  // Finish when timer ends (only after intro closed)
  useEffect(() => {
    if (!startTs) return;
    const id = setInterval(() => {
      if (!finished && Date.now() >= endTs) setFinished(true);
    }, 100);
    return () => clearInterval(id);
  }, [startTs, endTs, finished]);

  useEffect(() => setHighScore(getHigh()), []); // load high
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setHigh(score);
    }
  }, [score, highScore, setHigh]);

  const pushedRef = useRef(false);
  useEffect(() => {
    if (!finished || pushedRef.current) return;
    pushedRef.current = true;
    if (name) submit(name, score);
    try {
      sessionStorage.setItem("speedrun:last", String(score));
    } catch {}
    router.push("/speed/leaderboard");
  }, [finished, name, score, submit, router]);

  // onPick must also require startTs
  const onPick = useCallback(
    (val: "a" | "b" | "c" | "d") => {
      if (finished || startTs == null) return; // <-- guard
      const correct = question.correct;
      if (val === correct) {
        const applied = cfg.pointsCorrect;
        addScore(applied);
        setMessage(`Correct! +${applied} points.`);
        audioService.playCorrect();
      } else {
        const applied = Math.max(cfg.pointsWrong, -score);
        addScore(applied);
        setMessage(`Wrong. ${applied >= 0 ? `+${applied}` : applied} points.`);
        audioService.playWrong();
      }
      setChoice(undefined);
      setIndex((i) => i + 1);
    },
    [
      finished,
      startTs,
      question.correct,
      cfg.pointsCorrect,
      cfg.pointsWrong,
      addScore,
      score,
    ]
  );

  // Reset
  const reset = () => {
    setIndex(0);
    setChoice(undefined);
    setScore(0);
    setMessage("");
    setFinished(false);
    setStartTs(Date.now());
  };

  // ---- UI -------------------------------------------------------------------
  return (
    <section className={S.screen}>
      <div className={S.container}>
        <img src="/assets/speed-logo.png" alt="logo" className={S.logo} />

        {/* Intro modal (blocks until dismissed) */}
        {showIntro && <ModeIntro mode="speed" onClose={handleIntroClose} />}

        {!finished ? (
          <>
            <div className={S.questionContainer}>
              <div className={S.scoreContainer}>
                <img
                  src="/assets/daily-score.png"
                  alt="score"
                  className={S.score}
                />
                <span className={S.questionText}>Question {index + 1}</span>
                <span className={S.scoreText}>{score}</span>
              </div>

              {/* Hide questions until intro closed */}
              {startTs !== null && (
                <QuestionCard
                  category={question.category}
                  prompt={question.question}
                  options={{
                    a: question.a,
                    b: question.b,
                    c: question.c,
                    d: question.d,
                  }}
                  value={choice}
                  onChange={onPick}
                  disabled={false}
                  correct={question.correct}
                />
              )}
            </div>

            {/* Hide countdown until intro closed */}
            {!showIntro && (
              <Countdown
                startTs={startTs ?? 0}
                endTs={endTs}
                nowFn={nowFn}
                warnAt={5}
                onAnnounce={setMessage}
                variant="timebar"
                fillMode="remaining"
              />
            )}
          </>
        ) : (
          <div className="card" aria-live="polite" aria-atomic="true">
            <p>Time is up!</p>
            <p>
              Your final score: <strong>{score}</strong>
            </p>
            <p>
              Personal best: <strong>{highScore}</strong>
            </p>
            <div style={{ marginTop: 12 }}>
              <SpeedLeaderboard
                records={records}
                youName={name}
                youScore={score}
                youBestScore={highScore}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn" onClick={reset}>
                Play again
              </button>
              <Link className="btn" href={"/speed/leaderboard" as Route}>
                Full leaderboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
