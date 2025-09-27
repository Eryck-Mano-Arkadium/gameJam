// src/components/QuestionCard.tsx
"use client";

import * as S from "./questionCard.css";

type Props = {
  category: string;
  prompt: string;
  options: { a: string; b: string; c: string; d: string };
  value?: "a" | "b" | "c" | "d";
  onChange: (val: "a" | "b" | "c" | "d") => void;
  disabled?: boolean;
  correct: "a" | "b" | "c" | "d";
  revealCorrectInline?: boolean;
  /** NEW: when true, show correct=green and wrong choice=red */
  reveal?: boolean;
};

export default function QuestionCard({
  category,
  prompt,
  options,
  value,
  onChange,
  disabled,
  correct,
  revealCorrectInline = false,
  reveal = false,
}: Props) {
  const get = (k: "a" | "b" | "c" | "d") =>
    (options[k] ?? "").toString() || "[missing]";

  return (
    <fieldset
      className={`${S.card} ${reveal ? S.revealRoot : ""}`}
      disabled={disabled}
      aria-labelledby="q-legend"
      style={{ border: "none", padding: 0 }}
    >
      {revealCorrectInline && (
        <div style={{ color: "green", gridColumn: "1 / -1", marginBottom: 16 }}>
          Correct answer: {correct.toUpperCase()}
        </div>
      )}

      {/* Left – question */}
      <div className={S.questionSection}>
        <legend id="q-legend" className={S.questionText}>
          {prompt}
        </legend>
      </div>

      {/* Right – options */}
      <div
        className={S.alternativesSection}
        role="radiogroup"
        aria-label="Answers"
      >
        {(["a", "b", "c", "d"] as const).map((k) => {
          const isCorrect = reveal && k === correct;
          const isChosenWrong = reveal && value === k && value !== correct;
          return (
            <label key={k} className={S.inputWrapper}>
              <input
                type="radio"
                name="answer"
                value={k}
                checked={value === k}
                onChange={() => onChange(k)}
                aria-checked={value === k}
                className={S.input}
              />
              <div
                role="button"
                aria-pressed={value === k}
                className={`${S.button} ${S.selectedFromInput} ${
                  isCorrect ? S.buttonCorrect : ""
                } ${isChosenWrong ? S.buttonWrong : ""}`}
                {...(isCorrect && reveal
                  ? { "aria-label": "Correct answer" }
                  : {})}
              >
                <span id={`opt-${k}`}>{get(k)}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
