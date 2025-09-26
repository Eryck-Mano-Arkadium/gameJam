"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import LiveRegion from "@/components/LiveRegion";
import { DailyService } from "@/services/daily/DailyService";
import { DEFAULT_SCORE, scoreForElapsed, type ScoreConfig } from "@/services/daily/scoring";

// ScoreConfig and defaults are imported

const svc = new DailyService();

export default function DailyClient({ config }: { config?: Partial<ScoreConfig> }) {
  const cfg: ScoreConfig = { ...DEFAULT_SCORE, ...(config ?? {}) } as ScoreConfig;

  const initialProgress = (typeof window !== "undefined" && svc.getProgress()) || null;
  const [blocked, setBlocked] = useState(false);
  const [questions] = useState(() => svc.getTodaySet(10));
  const [idx, setIdx] = useState(() => initialProgress?.idx ?? 0);
  const [score, setScore] = useState(() => initialProgress?.score ?? 0);
  const [choice, setChoice] = useState<"a" | "b" | "c" | "d" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [qStart, setQStart] = useState(() => initialProgress?.qStartMs ?? Date.now());
  const [seenMap, setSeenMap] = useState<Record<number, number>>(
    () => initialProgress?.seen ?? {}
  );
  const [done, setDone] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    setBlocked(svc.hasPlayedToday());
    if (initialProgress) setMessage("Resumed today’s challenge.");
  }, []);

  const q = useMemo(() => questions[idx], [questions, idx]);

  useEffect(() => {
    if (mountedRef.current) {
      setChoice(undefined);
      // use first-seen timestamp for this index; if none, record now
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

  // Persist progress whenever key fields change and run a beforeunload safety
  useEffect(() => {
    if (!done && !blocked) {
      svc.saveProgress(idx, score, qStart, seenMap);
    }
  }, [idx, score, qStart, seenMap, done, blocked]);

  useEffect(() => {
    const handler = () => {
      if (!done && !blocked) {
        try { svc.saveProgress(idx, score, qStart, seenMap); } catch {}
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [idx, score, qStart, seenMap, done, blocked]);

  const onPick = (val: "a" | "b" | "c" | "d") => {
    if (done || blocked) return;
    setChoice(val);
    if (val === q.correct) {
      const elapsedMs = Date.now() - qStart;
      const gained = scoreForElapsed(elapsedMs, cfg);
      setScore((s) => s + gained);
      setMessage(`Correct! +${gained} points`);
    } else {
      setMessage(`Wrong. +0 points`);
    }

    // advance and persist when finishing
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      // ensure we persist the latest score value
      setScore((prev) => {
        svc.markPlayedToday(prev);
        svc.clearProgress();
        return prev;
      });
    }
  };

  if (blocked) {
    return (
      <section className="container">
        <h1>Daily Challenge</h1>
        <div className="card">
          <p>You already played today. Come back tomorrow!</p>
          <p>Your score today: <strong>{svc.getTodayScore()}</strong></p>
          <p style={{ marginTop: 12 }}>
            Try other modes:
            {" "}
            <a className="btn" href="/speed">Speedrun</a>
            {" "}
            <a className="btn" href="/infinity" style={{ marginLeft: 8 }}>Infinity</a>
          </p>
          <p style={{ marginTop: 12 }}>
            Today’s leaderboard will be shown here. (Coming soon)
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container">
      <h1>Daily Challenge</h1>
      <div className="row">
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h2>Session</h2>
          <p>
            <strong>Question:</strong> {idx + 1} / {questions.length}
          </p>
          <p>
            <strong>Score:</strong> {score}
          </p>
        </div>
        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          {!done ? (
            <QuestionCard
              category={q.category}
              prompt={q.question}
              options={{ a: q.a, b: q.b, c: q.c, d: q.d }}
              value={choice}
              onChange={onPick}
              disabled={false}
              correct={q.correct}
            />
          ) : (
            <div aria-live="polite" aria-atomic="true">
              <p>Nice work — you’re done for today!</p>
              <p>Your final score: <strong>{score}</strong></p>
              <p>Come back tomorrow for a new set of questions.</p>
            </div>
          )}
        </div>
      </div>
      <LiveRegion message={message} />
    </section>
  );
}


