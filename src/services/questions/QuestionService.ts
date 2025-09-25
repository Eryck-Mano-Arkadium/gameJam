import raw from "@/data/questions.json";

export type Question = {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  category: string;
  correct: "a" | "b" | "c" | "d";
};

const clean = (v: any) => (v ?? "").toString().trim();
const canon = (k: string) =>
  clean(k)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // e.g. "Correct answer" -> "correctanswer"
const letterFromIndex = (idx: number): "a" | "b" | "c" | "d" =>
  (["a", "b", "c", "d"] as const)[Math.max(0, Math.min(3, idx))];

function buildDict(row: any): Record<string, string> {
  const dict: Record<string, string> = {};
  for (const [k, v] of Object.entries(row ?? {})) dict[canon(k)] = clean(v);
  return dict;
}

function resolveOptions(dict: Record<string, string>) {
  // Support A/B/C/D (any case), a/b/c/d, optionA, options.a, etc. (canonicalization already handled most)
  const a = dict["a"] ?? dict["optiona"] ?? dict["optionsa"] ?? "";
  const b = dict["b"] ?? dict["optionb"] ?? dict["optionsb"] ?? "";
  const c = dict["c"] ?? dict["optionc"] ?? dict["optionsc"] ?? "";
  const d = dict["d"] ?? dict["optiond"] ?? dict["optionsd"] ?? "";
  return { a, b, c, d };
}

function resolveCorrect(
  dict: Record<string, string>,
  opts: { a: string; b: string; c: string; d: string }
): "a" | "b" | "c" | "d" {
  // Candidates that may contain the correct answer
  const candidates = [
    "correct",
    "correctanswer",
    "answer",
    "correctoption",
    "answerletter",
    "correctindex",
    "answerindex",
    "correct_option",
    "answer_option", // (covered by canonicalization)
  ];

  let rawVal: string | undefined;
  for (const key of candidates) {
    if (dict[key] != null && dict[key] !== "") {
      rawVal = dict[key];
      break;
    }
  }

  // 1) Single letter A-D
  if (rawVal && /^[a-d]$/i.test(rawVal)) return rawVal.toLowerCase() as any;

  // 2) Index (0..3 or 1..4)
  if (rawVal && /^[0-9]+$/.test(rawVal)) {
    const n = Number(rawVal);
    return n >= 0 && n <= 3 ? letterFromIndex(n) : letterFromIndex(n - 1);
  }

  // 3) Full answer text match
  if (rawVal) {
    const text = rawVal.toLowerCase();
    const map: Record<"a" | "b" | "c" | "d", string> = {
      a: clean(opts.a).toLowerCase(),
      b: clean(opts.b).toLowerCase(),
      c: clean(opts.c).toLowerCase(),
      d: clean(opts.d).toLowerCase(),
    };
    for (const k of ["a", "b", "c", "d"] as const) {
      if (text === map[k]) return k;
    }
  }

  // 4) Last resort: try to infer from “true” flags if present (some datasets have boolean flags)
  const flags = {
    a: dict["acorrect"] ?? dict["atrue"],
    b: dict["bcorrect"] ?? dict["btrue"],
    c: dict["ccorrect"] ?? dict["ctrue"],
    d: dict["dcorrect"] ?? dict["dtrue"],
  };
  for (const k of ["a", "b", "c", "d"] as const) {
    if (flags[k] && /^true$/i.test(flags[k]!)) return k;
  }

  // Fallback with one-time warning in dev
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "[QuestionService] Could not resolve correct answer for row:",
      dict
    );
  }
  return "a";
}

function normalizeOne(row: any): Question {
  const dict = buildDict(row);

  const question = dict["question"] ?? dict["q"] ?? dict["prompt"] ?? "";
  const category = dict["category"] ?? dict["topic"] ?? "General";

  const opts = resolveOptions(dict);
  const correct = resolveCorrect(dict, opts);

  return {
    question,
    category,
    a: opts.a,
    b: opts.b,
    c: opts.c,
    d: opts.d,
    correct,
  };
}

export class QuestionService {
  private readonly list: Question[] = (raw as any[]).map(normalizeOne);

  getQuestionByRound(roundId: number): Question {
    const len = this.list.length || 1;
    const idx = ((roundId % len) + len) % len;
    return this.list[idx];
  }

  all(): Question[] {
    return this.list;
  }
}
