"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import LiveRegion from "@/components/LiveRegion";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";
import { QuestionService } from "@/services/questions/QuestionService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSpeedLeaderboard } from "@/hooks/useSpeedLeaderboard";
import { PlayerService } from "@/services/player/PlayerService";
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
  const addScore = useCallback((delta: number) => {
    setScore((s) => Math.max(0, s + delta));
  }, []);

  const [startTs, setStartTs] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | "c" | "d" | undefined>(
    undefined
  );
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  // query param
  const showAnswer = searchParams.get("showanswer") === "true";

  // name + high score
  const [getHigh, setHigh] = useLocalStorage<number>("speedrun_highscore", 0);
  const [highScore, setHighScore] = useState<number>(0);
  const name = ps.getName();

  const endTs = startTs + cfg.durationMs;
  const nowFn = useCallback(() => Date.now(), []);
  const question = useMemo(() => {
    const all = svc.all();
    const safeIndex = ((index % all.length) + all.length) % all.length;
    return all[safeIndex];
  }, [index]);

  // finish when timer ends (no state updates during render)
  useEffect(() => {
    const id = setInterval(() => {
      if (!finished && Date.now() >= endTs) setFinished(true);
    }, 100);
    return () => clearInterval(id);
  }, [endTs, finished]);
  // Load high score once
  useEffect(() => {
    setHighScore(getHigh());
  }, []);

  // Update high score if surpassed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setHigh(score);
    }
  }, [score, highScore, setHigh]);

  // When finished, submit to global LB and redirect to /speed/leaderboard
  const pushedRef = useRef(false);
  useEffect(() => {
    if (!finished || pushedRef.current) return;
    pushedRef.current = true;

    if (name) submit(name, score); // save to global LB

    try {
      sessionStorage.setItem("speedrun:last", String(score)); // show on LB page
    } catch {}
    router.push("/speed/leaderboard");
  }, [finished, name, score, submit, router]);

  const onPick = useCallback(
    (val: "a" | "b" | "c" | "d") => {
      if (finished) return;
      const correct = question.correct;

      if (val === correct) {
        const applied = cfg.pointsCorrect; // always positive
        addScore(applied);
        setMessage(`Correct! +${applied} points.`);
      } else {
        // negative delta, but don't go below 0
        const applied = Math.max(cfg.pointsWrong, -score); // e.g., -20, or -10, or 0
        addScore(applied);
        setMessage(`Wrong. ${applied >= 0 ? `+${applied}` : applied} points.`);
      }

      setChoice(undefined);
      setIndex((i) => i + 1);
    },
    [
      finished,
      question.correct,
      cfg.pointsCorrect,
      cfg.pointsWrong,
      addScore,
      score,
    ]
  );

  // optional manual submit (if you ever add a button)
  const submitSkip = useCallback(() => {
    if (finished) return;

    if (!choice) {
      const applied = Math.max(cfg.pointsWrong, -score);
      addScore(applied);
      setMessage(
        `No answer. ${applied >= 0 ? `+${applied}` : applied} points.`
      );
    } else if (choice === question.correct) {
      const applied = cfg.pointsCorrect;
      addScore(applied);
      setMessage(`Correct! +${applied} points.`);
    } else {
      const applied = Math.max(cfg.pointsWrong, -score);
      addScore(applied);
      setMessage(`Wrong. ${applied >= 0 ? `+${applied}` : applied} points.`);
    }

    setChoice(undefined);
    setIndex((i) => i + 1);
  }, [
    choice,
    finished,
    question.correct,
    cfg.pointsCorrect,
    cfg.pointsWrong,
    addScore,
    score,
  ]);

  const reset = () => {
    setStartTs(Date.now());
    setIndex(0);
    setChoice(undefined);
    setScore(0);
    setMessage("");
    setFinished(false);
  };

  return (
    <section className={S.screen}>
      <div className={S.container}>
        <img src="/assets/speed-logo.png" alt="logo" className={S.logo} />

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
            </div>
            <Countdown
              startTs={startTs}
              endTs={endTs}
              nowFn={nowFn}
              warnAt={5}
              onAnnounce={setMessage}
              variant="timebar"
              fillMode="remaining" // 👈 left orange = time left
            />
            <div>
              {showAnswer && <span> Correct Answer: {question.correct}</span>}
            </div>
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
          </div>
        )}
      </div>
    </section>
  );
}
