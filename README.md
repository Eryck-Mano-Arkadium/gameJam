# Streak Trivia (MVP)

## Modes

- Infinity: Global synchronized rounds with QUESTION → REVEAL → LEADERBOARD phases.
- Speedrun: Solo rapid-fire session. Answer as many questions as possible before the timer ends.

## Speedrun Rules

- Duration: default 60 seconds.
- Scoring: +50 points for each correct answer; −20 points for each wrong or skipped answer.
- Flow: pick an option (A–D) and press “Submit & Next” to move to the next question.
- End: when time runs out, your final score is displayed. Leaderboard for this mode is planned.

### High Score

- Your best Speedrun score is saved locally (browser `localStorage`) as you play.
- The high score updates immediately when you surpass it and is shown during/after a run.

## Speedrun Configuration

You can adjust gameplay by passing `config` to `SpeedClient` where it is used.

- durationMs: total time window (default 60000)
- pointsCorrect: points for a correct answer (default 50)
- pointsWrong: points for a wrong or missed answer (default -20)

Example (in `src/app/speed/page.tsx`):

```tsx
<SpeedClient config={{ durationMs: 90_000, pointsCorrect: 75, pointsWrong: -25 }} />
```

## Dev

- Questions are loaded from `src/data/questions.json` via `QuestionService`.
- UI components: `QuestionCard`, `Countdown`, `LiveRegion`.
