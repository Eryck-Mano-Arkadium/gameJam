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
}: Props) {
  const get = (k: "a" | "b" | "c" | "d") =>
    (options[k] ?? "").toString() || "[missing]";
  return (
    <fieldset
      className={S.card}
      disabled={disabled}
      aria-labelledby="q-legend"
      style={{ border: "none", padding: 0 }}
    >
      {revealCorrectInline && (
        <div
          style={{ color: "green", gridColumn: "1 / -1", marginBottom: "16px" }}
        >
          Correct answer:{correct.toUpperCase()}
        </div>
      )}

      {/* Left side - Question section */}
      <div className={S.questionSection}>
        <legend id="q-legend" className={S.questionText}>
          {prompt}
        </legend>
      </div>

      {/* Right side - Alternatives section */}
      <div
        className={S.alternativesSection}
        role="radiogroup"
        aria-label="Answers"
      >
        {(["a", "b", "c", "d"] as const).map((k) => (
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
              className={S.button}
            >
              <span id={`opt-${k}`}>{get(k)}</span>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
