"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import LiveRegion from "@/components/LiveRegion";
import { QuestionService } from "@/services/questions/QuestionService";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type SpeedrunConfig = {
  durationMs: number;
  pointsCorrect: number;
  pointsWrong: number;
};

const DEFAULT_CONFIG: SpeedrunConfig = {
  durationMs: 60_000,
  pointsCorrect: 50,
  pointsWrong: -20,
};

const svc = new QuestionService();

export default function SpeedClient({
  config,
}: {
  config?: Partial<SpeedrunConfig>;
}) {
  const searchParams = useSearchParams();
  const cfg: SpeedrunConfig = {
    ...DEFAULT_CONFIG,
    ...(config ?? {}),
  } as SpeedrunConfig;

  const [startTs] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | "c" | "d" | undefined>(
    undefined
  );
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  // Check for showanswer query parameter
  const showAnswer = searchParams.get("showanswer") === "true";
  const [getHigh, setHigh] = useLocalStorage<number>("speedrun_highscore", 0);
  const [highScore, setHighScore] = useState<number>(0);

  const endTs = startTs + cfg.durationMs;
  const nowFn = useCallback(() => Date.now(), []);

  const question = useMemo(() => {
    const all = svc.all();
    const safeIndex = ((index % all.length) + all.length) % all.length;
    return all[safeIndex];
  }, [index]);

  const submit = useCallback(() => {
    if (finished) return;
    const correct = question.correct;
    if (!choice) {
      setScore((s) => s + cfg.pointsWrong);
      setMessage(`No answer. -${Math.abs(cfg.pointsWrong)} points.`);
    } else if (choice === correct) {
      setScore((s) => s + cfg.pointsCorrect);
      setMessage(`Correct! +${cfg.pointsCorrect} points.`);
    } else {
      setScore((s) => s + cfg.pointsWrong);
      setMessage(`Wrong. -${Math.abs(cfg.pointsWrong)} points.`);
    }
    setChoice(undefined);
    setIndex((i) => i + 1);
  }, [choice, finished, question.correct, cfg.pointsCorrect, cfg.pointsWrong]);

  const onPick = useCallback(
    (val: "a" | "b" | "c" | "d") => {
      if (finished) return;
      setChoice(val);
      // Instant submit and advance on selection for speedrun
      const isCorrect = val === question.correct;
      if (isCorrect) {
        setScore((s) => s + cfg.pointsCorrect);
        setMessage(`Correct! +${cfg.pointsCorrect} points.`);
      } else {
        setScore((s) => s + cfg.pointsWrong);
        setMessage(`Wrong. -${Math.abs(cfg.pointsWrong)} points.`);
      }
      setChoice(undefined);
      setIndex((i) => i + 1);
    },
    [finished, question.correct, cfg.pointsCorrect, cfg.pointsWrong]
  );

  const remainingMs = Math.max(0, endTs - nowFn());
  if (!finished && remainingMs === 0) setFinished(true);

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
  console.log(showAnswer)

  return (
    <section className="container">
      <h1>Speedrun</h1>

      {!finished ? (
        <>
          <Countdown
            startTs={startTs}
            endTs={endTs}
            nowFn={nowFn}
            warnAt={5}
            onAnnounce={setMessage}
          />
          <div style={{ marginTop: 12 }}>
            <p>
              Score: <strong>{score}</strong> • High score:{" "}
              <strong>{highScore}</strong>
            </p>
          </div>
          <div style={{ marginTop: 12 }}>
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
              revealCorrectInline={showAnswer}
            />
          </div>
          {/* No submit button in speedrun; selection advances automatically */}
        </>
      ) : (
        <div className="card" aria-live="polite" aria-atomic="true">
          <p>Time is up!</p>
          <p>
            Your final score: <strong>{score}</strong>
          </p>
          <p>
            High score: <strong>{highScore}</strong>
          </p>
          <p>Leaderboard coming soon.</p>
        </div>
      )}

      <LiveRegion message={message} />
    </section>
  );
}
