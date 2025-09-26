// src/app/infinity/InfinityClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useClock } from "@/hooks/useClock";
import { audioService } from "@/services/audio/AudioService";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import RevealPanel from "@/components/RevealPanel";
import Leaderboard from "@/components/Leaderboard";
import LiveRegion from "@/components/LiveRegion";
import { QuestionService } from "@/services/questions/QuestionService";
import { resolveHref } from "@/utils/nav";
import { PlayerService } from "@/services/player/PlayerService";
import * as S from "./infinity.css";

const qs = new QuestionService();
const ps = new PlayerService();

type RoundAnswer = { roundId: number; choice?: "a" | "b" | "c" | "d" };

export default function InfinityClient() {
  const searchParams = useSearchParams();
  const clock = useClock();
  const { submit, recordsForRound } = useLeaderboard();

  // load from storage immediately (client-only page)
  const [name, setName] = useState(() => ps.getName() ?? "");
  const [streak, setStreak] = useState<number>(() => ps.getStreak());
  const [bestStreak, setBestStreak] = useState<number>(() =>
    ps.getBestStreak()
  );
  const [streakReachedAt, setStreakReachedAt] = useState<
    Record<number, number>
  >(() => ps.getStreakTimestamps());

  const [answer, setAnswer] = useState<RoundAnswer>({ roundId: -1 });
  const [liveMsg, setLiveMsg] = useState("");
  const [fakePlayerCount, setFakePlayerCount] = useState(0);
  const lastRoundHandled = useRef<number>(-1);
  const fakeCountInterval = useRef<NodeJS.Timeout | null>(null);

  const info = clock.phaseInfo();
  const roundId = info.roundId;
  const question = useMemo(() => qs.getQuestionByRound(roundId), [roundId]);

  // Check for showanswer query parameter
  const showAnswer = searchParams.get("showanswer") === "true";

  useEffect(() => {
    if (info.phase === "QUESTION" && answer.roundId !== roundId) {
      setAnswer({ roundId });
    }
  }, [info.phase, roundId]);

  // Handle fake player count during question phase
  useEffect(() => {
    if (info.phase === "QUESTION") {
      // Reset count when new question starts
      if (answer.roundId === roundId) {
        setFakePlayerCount(0);
      }

      // Start the fake count timer
      if (fakeCountInterval.current) {
        clearInterval(fakeCountInterval.current);
      }

      fakeCountInterval.current = setInterval(() => {
        setFakePlayerCount((prev) => {
          // Random increment between 3-150 players per second
          const increment = Math.floor(Math.random() * 40) + 3;
          return prev + increment;
        });
      }, 1000);
    } else {
      // Clear interval when not in question phase
      if (fakeCountInterval.current) {
        clearInterval(fakeCountInterval.current);
        fakeCountInterval.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (fakeCountInterval.current) {
        clearInterval(fakeCountInterval.current);
      }
    };
  }, [info.phase, roundId, answer.roundId]);

  useEffect(() => {
    setLiveMsg(
      `Phase: ${info.phase}. ${Math.ceil(
        info.remainingMs / 1000
      )} seconds remaining.`
    );

    if (info.phase === "REVEAL" && lastRoundHandled.current !== roundId) {
      lastRoundHandled.current = roundId;

      const isCorrect = answer.choice === question.correct;
      if (isCorrect) {
        audioService.playCorrect();
      } else if (answer.choice) {
        audioService.playWrong();
      }
      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      ps.setStreak(nextStreak);

      // 🔥 update personal best
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        ps.setBestStreak(nextStreak);
      }

      if (isCorrect && !streakReachedAt[nextStreak]) {
        const lbStart = info.roundStartMs + 20000 + 5000; // 20s + 5s
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
    bestStreak,
    streakReachedAt,
    submit,
  ]);

  useEffect(() => {
    if (name && ps.getName() !== name) ps.setName(name);
  }, [name]);

  const onSelect = (choice: "a" | "b" | "c" | "d") =>
    setAnswer({ roundId, choice });
  const disabled = info.phase !== "QUESTION";
  const needsName = !name;

  return (
    <section className={S.screen}>
      <div className={S.container}>
        {info.phase !== "LEADERBOARD" && (
          <img src="/assets/infinity-logo.png" alt="logo" className={S.logo} />
        )}

        <div className={S.questionContainer}>
          {info.phase !== "LEADERBOARD" && (
            <div className={S.scoreContainer}>
              <img
                src="/assets/speed-score.png"
                alt="score"
                className={S.score}
              />
              <span className={S.scoreText}>STREAK: {streak}</span>
            </div>
          )}
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
              disabled={false}
              correct={question.correct}
            />
          )}

          {info.phase === "REVEAL" && (
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
              disabled={true}
              correct={question.correct}
              reveal={true} // 👈 highlight correct/choice
            />
          )}
          {info.phase === "LEADERBOARD" && (
            <Leaderboard
              roundId={roundId}
              youName={name}
              youStreak={streak}
              youBestStreak={bestStreak}
              records={recordsForRound(roundId)}
            />
          )}
        </div>
        <div className={S.countdownContainer}>
          <Countdown
            startTs={info.phaseStartMs}
            endTs={info.phaseEndMs}
            nowFn={clock.now}
            warnAt={5}
            onAnnounce={(text) => setLiveMsg(text)}
            variant="timebar"
            fillMode="remaining"
          />
          {fakePlayerCount > 0 && info.phase === "QUESTION" && (
            <div className={S.fakePlayerCount}>
              <strong>{fakePlayerCount}</strong> players already answered!
              {showAnswer && <span> Correct Answer: {question.correct}</span>}
            </div>
          )}
        </div>
        {/* <LiveRegion message={liveMsg} /> */}
      </div>
    </section>
  );
}
