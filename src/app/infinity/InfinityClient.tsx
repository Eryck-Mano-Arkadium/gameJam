"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useClock } from "@/hooks/useClock";
import { useAudio } from "@/hooks/useAudio";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import RevealPanel from "@/components/RevealPanel";
import Leaderboard from "@/components/Leaderboard";
import LiveRegion from "@/components/LiveRegion";
import { QuestionService } from "@/services/questions/QuestionService";
import { PlayerService } from "@/services/player/PlayerService";

const qs = new QuestionService();
const ps = new PlayerService();

type RoundAnswer = { roundId: number; choice?: "a" | "b" | "c" | "d" };

export default function InfinityClient() {
  // Hooks (always called; client-only now)
  const clock = useClock();
  const audio = useAudio();
  const { submit, recordsForRound } = useLeaderboard();

  // It’s safe to read localStorage on the first render now (no SSR)
  const [name, setName] = useState(() => ps.getName() ?? "");
  const [streak, setStreak] = useState<number>(() => ps.getStreak());
  const [streakReachedAt, setStreakReachedAt] = useState<
    Record<number, number>
  >(() => ps.getStreakTimestamps());

  const [answer, setAnswer] = useState<RoundAnswer>({ roundId: -1 });
  const [liveMsg, setLiveMsg] = useState("");
  const lastRoundHandled = useRef<number>(-1);

  const info = clock.phaseInfo();
  const roundId = info.roundId;
  const question = useMemo(() => qs.getQuestionByRound(roundId), [roundId]);

  // Reset selection at start of QUESTION phase for a new round
  useEffect(() => {
    if (info.phase === "QUESTION" && answer.roundId !== roundId) {
      setAnswer({ roundId });
    }
  }, [info.phase, roundId]);

  // Phase transitions: compute correctness, update streaks, submit leaderboard
  useEffect(() => {
    setLiveMsg(
      `Phase: ${info.phase}. ${Math.ceil(
        info.remainingMs / 1000
      )} seconds remaining.`
    );

    if (info.phase === "REVEAL" && lastRoundHandled.current !== roundId) {
      lastRoundHandled.current = roundId;

      const isCorrect = answer.choice === question.correct;
      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      ps.setStreak(nextStreak);

      if (isCorrect && !streakReachedAt[nextStreak]) {
        // deterministic: leaderboard phase start time for this round
        const lbStart = info.roundStartMs + 20000 + 5000;
        const updated = { ...streakReachedAt, [nextStreak]: lbStart };
        setStreakReachedAt(updated);
        ps.setStreakTimestamps(updated);
      }
    }

    if (info.phase === "LEADERBOARD" && name) {
      const tsForStreak = streakReachedAt[streak] ?? info.phaseStartMs;
      submit({ name, streak, lastUpdateTs: tsForStreak, roundId });
    }
  }, [
    info.phase,
    info.roundStartMs,
    info.phaseStartMs,
    info.remainingMs,
    roundId,
    answer.choice,
    question.correct,
    name,
    streak,
    streakReachedAt,
    submit,
  ]);

  // Persist name when it changes
  useEffect(() => {
    if (name && ps.getName() !== name) ps.setName(name);
  }, [name]);

  const onSelect = (choice: "a" | "b" | "c" | "d") =>
    setAnswer({ roundId, choice });
  const disabled = info.phase !== "QUESTION";
  const needsName = !name;

  return (
    <section className="container">
      <h1>Infinity Mode</h1>
      <p>
        Rounds are synchronized globally. You can join anytime; timers are
        shared.
      </p>

      {needsName && (
        <div className="card" role="note" aria-label="Name required">
          <p>
            <strong>Tip:</strong> Add or change your name for the leaderboard.
          </p>
          <p>
            <a className="btn" href="/name">
              Insert / Change Name
            </a>
          </p>
        </div>
      )}

      <div className="row">
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h2>Round #{roundId}</h2>
          <p>
            <strong>Phase:</strong> {info.phase}
          </p>

          <Countdown
            startTs={info.phaseStartMs}
            endTs={info.phaseEndMs}
            nowFn={clock.now}
            warnAt={5}
            onWarn={() => audio.tick()}
            onAnnounce={(text) => setLiveMsg(text)}
          />
        </div>

        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          {info.phase === "QUESTION" && (
            <QuestionCard
              key={`q-${roundId}`}
              category={question.category}
              prompt={question.question}
              options={{
                a: question.a,
                b: question.b,
                c: question.c,
                d: question.d,
              }}
              value={answer.choice}
              onChange={onSelect}
              disabled={disabled}
              correct={question.correct}
            />
          )}

          {info.phase === "REVEAL" && (
            <RevealPanel
              category={question.category}
              prompt={question.question}
              correct={question.correct}
              yourChoice={answer.choice}
              currentStreak={streak}
            />
          )}

          {info.phase === "LEADERBOARD" && (
            <Leaderboard
              roundId={roundId}
              youName={name}
              youStreak={streak}
              records={recordsForRound(roundId)}
            />
          )}
        </div>
      </div>

      {/* <LiveRegion message={liveMsg} /> */}
    </section>
  );
}
