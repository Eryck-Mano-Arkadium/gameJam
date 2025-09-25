type Props = {
  category: string;
  prompt: string;
  correct: "a" | "b" | "c" | "d";
  yourChoice?: "a" | "b" | "c" | "d";
  currentStreak: number;
};

export default function RevealPanel({
  category,
  prompt,
  correct,
  yourChoice,
  currentStreak,
}: Props) {
  const isCorrect = yourChoice && yourChoice === correct;
  return (
    <div className="card" aria-live="polite" aria-atomic="true">
      <p>
        <strong>{category}</strong> — {prompt}
      </p>
      <p>
        Correct answer: <strong>{correct?.toUpperCase()}</strong>{" "}
        {yourChoice
          ? `(you picked ${yourChoice.toUpperCase()})`
          : `(no answer)`}
      </p>
      <p>
        Result:{" "}
        <strong>{isCorrect ? "✅ Correct" : "❌ Wrong or No Answer"}</strong>
      </p>
      <p>
        Your current streak: <strong>{currentStreak}</strong>
      </p>
    </div>
  );
}
