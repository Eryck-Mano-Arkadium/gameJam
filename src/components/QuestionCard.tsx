"use client";

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
  const baseBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d0d7de",
    background: "#f6f8fa",
    color: "#24292f",
    cursor: disabled ? "not-allowed" : "pointer",
  };
  const selectedStyle: React.CSSProperties = {
    ...baseBtnStyle,
    background: "#0366d6",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#0366d6",
    color: "#ffffff",
  };
  const keyStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "rgba(0,0,0,0.1)",
    color: "inherit",
    fontWeight: 600,
  };
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
      {revealCorrectInline && (
        <div style={{ color: "green" }}>
          Correct answer:{correct.toUpperCase()}
        </div>
      )}
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
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                width: 0,
                height: 0,
              }}
            />
            <div
              role="button"
              aria-pressed={value === k}
              style={value === k ? selectedStyle : baseBtnStyle}
            >
              <span aria-hidden="true" style={keyStyle}>
                {k.toUpperCase()}
              </span>
              <span id={`opt-${k}`}>{get(k)}</span>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
