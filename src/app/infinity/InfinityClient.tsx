// src/app/infinity/InfinityClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useClock } from "@/hooks/useClock";
import { useAudio } from "@/hooks/useAudio";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Countdown from "@/components/Countdown";
import QuestionCard from "@/components/QuestionCard";
import RevealPanel from "@/components/RevealPanel";
import Leaderboard from "@/components/Leaderboard";
import LiveRegion from "@/components/LiveRegion";
import { QuestionService } from "@/services/questions/QuestionService";
import { resolveHref } from "@/utils/nav";
import { PlayerService } from "@/services/player/PlayerService";

const qs = new QuestionService();
const ps = new PlayerService();

type RoundAnswer = { roundId: number; choice?: "a" | "b" | "c" | "d" };

export default function InfinityClient() {
  const searchParams = useSearchParams();
  const clock = useClock();
  const audio = useAudio();
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
        setFakePlayerCount(prev => {
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
            <a className="btn" href={resolveHref("/name")}>
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
            <>
              {fakePlayerCount > 0 && (
                <div style={{ 
                  marginBottom: 16, 
                  padding: 8, 
                  backgroundColor: "#f0f8ff", 
                  border: "1px solid #0366d6", 
                  borderRadius: 6,
                  textAlign: "center",
                  fontSize: 14,
                  color: "#0366d6"
                }}>
                  <strong>{fakePlayerCount}</strong> players already responded
                </div>
              )}
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
                revealCorrectInline={showAnswer}
              />
            </>
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
              youBestStreak={bestStreak}
              records={recordsForRound(roundId)}
            />
          )}
        </div>
      </div>

      {/* <LiveRegion message={liveMsg} /> */}
    </section>
  );
}
