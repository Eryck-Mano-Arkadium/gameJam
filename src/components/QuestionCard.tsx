"use client";

type Props = {
  category: string;
  prompt: string;
  options: { a: string; b: string; c: string; d: string };
  value?: "a" | "b" | "c" | "d";
  onChange: (val: "a" | "b" | "c" | "d") => void;
  disabled?: boolean;
  correct: "a" | "b" | "c" | "d";
};

export default function QuestionCard({
  category,
  prompt,
  options,
  value,
  onChange,
  disabled,
  correct,
}: Props) {
  const get = (k: "a" | "b" | "c" | "d") =>
    (options[k] ?? "").toString() || "[missing]";
  return (
    <fieldset
      className="card"
      disabled={disabled}
      aria-labelledby="q-legend"
      style={{ border: "none", padding: 0 }}
    >
      <legend id="q-legend">
        <strong>{category}</strong> — {prompt}
      </legend>
      <div style={{color: "#ffff"}}>Correct answer:{correct.toUpperCase()}</div>
      <div role="radiogroup" aria-label="Answers">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <label key={k} style={{ display: "block", marginTop: 8 }}>
            <input
              type="radio"
              name="answer"
              value={k}
              checked={value === k}
              onChange={() => onChange(k)}
              aria-checked={value === k}
            />{" "}
            <span
              className={value === k ? "selected" : undefined}
              id={`opt-${k}`}
            >
              {k.toUpperCase()}. {get(k)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
